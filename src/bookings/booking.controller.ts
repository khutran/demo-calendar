import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.guards";
import { CreateBookingDto, CreateBookingServiceDto, UpdateBookingDto } from "./booking.dto";
import { BookingService } from "./booking.service";
import { Request } from 'express'; // Import Request từ 'express'
import { plainToClass } from "class-transformer";

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(
        private bookingService: BookingService
    ) { }

    @Post('')
    async createBooking(@Body() body: CreateBookingDto, @Req() request: Request) {
        const user = request["user"];
        return await this.bookingService.createBooking(plainToClass(CreateBookingServiceDto, { ...body, color: user.color, userName: user.userName, email: user.email }));
    }

    @Put(':id')
    async updateBooking(@Param('id') id: string, @Body() body: UpdateBookingDto) {
        return await this.bookingService.updateBooking(id, body);
    }

    @Delete(':id')
    async deleteBooking(@Param('id') id: string) {
        return this.bookingService.deleteBooking(id);
    }
}
