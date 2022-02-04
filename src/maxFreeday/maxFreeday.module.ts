import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DaysEntity } from "src/holiday/models/days.entity";
import { MaxFreedayController } from "./controller/maxFreeday.controller";
import { MaxFreedayService } from "./service/maxFreeday.service";

@Module({
	imports: [TypeOrmModule.forFeature([DaysEntity]),
	 HttpModule
	],
	controllers: [MaxFreedayController],
	providers: [MaxFreedayService],
  })
  export class MaxFreedayModule {}