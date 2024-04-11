import { IsEnum, IsNotEmpty } from 'class-validator'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { BookingEntity } from './booking.entity';
import { CronHistoryEntity } from './cron-history';

export enum ActionLog {
    INSERT = 1,
    UPDATE = 2,
    CANCEL = 3
}

@Entity({ name: 'cron-logs' })
export class CronLogEntity extends BaseEntity {
    @Column({})
    @IsNotEmpty()
    message: string

    @ManyToOne(() => CronHistoryEntity, cronHistory => cronHistory.logs)
    cronHistory: CronHistoryEntity;

    @ManyToOne(() => BookingEntity, booking => booking.logs)
    booking: BookingEntity;

    @Column({ enum: ActionLog })
    @IsEnum(ActionLog)
    action: number

    @Column()
    isError : boolean
}
