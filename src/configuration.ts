import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { BookingEntity } from './entities/booking.entity'
import { CronHistoryEntity } from './entities/cron-history'
import { CronLogEntity } from './entities/cron-log.entity'
import { UserEntity } from './entities/user.entity'

export const app = registerAs('app', () => {
  const it = {
    isProduction: process.env.NODE_ENV
      ? process.env.NODE_ENV === 'production'
      : undefined,
    iamHost: process.env.IAM_HOST,
  }

  return it
})

export const typeormConfig = registerAs('typeorm', () => {
  const it: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: false,
    entities: [
      UserEntity,
      BookingEntity,
      CronHistoryEntity,
      CronLogEntity
    ],
    namingStrategy: new SnakeNamingStrategy(),
    ssl: process.env.DB_SSL === 'true',
    extra: {
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
      connectionLimit: 5,
    },
  }

  return it
})
