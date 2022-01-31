import { Controller, Get, Query } from '@nestjs/common';
import { DaysStatusInterface } from '../models/day-status.interface';
import { DayStatusService } from '../service/day-status.service';

@Controller('dayStatus')
export class DayStatusController {
  constructor(private readonly DayStatusService: DayStatusService) {}

  @Get()
  async getDayStatus(
    @Query('country') countryCode: string,
    @Query('date') date: string,
  ): Promise<DaysStatusInterface> {
    return await this.DayStatusService.getDayStatus(countryCode, date);
  }
}
