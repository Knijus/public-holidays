import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { HolidayModule } from './holiday/holiday.module';
import { DayStatusModule } from './dayStatus/dayStatus.module';
import { MaxFreedayModule } from './maxFreeday/maxFreeday.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string()
          .ip()
          .default('127.0.0.1'),
        POSTGRES_PORT: Joi.number()
          .port()
          .default(5432),
        ENRICO_SERVICE: Joi.string()
          .uri()
          .default('https://kayaposoft.com/enrico'),
        RESPONSE_TYPE: Joi.string()
          .default('json'),
        ENRICO_VERSION: Joi.string()
          .default('v2.0'),
        ACTION_GET_SUPPORTED_COUNTRIES: Joi.string()
          .default('getSupportedCountries'),
        ACTION_GET_HOLIDAYS_FOR_YEAR: Joi.string()
          .default('getHolidaysForYear'),
        ACTION_IS_WORK_DAY: Joi.string()
          .default('isWorkDay'),
        PUBLIC_HOLIDAY: Joi.string()
          .default('public_holiday'),
        WORKDAY: Joi.string()
          .default('workday'),
        FREEDAY: Joi.string()
          .default('freeday'),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      url: process.env.DATABASE_URL,
      // ssl:
      //   process.env.NODE_ENV === 'production'
      //     ? { rejectUnauthorized: false }
      //     : false,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CountriesModule,
    HolidayModule,
    DayStatusModule,
    MaxFreedayModule,
  ],
})
export class AppModule {}
