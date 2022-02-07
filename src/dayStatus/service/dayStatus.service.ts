import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysEntity } from 'src/holiday/models/days.entity';
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

    const isInDB = await this.daysRepository.findOne({where: {countryCode: countryCode, year: year, date: date}});

    if (isInDB) {
      dayStatus.dayType = isInDB.dayType;
      return dayStatus;
    }

    const dmyDate = formatToDmyDate(date);
    const responseFromEnrico = await this.httpService
      .get(
        `${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_IS_WORK_DAY}&date=${dmyDate}&country=${countryCode}`,
      )
      .toPromise();

    if (responseFromEnrico.data.isWorkDay === true) {
      dayStatus.dayType = "workday";
    } else if (responseFromEnrico.data.isWorkDay === false){
      dayStatus.dayType = "freeday";
    } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: responseFromEnrico.data.error,
          },
          HttpStatus.NOT_FOUND,
        );
      }

    this.daysRepository.save({
      countryCode: countryCode,
      year: year,
      date: dayStatus.date,
      dayType: dayStatus.dayType,
    });

    return dayStatus;
  }
}

function formatToDmyDate(date: Date): string {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
