import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HolidayDto } from '../dto/holiday.dto';
import { HolidayInterface } from '../models/holiday.interface';
import { HolidayService } from '../service/holiday.service';

@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  
  @ApiOkResponse({ 
    description: "Returns public holiday days grouped by months for given country and year",
    type: HolidayDto })

  async getCountryHolidays(
    @Query('country') countryCode: string,
    @Query('year') year: string,
  ): Promise<HolidayInterface> {
    return await this.holidayService.getCountryHoliday(countryCode, year);
  }
}
