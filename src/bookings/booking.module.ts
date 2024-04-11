import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { BookingEntity } from 'src/entities/booking.entity';
import { GoogleCalendarModule } from 'src/google-calendar/google-calendar.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BookingEntity]),
        GoogleCalendarModule
    ],
    exports: [BookingService],
    controllers: [BookingController],
    providers: [BookingService, JwtAuthGuard],
})
export class BookingModule {

}
