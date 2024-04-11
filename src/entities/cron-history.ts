import { IsEnum, IsNotEmpty } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { CronLogEntity } from './cron-log.entity'

export enum CronStatus {
    RUN = 1,
    STOP = 2
}

export enum JobName {
    CALENDAR = 'CALENDAR'
}

@Entity({ name: 'cron-history' })
export class CronHistoryEntity extends BaseEntity {
    @Column({ type: 'enum', enum: JobName })
    @IsNotEmpty()
    @IsEnum(JobName)
    jobName: string

    @Column({})
    @IsNotEmpty()
    totalRecord: number

    @Column({ type: 'enum', enum: CronStatus, default: CronStatus.RUN })
    @IsNotEmpty()
    @IsEnum(CronStatus)
    status: CronStatus;

    @OneToMany(() => CronLogEntity, log => log.cronHistory)
    logs: CronLogEntity[];
}
