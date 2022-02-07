import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayInterface } from '../models/day.interface';
import { DaysEntity } from '../models/days.entity';
import { HolidayInterface} from '../models/holiday.interface';

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
  ): Promise<HolidayInterface> {

    const countryHolidays = await this.getCountryHoliday(countryCode, year);

    const holidaysByMonths = {};
    for (let monthNum = 0; monthNum <= 11; monthNum++) {
      const tempDate = new Date(new Date(
        countryHolidays[0].date).getFullYear(), 
        monthNum, 
        new Date(countryHolidays[0].date).getDate()
        ).toUTCString();
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
    year: string,
  ): Promise<Array<DayInterface>> {
    const countryHolidays = [];
    const publicHoliday = process.env.PUBLIC_HOLIDAY;
    const daysFromDb = await this.getDaysFromDb(countryCode, year);

    if(daysFromDb.length) {
       daysFromDb.filter(day => day.dayType === publicHoliday)
      .forEach(day => {countryHolidays.push(day);
      }); 
      return countryHolidays
    }
    return this.holidayFromEnrico(countryCode, year);

  }

  async getDaysFromDb(
    countryCode: string,
    year: string,
  ): Promise<Array<DayInterface>> {
    const countryDays = await this.daysRepository.find({where: {countryCode: countryCode, year: year}});

    if (countryDays.length) { 
      const days = [];
      countryDays.forEach(day => {
        days.push({
          date: day.date, 
          dayOfWeek:day.dayOfWeek, 
          name: day.name, 
          dayType: day.dayType});
      })
      return days;
    }
    return [];
  }
  
  async holidayFromEnrico(
    countryCode: string,
    year: string,
  ): Promise<Array<DayInterface>> {
    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_HOLIDAYS_FOR_YEAR}&year=${year}&country=${countryCode}&holidayType=public_holiday`,
      )
      .toPromise();
  
    if (responseFromEnrico.data.length) {
      const holidays = []
      responseFromEnrico.data.forEach((data) => {
        const day = {
          countryCode: countryCode,
          year: parseInt(year),
          date: new Date(Date.UTC(data.date.year, data.date.month -1, data.date.day)),
          dayOfWeek: data.date.dayOfWeek,
          name: data.name,
          dayType: data.holidayType,
        }
        holidays.push({	date: day.date, dayOfWeek: day.dayOfWeek, name: day.name, dayType: day.dayType});

        this.daysRepository.save(day);
        
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

export function getMonthName(date: string): string {
  return new Date(date).toLocaleString('en', { month: 'short' }).toLowerCase();
}


