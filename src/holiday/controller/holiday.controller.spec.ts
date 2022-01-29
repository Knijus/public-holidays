import { Test, TestingModule } from '@nestjs/testing';
import { CountryHolidayController } from './country-holiday.controller';

describe('CountryHolidayController', () => {
  let controller: CountryHolidayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryHolidayController],
    }).compile();

    controller = module.get<CountryHolidayController>(CountryHolidayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
