import { plainToClass } from "class-transformer";
import { IsDateString, IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BookingEntity } from "src/entities/booking.entity";

export class CreateEventCalendarDto {
    @IsString()
    @IsOptional()
    eventId: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string

    @IsJSON()
    @IsNotEmpty()
    start: {
        dateTime: string,
        timeZone: string,
    };

    @IsJSON()
    @IsNotEmpty()
    end: {
        dateTime: string,
        timeZone: string,
    };
}

export class CreateBookingServiceDto {
    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    @IsDateString()
    @IsNotEmpty()
    endTime: Date;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    location: string
}

export function ConvertDataToEventCalendarDto(data: BookingEntity): CreateEventCalendarDto {
    return plainToClass(CreateEventCalendarDto, {
        eventId: data.eventId,
        summary: data.summary,
        description: `Customer : ${data.userName} - ${data.email} * ${data.description}`,
        start: {
            dateTime: data.startTime.toISOString(),
            timeZone: data.timeZone
        },
        end: {
            dateTime: data.endTime.toISOString(),
            timeZone: data.timeZone
        },
        location: data.location,
        colorId: data.color
    });
}