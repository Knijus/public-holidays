import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import { HolidayInterface } from 'src/holiday/models/holiday.interface';
import {
  getMonthName,
  HolidayService,
} from 'src/holiday/service/holiday.service';
import { Repository } from 'typeorm';
import { DaysStatusInterface } from '../models/dayStatus.interface';

@Injectable()
export class DayStatusService {
  constructor(
    @InjectRepository(DaysEntity)
    private daysRepository: Repository<DaysEntity>,
    private httpService: HttpService,
    private readonly holidayService: HolidayService,
  ) {}

  async getDayStatus(
    countryCode: string,
    inputDate: string,
  ): Promise<DaysStatusInterface> {
    const date = new Date(inputDate);
    
    const dayStatus = {
      date: new Date(date).toLocaleDateString('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dayType: undefined,
    };
    const year = new Date(date).getFullYear();
    const holidaysByMonths = await this.holidayService.getCountryHoliday(
      countryCode,
      year,
    );
    const isHoliday = ifDayIsHoliday(date, holidaysByMonths);

    if (isHoliday) {
      dayStatus.dayType = isHoliday;
      return dayStatus;
    }

    const dmyDate = formatToDmyDate(date);
    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_IS_WORK_DAY}&date=${dmyDate}&country=${countryCode}`,
      )
      .toPromise();

    if (responseFromEnrico.data.isWorkDay) {
      dayStatus.dayType = 'Workday';
    } else {
      dayStatus.dayType = 'Freeday';
    }

    this.daysRepository.save({countryCode: countryCode, year: year, date: dayStatus.date, dayType: dayStatus.dayType});

    return dayStatus;
  }
}

function valueOfDate(date: Date): number {
  return new Date(date).valueOf();
}

function ifDayIsHoliday(date: Date, holidayArr: HolidayInterface): string | boolean {
  let isHoliday = undefined;
  for (const month in holidayArr) {
    holidayArr[month].forEach((day) => {
      if (valueOfDate(date) === valueOfDate(day.date)) {
        isHoliday = day.dayType;
      }
    });
  }
  return isHoliday;
}

function formatToDmyDate(inputDate: Date): string {
  const date = new Date(inputDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
