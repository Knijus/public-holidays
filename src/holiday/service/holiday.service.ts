import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DaysEntity } from '../models/days.entity';
import { DaysInterface } from '../models/days.interface';

@Injectable()
export class HolidayService {

	constructor(
		@InjectRepository(DaysEntity)
		private daysRepository: Repository<DaysEntity>,
		private httpService: HttpService) {}

	async getCountryHoliday(countryCode: string, year: number): Promise<DaysInterface> {
		const countryCodeYear = countryCode + year;
		const countryHoliday = await this.daysRepository.findOne(countryCodeYear);

		if (countryHoliday) {
			return countryHoliday.month;
		}

		const ResponseFromEnrico = await this.httpService
		.get(`${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${year}&country=${countryCode}&holidayType=public_holiday`)
		.toPromise();

		const holidaysByMonths = {};

		for (let monthNum = 0; monthNum <= 11; monthNum++) {
			const date = new Date(2000, monthNum, 1);
			holidaysByMonths[getMonthName(date)]= [];
		}

		if (ResponseFromEnrico.data.length) {
			ResponseFromEnrico.data.forEach((data) => {
				const day = {
					date: getDateOnly(data.date.year, data.date.month, data.date.day),
					dayOfWeek: data.date.dayOfWeek,
					name: data.name,
					dayType: data.holidayType,
				}
				holidaysByMonths[getMonthName(day.date)].push(day)

			});

			const saveToPg = {id: countryCodeYear, month: holidaysByMonths};

			this.daysRepository.save(saveToPg);
			return holidaysByMonths	
		} else {
			throw new HttpException({
				status: HttpStatus.NOT_FOUND,
				error: ResponseFromEnrico.data.error
			}, HttpStatus.NOT_FOUND);
		}
	}
}

export function getMonthName(date) {
	return new Date(date).toLocaleString("en", {month:"short"})
}

function getDateOnly(year, month, day) {
	return new Date(year, month-1, day)
	.toLocaleString("en-GB", {year: "numeric", month: "short", day:"numeric"})
}