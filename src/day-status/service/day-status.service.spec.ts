import { Test, TestingModule } from '@nestjs/testing';
import { DayStatusService } from './day-status.service';

describe('DayStatusService', () => {
  let service: DayStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayStatusService],
    }).compile();

    service = module.get<DayStatusService>(DayStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
