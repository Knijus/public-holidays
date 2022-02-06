import { Injectable } from "@nestjs/common";
import { DayStatusService } from "src/dayStatus/service/dayStatus.service";
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
			const holidays = await this.holidayService.getCountryHoliday(countryCode, year);
			let maxFreedays = [
				{
				holiday: holidays[0].name,
				numberOfFreedays: 1,
				days: [
					{
					date: new Date(holidays[0].date).toLocaleDateString('en', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						}),
					dayOfWeek: holidays[0].dayOfWeek,
					dayType: holidays[0].dayType,
					}
				],
				
			}]

			holidays
			.filter((holiday,index) => {
				 return index === 0 ||
				new Date(holidays[index-1].date).setDate(new Date(holidays[index-1].date).getDate() +1).valueOf() !== new Date(holiday.date).valueOf()
			})
			.forEach(async holiday => {
				const holidayFreedays = {
					holiday: holiday.name,
					numberOfFreedays: 1,
					days: [{
						date:  new Date(holiday.date).toLocaleDateString('en', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							}),
						dayOfWeek: holiday.dayOfWeek,
						dayType: holiday.dayType,
					}],
				}

				for (let i = 1; i < 5; i++) {
					let dayDate = new Date(holiday.date);
					dayDate.setDate(dayDate.getDate()-i);
					const dayStatus = await this.dayStatusService.getDayStatus(countryCode, dayDate.toString());
					if(dayStatus.dayType === "workday") {
						break;
					}	
					holidayFreedays.days.unshift(dayStatus);
					holidayFreedays.numberOfFreedays++;
				}

				for (let i = 1; i < 5; i++) {
					let dayDate = new Date(holiday.date);
					dayDate.setDate(dayDate.getDate()+i);
					const dayStatus = await this.dayStatusService.getDayStatus(countryCode, dayDate.toString());
					if(dayStatus.dayType === "workday") {
						break;
					}	
					holidayFreedays.days.push(dayStatus);
					holidayFreedays.numberOfFreedays++;
				}

				if(holidayFreedays.numberOfFreedays > maxFreedays[0].numberOfFreedays) {
					maxFreedays = [];
					maxFreedays.push(holidayFreedays);
				} else if (holidayFreedays.numberOfFreedays === maxFreedays[0].numberOfFreedays) {
					maxFreedays.push(holidayFreedays);
				}

			return maxFreedays	
			});
	}
	
}