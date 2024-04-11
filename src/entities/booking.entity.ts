import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CronLogEntity } from './cron-log.entity';

export enum BookingStatus {
    ACTIVE = 1,
    UPDATE = 2,
    SYNC = 3,
    CANCEL = 5,
    ERROR = 6
}

@Entity({ name: 'booking' })
export class BookingEntity extends BaseEntity {
    @Column({ nullable: true })
    @IsOptional()
    eventId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    summary: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: false })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: false })
    endTime: Date;

    @Column({})
    @IsNotEmpty()
    email: string

    @Column({})
    @IsNotEmpty()
    userName: string

    @Column({ nullable: true })
    @IsOptional()
    color: string

    @Column({})
    @IsNotEmpty()
    timeZone: string

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.ACTIVE })
    @IsNotEmpty()
    @IsEnum(BookingStatus)
    status: BookingStatus;

    @Column({})
    @IsNotEmpty()
    location: string

    @OneToMany(() => CronLogEntity, log => log.booking)
    logs: CronLogEntity[];
}
