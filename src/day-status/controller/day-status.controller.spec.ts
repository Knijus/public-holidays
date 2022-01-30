import { Test, TestingModule } from '@nestjs/testing';
import { DayStatusController } from './day-status.controller';

describe('DayStatusController', () => {
  let controller: DayStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayStatusController],
    }).compile();

    controller = module.get<DayStatusController>(DayStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
