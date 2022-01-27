import { Test, TestingModule } from '@nestjs/testing';
import { CountryHolidayService } from './country-holiday.service';

describe('CountryHolidayService', () => {
  let service: CountryHolidayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryHolidayService],
    }).compile();

    service = module.get<CountryHolidayService>(CountryHolidayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
