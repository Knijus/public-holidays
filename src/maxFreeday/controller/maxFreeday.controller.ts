import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { MaxFreedayDto } from "../dto/maxFreeday.dto";
import { MaxFreedayInterface } from "../models/maxFreeday.interface";
import { MaxFreedayService } from "../service/maxFreeday.service";

@Controller('maxFreeday')
export class MaxFreedayController {
  constructor(private readonly maxFreedayService: MaxFreedayService) {}

  @Get()  
  @ApiOkResponse({ 
    description: "Returns max number of freedays in row for given country and year",
    type: [MaxFreedayDto],
	})

  async getMaxFreedays(
    @Query('country') countryCode: string,
    @Query('year') year: string,
  ): Promise<Array<MaxFreedayInterface>> {
    return await this.maxFreedayService.getMaxFreedays(countryCode, year);
  }
}
