import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayController } from './controller/holiday.controller';
import { DaysEntity } from './models/days.entity';
import { HolidayService } from './service/holiday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysEntity]),
    HttpModule
],
  controllers: [HolidayController],
  providers: [HolidayService]
})
export class HolidayModule {}
