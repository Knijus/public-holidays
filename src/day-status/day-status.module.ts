import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import { HolidayService } from 'src/holiday/service/holiday.service';
import { DayStatusController } from './controller/day-status.controller';
import { DayStatusService } from './service/day-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysEntity]),
    HttpModule,
    
],
  controllers: [DayStatusController],
  providers: [DayStatusService, HolidayService]
})
export class DayStatusModule {}
