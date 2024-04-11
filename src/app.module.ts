import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { AuthModule } from './auth/auth.module'
import { BookingModule } from './bookings/booking.module'
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
import { CronJobModule } from './cron-job/cron-job.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DB_TYPE as any,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        entities: ['dist/**/**.entity{.ts,.js}'],
      }),
    }),
    UserModule,
    AuthModule,
    BookingModule,
    GoogleCalendarModule,
    CronJobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
