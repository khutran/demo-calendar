import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronHistoryEntity } from 'src/entities/cron-history';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from 'src/entities/booking.entity';
import { GoogleCalendarModule } from 'src/google-calendar/google-calendar.module';
import { CronLogEntity } from 'src/entities/cron-log.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([BookingEntity, CronHistoryEntity, CronLogEntity]),
    GoogleCalendarModule
  ],
  providers: [CronJobService]
})
export class CronJobModule { }
