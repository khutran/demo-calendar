import { IsDateString, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'dateRange', async: false })
export class DateRangeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const startTime = new Date(args.object[args.constraints[0]]);
        const endTime = new Date(value);
        return startTime < endTime;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be before ${args.constraints[0]}`;
    }
}

export class CreateBookingDto {
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
    @Validate(DateRangeConstraint, ['startTime'])
    endTime: Date;

    @IsString()
    @IsNotEmpty()
    timeZone: string;

    @IsString({})
    @IsNotEmpty()
    location: string
}

export class UpdateBookingDto {
    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    startTime?: Date;

    @IsOptional()
    @IsDateString()
    endTime?: Date;

    @IsOptional()
    @IsString()
    timeZone?: string;

    @IsOptional()
    @IsString()
    location?: string;
}


export class CreateBookingServiceDto {
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
    userName: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    timeZone: string;

    @IsString({})
    @IsNotEmpty()
    location: string
}

export class CreateBookingResultDto {
    constructor(message: string) {
        this.message = message;
    }
    message: string
}

export class UpdateBookingResultDto {
    constructor(message: string) {
        this.message = message;
    }
    message: string
}

export class CancelBookingResultDto {
    constructor(message: string) {
        this.message = message;
    }
    message: string
}