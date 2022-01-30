import { Controller, Get, Query } from '@nestjs/common';
import { DaysStatusInterface } from '../models/day-status.interface';
import { DayStatusService } from '../service/day-status.service';

@Controller('dayStatus')
export class DayStatusController {
  constructor(private readonly holidayService: DayStatusService) {}

  @Get()
  async getDayStatus(
    @Query('country') countryCode,
    @Query('date') date,
  ): Promise<DaysStatusInterface> {
    console.log('input:', countryCode, date);
    return await this.holidayService.getDayStatus(countryCode, date);
  }
}
