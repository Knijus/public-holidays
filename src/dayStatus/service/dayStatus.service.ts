import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import { HolidayInterface } from 'src/holiday/models/holiday.interface';
import { HolidayService } from 'src/holiday/service/holiday.service';
import { Repository } from 'typeorm';
import { DayStatusInterface } from '../models/dayStatus.interface';

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
  ): Promise<DayStatusInterface> {
    const date = new Date(inputDate);
    
    const dayStatus = {
      date: date.toLocaleDateString('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dayOfWeek: (date.getDay() === 0 ? 7: date.getDay()),
      dayType: undefined,
    };
    const year = date.getFullYear();
    const holidays = await this.holidayService.getCountryHoliday(
      countryCode,
      year.toString(),
    );
    const isHoliday = ifDayIsHoliday(date, holidays);

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

    this.daysRepository.save({countryCode: countryCode, year: year, date: dayStatus.date, dayOfWeek: dayStatus.dayOfWeek, dayType: dayStatus.dayType});

    return dayStatus;
  }
}

function ifDayIsHoliday(date: Date, holidayArr: Array<HolidayInterface>): string | boolean {
  let isHoliday = undefined;
 
  holidayArr.forEach((day) => {
    if (date.valueOf() == new Date(day.date).valueOf()) {
      isHoliday = day.dayType;
    }
  });
  return isHoliday;
}

function formatToDmyDate(date: Date): string {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
