import { Controller, Get, Param, Query } from '@nestjs/common';
import { HolidayInterface } from '../models/holiday.interface';
import { HolidayService } from '../service/holiday.service';

@Controller('holiday')
export class HolidayController {
	constructor (private readonly holidayService: HolidayService) {}

	@Get()
	async getCountryHolidays(@Query("country") countryCode="ltu", @Query("year") year=2022): Promise<HolidayInterface> {
		
		console.log(`request ${countryCode}, ${year}`);
		return await this.holidayService.getCountryHoliday(countryCode, year);
		
	}
}
