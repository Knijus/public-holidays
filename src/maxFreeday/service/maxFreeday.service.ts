import { Injectable } from "@nestjs/common";
import { DayStatusService } from "src/dayStatus/service/dayStatus.service";
import { DayInterface } from "src/holiday/models/day.interface";
import { HolidayService } from "src/holiday/service/holiday.service";
import { MaxFreedayInterface } from "../models/maxFreeday.interface";

@Injectable()
export class MaxFreedayService {
	constructor(
		private readonly dayStatusService: DayStatusService,
		private readonly holidayService: HolidayService,
	) {}

	async getMaxFreedays(
		countryCode: string, 
		year: string
		): Promise<Array<MaxFreedayInterface>> {
			const holidays = await (await this.holidayService.getCountryHoliday(countryCode, year));
			let maxFreedays = [getFreedayArrBase(holidays[0])];

			const filteredHolidays = holidays
			.sort((a,b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
			.filter((holiday, index) => (index === 0 || yesterday(holidays[index]).valueOf() !== new Date(holidays[index-1].date).valueOf()));

			for (let dayIndex = 0; dayIndex < filteredHolidays.length; dayIndex++) {
			
				const holidayFreedays = getFreedayArrBase(filteredHolidays[dayIndex])

				let searchForPrevDay = true, searchForNextDay = true;
				for (let i = 1; i < 5; i++) {
					const prevDay = new Date(filteredHolidays[dayIndex].date);
					prevDay.setDate(prevDay.getDate() - i);

					const nextDay = new Date(filteredHolidays[dayIndex].date);
					nextDay.setDate(nextDay.getDate() + i);

					const [prevDayStatus, nextDayStatus] = await Promise.all([
						this.dayStatusService.getDayStatus(countryCode, prevDay.toString()),
						this.dayStatusService.getDayStatus(countryCode, nextDay.toString()),
					]);

					if (searchForPrevDay) {
						if (prevDayStatus.dayType === 'workday') {
						searchForPrevDay = false;
						} else {
						holidayFreedays.days.unshift(prevDayStatus);
						holidayFreedays.numberOfFreedays++;
						}
					}

					if (searchForNextDay) {
						if (nextDayStatus.dayType === 'workday') {
						searchForNextDay = false;
						} else {
						holidayFreedays.days.push(nextDayStatus);
						holidayFreedays.numberOfFreedays++;
						}
					}
					if(!searchForNextDay && !searchForPrevDay){
						if(holidayFreedays.numberOfFreedays > maxFreedays[0].numberOfFreedays) {
							maxFreedays = [];
							maxFreedays.push(holidayFreedays);
						} else if (holidayFreedays.numberOfFreedays === maxFreedays[0].numberOfFreedays) {
							maxFreedays.push(holidayFreedays);
						}
						break;
					}
				}
			}
			return maxFreedays
	}
}

function getFreedayArrBase(holiday: DayInterface): MaxFreedayInterface {
	const freedayBaseArray = {
	holiday: holiday.name,
	numberOfFreedays: 1,
	days: [
		{
		date: new Date(holiday.date).toLocaleDateString('en', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			}),
		dayOfWeek: holiday.dayOfWeek,
		dayType: holiday.dayType,
		}]
	}
	return freedayBaseArray
}

function yesterday(day: DayInterface): Date {
	const today = new Date(day.date);
	const yesterday = new Date(today.setDate(today.getDate()-1));
	return yesterday;		
}
