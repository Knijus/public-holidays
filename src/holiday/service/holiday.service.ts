import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DaysEntity } from '../models/days.entity';
import { HolidayGroupedByMonthsInterface} from '../models/holidaysGroupedByMonths.interface';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(DaysEntity)
    private daysRepository: Repository<DaysEntity>,
    private httpService: HttpService,
  ) {}

  async holidayGroupedByMonths(
    countryCode: string,
    year: string,
  ): Promise<HolidayGroupedByMonthsInterface> {
    const countryHolidays = await this.getCountryHoliday(countryCode, year);

    const holidaysByMonths = {};
    for (let monthNum = 0; monthNum <= 11; monthNum++) {
  
    const tempDate = new Date(new Date(countryHolidays[0].date).getFullYear(), monthNum, new Date(countryHolidays[0].date).getDate());
    holidaysByMonths[getMonthName(tempDate).toLowerCase()] = [];
    };
  
    countryHolidays.forEach(day => {
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

  async getCountryHoliday(
    countryCode: string,
    yearStr: string,
  ): Promise<any> {
    const year = parseInt(yearStr);
  
    const countryHoliday = await this.daysRepository.find({where: {countryCode: countryCode, year: year, dayType: process.env.PUBLIC_HOLIDAY}});
    if (countryHoliday.length) { 
      const holidays = [];
      for (let {date: date, dayOfWeek: dayOfWeek, name: name, dayType: dayType} of countryHoliday) {
        holidays.push({date, dayOfWeek, name, dayType});
      }
      return holidays;
    }
  
    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${yearStr}&country=${countryCode}&holidayType=public_holiday`,
      )
      .toPromise();
  
    if (responseFromEnrico.data.length) {
      const holidays = []
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
        holidays.push(day);
      });
      return holidays;
    
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

