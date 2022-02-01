import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DaysEntity } from '../models/days.entity';
import { HolidayInterface } from '../models/holiday.interface';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(DaysEntity)
    private daysRepository: Repository<DaysEntity>,
    private httpService: HttpService,
  ) {}

  async getCountryHoliday(
    countryCode: string,
    yearStr: string,
  ): Promise<HolidayInterface> {
    const year = parseInt(yearStr);
    console.log("input:", countryCode, yearStr);

    const countryHoliday = await this.daysRepository.find({where: {countryCode: countryCode, year: year, dayType: process.env.PUBLIC_HOLIDAY}});
    console.log("db", countryHoliday);
    if (countryHoliday.length) { 
      const tempArr = [];
      for (let {date: date, dayOfWeek: dow, name: name, dayType: dayType} of countryHoliday) {
        tempArr.push({date, dow, name, dayType});
      }
      const groupedHolidays = groupByMonths(tempArr);
      return groupedHolidays
    }

    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${yearStr}&country=${countryCode}&holidayType=public_holiday`,
      )
      .toPromise();
      console.log("enrico",responseFromEnrico.data);

    if (responseFromEnrico.data.length) {
      const tempArr = []
      responseFromEnrico.data.forEach((data) => {
        const day = {
          countryCode: countryCode,
          year: year,
          date: getDate(data.date.year, data.date.month, data.date.day),
          dayOfWeek: data.date.dayOfWeek,
          name: data.name,
          dayType: data.holidayType,
        }
        this.daysRepository.save(day);
        tempArr.push(day);
      });
      return groupByMonths(tempArr);
    
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: responseFromEnrico.data.error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

export function getMonthName(date: Date): string {
  return new Date(date).toLocaleString('en', { month: 'short' }).toLowerCase();
}

function getDate(year: number, month: number, day:number): string {
  return new Date(year, month - 1, day).toUTCString();
}

function groupByMonths(arr: Array<{date: Date, dayOfWeek?:number, name?: JSON[], dayType: string}>): HolidayInterface {
  const holidaysByMonths = {};
  for (let monthNum = 0; monthNum <= 11; monthNum++) {

  const tempDate = new Date(new Date(arr[0].date).getFullYear(), monthNum, new Date(arr[0].date).getDate());
  holidaysByMonths[getMonthName(tempDate).toLowerCase()] = [];
  };

  arr.forEach(day => {
    const holiday = {
    date: new Date(day.date).toLocaleDateString("en", {year: "numeric", month: "short", day: "2-digit"}),
    dayOfWeek: day.dayOfWeek,
    name: day.name,
    dayType: day.dayType
  }; 
  holidaysByMonths[getMonthName(day.date)].push(holiday);
  });
  return holidaysByMonths
}
