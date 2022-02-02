import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import { HolidayService } from 'src/holiday/service/holiday.service';
import { DayStatusController } from './controller/dayStatus.controller';
import { DayStatusService } from './service/dayStatus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysEntity]), 
    HttpModule
  ],
  controllers: [DayStatusController],
  providers: [DayStatusService, HolidayService],
})
export class DayStatusModule {}
