import { Controller, Get, Param, Query } from '@nestjs/common';
import { DaysInterface } from '../models/days.interface';
import { HolidayService } from '../service/holiday.service';

@Controller('holiday')
export class HolidayController {
	constructor (private readonly holidayService: HolidayService) {}

	@Get()
	async getCountryHolidays(@Query("country") countryCode="ltu", @Query("year") year=2022): Promise<DaysInterface> {
		return await this.holidayService.getCountryHoliday(countryCode, year);
	}
}
