import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolidayEntity } from '../models/holiday.entity';
import { HolidayInterface } from '../models/holiday.interface';

@Injectable()
export class HolidayService {

	constructor(
		@InjectRepository(HolidayEntity)
		private holidayRepository: Repository<HolidayEntity>,
		private httpService: HttpService) {}

	async getCountryHoliday(countryCode: string, year: number): Promise<HolidayInterface> {
		const countryCodeYear = countryCode + year;
		const countryHoliday = await this.holidayRepository.findOne(countryCodeYear);

		if (countryHoliday) {
			const holidaysByMonth = countryHoliday.month;
			return holidaysByMonth;
		}

		const ResponseFromEnrico = await this.httpService
		.get(`${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${year}&country=${countryCode}&holidayType=public_holiday`)
		.toPromise();

		const HolidaysByMonths = {};

		for (let x = 1; x<= 12; x++) {
			HolidaysByMonths[x]= [];
		}		

		if (ResponseFromEnrico.data.length) {
			ResponseFromEnrico.data.forEach((data) => {
				const day = {
					day: data.date.day,
					month: data.date.month,
					year: data.date.year,
					dayOfWeek: data.date.dayOfWeek,
					name: data.name,
					holidayType: data.holidayType,
				}
				HolidaysByMonths[data.date.month].push(day);
			});

			const saveToPg = {id: countryCodeYear, month: HolidaysByMonths};

			this.holidayRepository.save(saveToPg);

			return HolidaysByMonths	
		} else {
			throw new HttpException({
				status: HttpStatus.NOT_FOUND,
				error: ResponseFromEnrico.data.error
			}, HttpStatus.NOT_FOUND);
		}
	}
}
