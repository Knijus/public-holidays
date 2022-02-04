import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DayStatusService } from "src/dayStatus/service/dayStatus.service";
import { DaysEntity } from "src/holiday/models/days.entity";
import { HolidayService } from "src/holiday/service/holiday.service";
import { MaxFreedayController } from "./controller/maxFreeday.controller";
import { MaxFreedayService } from "./service/maxFreeday.service";

@Module({
	imports: [TypeOrmModule.forFeature([DaysEntity]),
	 HttpModule
	],
	controllers: [MaxFreedayController],
	providers: [MaxFreedayService, DayStatusService, HolidayService],
  })
  export class MaxFreedayModule {}