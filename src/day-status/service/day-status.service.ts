import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import {
  getMonthName,
  HolidayService,
} from 'src/holiday/service/holiday.service';
import { Repository } from 'typeorm';
import { DaysStatusInterface } from '../models/day-status.interface';

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
    date: Date,
  ): Promise<DaysStatusInterface> {
    const dayStatus = {
      date: new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dayType: undefined,
    };
    console.log(dayStatus);
    const year = new Date(date).getFullYear();
    const holidaysByMonths = await this.holidayService.getCountryHoliday(
      countryCode,
      year,
    );
    console.log(holidaysByMonths);
    const isHoliday = IfDayIsHoliday(date, holidaysByMonths);

    if (isHoliday) {
      dayStatus.dayType = isHoliday;
      return dayStatus;
    }

    const dmyDate = formatToDmyDate(date);
    const ResponseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_IS_WORK_DAY}&date=${dmyDate}&country=${countryCode}`,
      )
      .toPromise();

    if (ResponseFromEnrico.data.isWorkDay) {
      dayStatus.dayType = 'Workday';
    } else {
      dayStatus.dayType = 'Freeday';
    }

    holidaysByMonths[getMonthName(dayStatus.date)].push(dayStatus);
    await this.daysRepository.update(
      { id: `${countryCode}${year}` },
      { month: holidaysByMonths },
    );
    return dayStatus;
  }
}

function valueOfDate(date) {
  return new Date(date).valueOf();
}

function IfDayIsHoliday(date, holidayArr) {
  let isHoliday = undefined;
  for (const month in holidayArr) {
    holidayArr[month].forEach((day) => {
      if (valueOfDate(date) == valueOfDate(day.date)) {
        isHoliday = day.dayType;
      }
    });
  }
  return isHoliday;
}

function formatToDmyDate(inputDate) {
  const date = new Date(inputDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
