import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { DayStatusDto } from '../dto/DayStatusDto';
import { DayStatusInterface } from '../models/dayStatus.interface';
import { DayStatusService } from '../service/dayStatus.service';

@Controller('dayStatus')
export class DayStatusController {
  constructor(private readonly DayStatusService: DayStatusService) {}

  @Get()
  @ApiOkResponse({ 
    description: "Returns specific day status for given date and country. Day status can be workday, freeday or public holiday.",
    type: DayStatusDto })

  async getDayStatus(
    @Query('country') countryCode: string,
    @Query('date') date: string,
  ): Promise<DayStatusInterface> {
    return await this.DayStatusService.getDayStatus(countryCode, date);
  }
}
