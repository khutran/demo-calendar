import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { BookingEntity, BookingStatus } from "src/entities/booking.entity";
import { BookingNotFoundException } from "src/exceptions";
import { In, Repository } from "typeorm";
import { CancelBookingResultDto, CreateBookingResultDto, CreateBookingServiceDto, UpdateBookingDto, UpdateBookingResultDto } from "./booking.dto";

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(BookingEntity)
        private bookingRepository: Repository<BookingEntity>,
    ) {

    }
    async createBooking(body: CreateBookingServiceDto): Promise<CreateBookingResultDto> {
        try {
            const { startTime, endTime, email } = body;
            const existingBooking = await this.bookingRepository.findOne({
                where: {
                    email: email,
                    isDeleted: false
                }
            });

            // check conflict
            if (existingBooking && (
                (existingBooking.startTime.getTime() <= new Date(startTime).getTime() && new Date(startTime).getTime() <= existingBooking.endTime.getTime()) ||
                (existingBooking.startTime.getTime() <= new Date(endTime).getTime() && new Date(endTime).getTime() <= existingBooking.endTime.getTime())
            )) {
                throw new ConflictException();
            }
            //Save data
            const newBooking = plainToClass(BookingEntity, body);
            await this.bookingRepository.save(newBooking);
            return new CreateBookingResultDto("success");
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async updateBooking(id: string, dataUpdate: UpdateBookingDto) {
        try {
            const booking = await this.bookingRepository.findOne({ where: { id: id, isDeleted: false } });
            if (!booking) {
                throw new BookingNotFoundException()
            }
            if (new Date().getTime() > booking.startTime.getTime()) {
                throw new BookingNotFoundException()
            }
            await this.bookingRepository.update(id, { ...dataUpdate, status: BookingStatus.UPDATE });
            return new UpdateBookingResultDto("success");;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async deleteBooking(id: string) {
        try {
            const booking = await this.bookingRepository.findOne({ where: { id: id, isDeleted: false } });
            if (!booking) {
                throw new BookingNotFoundException()
            }
            if (new Date().getTime() > booking.startTime.getTime()) {
                throw new BookingNotFoundException()
            }
            await this.bookingRepository.update(id, { status: BookingStatus.CANCEL });

            return new CancelBookingResultDto("success");
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
