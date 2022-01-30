import { Module } from '@nestjs/common';
import { DayStatusController } from './controller/day-status.controller';
import { DayStatusService } from './service/day-status.service';

@Module({
  controllers: [DayStatusController],
  providers: [DayStatusService]
})
export class DayStatusModule {}
