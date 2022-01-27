import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryHolidayController } from './controller/country-holiday.controller';
import { CountryHolidayEntity } from './models/country-holiday.entity';
import { CountryHolidayService } from './service/country-holiday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryHolidayEntity]),
    HttpModule
],
  controllers: [CountryHolidayController],
  providers: [CountryHolidayService]
})
export class CountryHolidayModule {}
