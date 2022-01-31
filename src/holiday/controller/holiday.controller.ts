import { Controller, Get, Query } from '@nestjs/common';
import { HolidayInterface } from '../models/holiday.interface';
import { HolidayService } from '../service/holiday.service';

@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async getCountryHolidays(
    @Query('country') countryCode: string,
    @Query('year') year: string,
  ): Promise<HolidayInterface> {
    return await this.holidayService.getCountryHoliday(countryCode, year);
  }
}
