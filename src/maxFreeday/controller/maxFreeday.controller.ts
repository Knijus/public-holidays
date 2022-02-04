import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { Freedays } from "../dto/Freedays.dto";
import { MaxFreedayService } from "../service/maxFreeday.service";

@Controller('holiday')
export class MaxFreedayController {
  constructor(private readonly maxFreedayService: MaxFreedayService) {}

  @Get()  
  @ApiOkResponse({ 
    description: "Returns public holiday days grouped by months for given country and year",
    type: Freedays,
	})

  async getCountryHolidays(
    @Query('country') countryCode: string,
    @Query('year') year: string,
  ): Promise<any> {
    return await this.maxFreedayService.getMaxFreedays(countryCode, year);
  }
}
