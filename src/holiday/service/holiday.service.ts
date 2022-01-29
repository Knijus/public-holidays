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
			console.log("db");
			return countryHoliday.month;
		}

		const ResponseFromEnrico = await this.httpService
		.get(`${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${year}&country=${countryCode}&holidayType=public_holiday`)
		.toPromise();

		const HolidaysByMonths = {};

		for (let monthNum = 0; monthNum <= 11; monthNum++) {
			const date = new Date(2000, monthNum, 1)
			const shortMonth = date.toLocaleString("en-us", {month: "short"});
			HolidaysByMonths[shortMonth]= [];
		}

		if (ResponseFromEnrico.data.length) {
			ResponseFromEnrico.data.forEach((data) => {
				const day = {
					date: new Date(data.date.year, data.date.month-1, data.date.day)
					.toLocaleString("en", {year: "numeric", month: "short", day:"numeric"}),
					dayOfWeek: data.date.dayOfWeek,
					name: data.name,
					holidayType: data.holidayType,
				}

				for (let month in HolidaysByMonths) {
					if(day.date.includes(HolidaysByMonths[month])) {
						HolidaysByMonths[month].push(day);
					}
				}
			});

			const saveToPg = {id: countryCodeYear, month: HolidaysByMonths};

			this.holidayRepository.save(saveToPg);
			console.log("enrico");
			return HolidaysByMonths	
		} else {
			throw new HttpException({
				status: HttpStatus.NOT_FOUND,
				error: ResponseFromEnrico.data.error
			}, HttpStatus.NOT_FOUND);
		}
	}
}