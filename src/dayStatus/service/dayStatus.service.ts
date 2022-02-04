import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
import { DayInterface } from 'src/holiday/models/day.interface';
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
    const publicHoliday = process.env.PUBLIC_HOLIDAY;

    const days = await this.holidayService.getDaysFromDb(
      countryCode,
      year.toString()
    );
    const isInArr = isDayInArr(date, days);

    if (isInArr) {
      dayStatus.dayType = isInArr;
      return dayStatus;
    }

    const dmyDate = formatToDmyDate(date);
    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_IS_WORK_DAY}&date=${dmyDate}&country=${countryCode}`,
      )
      .toPromise();

    if (responseFromEnrico.data.isWorkDay === true) {
      dayStatus.dayType = process.env.WORKDAY;
    } else if (responseFromEnrico.data.isWorkDay === false){
      dayStatus.dayType = process.env.FREEDAY;
    } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: responseFromEnrico.data.error,
          },
          HttpStatus.NOT_FOUND,
        );
      }

    this.daysRepository.save({countryCode: countryCode, year: year, date: dayStatus.date, dayOfWeek: dayStatus.dayOfWeek, dayType: dayStatus.dayType});

    return dayStatus;
  }
}

function isDayInArr(date: Date, daysArr: Array<DayInterface>): string | boolean {
  let isInArr = undefined;
 
  daysArr.forEach((day) => {
    if (date.valueOf() == new Date(day.date).valueOf()) {
      isInArr = day.dayType;
    }
  });
  return isInArr;
}

function formatToDmyDate(date: Date): string {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
