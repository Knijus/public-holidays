import { Injectable } from '@nestjs/common';
import { DayStatusService } from 'src/dayStatus/service/dayStatus.service';
import { DayInterface } from 'src/holiday/models/day.interface';
import { HolidayService } from 'src/holiday/service/holiday.service';
import { MaxFreedayInterface } from '../models/maxFreeday.interface';

@Injectable()
export class MaxFreedayService {
  constructor(
    private readonly dayStatusService: DayStatusService,
    private readonly holidayService: HolidayService,
  ) {}

  async getMaxFreedays(
    countryCode: string,
    year: string,
  ): Promise<Array<MaxFreedayInterface>> {
    const holidays = await this.holidayService.getCountryHoliday(
      countryCode,
      year,
    );
    let maxFreedays = [getFreeday(holidays[0])];

    const filteredHolidays = holidays
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
      .filter(
        (holiday, index) =>
          index === 0 ||
          nextOrPrevDay(holidays[index], -1).valueOf() !==
            new Date(holidays[index - 1].date).valueOf(),
      );

    for (let dayIndex = 0; dayIndex < filteredHolidays.length; dayIndex++) {
      const holidayFreedays = getFreeday(filteredHolidays[dayIndex]);

      let searchForPrevDay = true,
        searchForNextDay = true;
      for (let i = 1; i < 5; i++) {
        const prevDay = nextOrPrevDay(filteredHolidays[dayIndex], -i);
        const nextDay = nextOrPrevDay(filteredHolidays[dayIndex], i);

        const [prevDayStatus, nextDayStatus] = await Promise.all([
          this.dayStatusService.getDayStatus(countryCode, prevDay.toString()),
          this.dayStatusService.getDayStatus(countryCode, nextDay.toString()),
        ]);

        if (searchForPrevDay) {
          if (prevDayStatus.dayType === 'workday') {
            searchForPrevDay = false;
          } else {
            holidayFreedays.days.unshift(prevDayStatus);
            holidayFreedays.numberOfFreedays = holidayFreedays.days.length;
          }
        }

        if (searchForNextDay) {
          if (nextDayStatus.dayType === 'workday') {
            searchForNextDay = false;
          } else {
            holidayFreedays.days.push(nextDayStatus);
            holidayFreedays.numberOfFreedays = holidayFreedays.days.length;
          }
        }

        if (!searchForNextDay && !searchForPrevDay) {
          break;
        }
      }

      if (holidayFreedays.numberOfFreedays > maxFreedays[0].numberOfFreedays) {
        maxFreedays = [];
        maxFreedays.push(holidayFreedays);
      } else if (
        holidayFreedays.numberOfFreedays === maxFreedays[0].numberOfFreedays
      ) {
        maxFreedays.push(holidayFreedays);
      }
    }
    return maxFreedays;
  }
}

function getFreeday(holiday: DayInterface): MaxFreedayInterface {
  const freeday = {
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
      },
    ],
  };
  return freeday;
}

function nextOrPrevDay(day: DayInterface, number: number): Date {
  const today = new Date(day.date);
  const dayToSet = today.getDate() + number;
  const updatedDay = new Date(today.setDate(dayToSet));
  return updatedDay;
}
