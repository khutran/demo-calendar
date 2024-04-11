import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BookingEntity, BookingStatus } from 'src/entities/booking.entity';
import { CronHistoryEntity, CronStatus, JobName } from 'src/entities/cron-history';
import { ActionLog, CronLogEntity } from 'src/entities/cron-log.entity';
import { ConvertDataToEventCalendarDto, CreateEventCalendarDto } from 'src/google-calendar/google-calendar.dto';
import { GoogleCalendarService } from 'src/google-calendar/google-calendar.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class CronJobService {
    constructor(
        @InjectRepository(BookingEntity)
        private bookingRepository: Repository<BookingEntity>,
        @InjectRepository(CronHistoryEntity)
        private cronHistoryRepository: Repository<CronHistoryEntity>,
        @InjectRepository(CronLogEntity)
        private cronLogEntity: Repository<CronLogEntity>,
        private googleCalendarService: GoogleCalendarService
    ) {

    }
    @Cron(CronExpression.EVERY_MINUTE, { name: 'handler-create' })
    async handleCron() {
        console.log('Start called every 1 minute');
        // Check step runing
        try {
            const cron = await this.cronHistoryRepository.findOne({ where: { jobName: JobName.CALENDAR, status: CronStatus.RUN } })
            if (cron) {
                // check job run than 10m
                if ((new Date().getTime() - new Date(cron.createdAt).getTime()) > 600000) {
                    await this.cronHistoryRepository.update(cron.id, { status: CronStatus.STOP });
                } else {
                    return Promise.resolve();
                }
            }

            // Handler events send to google calendar
            const events = await this.bookingRepository.find({ where: { status: In([BookingStatus.ACTIVE, BookingStatus.UPDATE, BookingStatus.CANCEL]) } });
            if (events.length > 0) {
                const _job = await this.cronHistoryRepository.save(plainToClass(CronHistoryEntity, { jobName: JobName.CALENDAR, totalRecord: events.length }));
                for (const event of events) {
                    if (event.status === BookingStatus.ACTIVE) {
                        await this.InsertEventGoogleCalendar(ConvertDataToEventCalendarDto(event), event, _job);
                    } else if (event.status === BookingStatus.UPDATE && event.eventId) {
                        await this.UpdateEventGoogleCalendar(ConvertDataToEventCalendarDto(event), event, _job);
                    } else if (event.status === BookingStatus.CANCEL && event.eventId) {
                        await this.CancelEventGoogleCalendar(ConvertDataToEventCalendarDto(event), event, _job);
                    }
                }
                await this.cronHistoryRepository.update(_job.id, { status: CronStatus.STOP });
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async InsertEventGoogleCalendar(event: CreateEventCalendarDto, booking: BookingEntity, cronHistory: CronHistoryEntity) {
        let isError = false;
        let message = '';
        try {
            const item = await this.googleCalendarService.createEvent(event);
            await this.bookingRepository.update(booking.id, { eventId: item.id, status: BookingStatus.SYNC })
        } catch (e) {
            isError = true;
            message = e.message;
            await this.bookingRepository.update(booking.id, { status: BookingStatus.ERROR })
        }
        const cronLog = plainToClass(CronLogEntity, { action: ActionLog.INSERT, cronHistory: cronHistory, booking: booking, message: message, isError: isError });
        await this.cronLogEntity.save(cronLog);
    }

    async UpdateEventGoogleCalendar(event: CreateEventCalendarDto, booking: BookingEntity, cronHistory: CronHistoryEntity) {
        let isError = false;
        let message = '';
        try {
            await this.googleCalendarService.updateEvent(event);
            await this.bookingRepository.update(booking.id, { status: BookingStatus.SYNC })
        } catch (e) {
            isError = true;
            message = e.message;
            await this.bookingRepository.update(booking.id, { status: BookingStatus.ERROR })
        }
        const cronLog = plainToClass(CronLogEntity, { action: ActionLog.UPDATE, cronHistory: cronHistory, booking: booking, message: message, isError: isError });
        await this.cronLogEntity.save(cronLog);
    }

    async CancelEventGoogleCalendar(event: CreateEventCalendarDto, booking: BookingEntity, cronHistory: CronHistoryEntity) {
        let isError = false;
        let message = '';
        try {
            await this.googleCalendarService.cancelEvent(event);
            await this.bookingRepository.update(booking.id, { status: BookingStatus.SYNC })
        } catch (e) {
            isError = true;
            message = e.message;
            await this.bookingRepository.update(booking.id, { isDeleted: true, status: BookingStatus.ERROR })
        }
        const cronLog = plainToClass(CronLogEntity, { action: ActionLog.CANCEL, cronHistory: cronHistory, booking: booking, message: message, isError: isError });
        await this.cronLogEntity.save(cronLog);
    }
}