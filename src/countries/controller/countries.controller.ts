import { Controller, Get } from '@nestjs/common';
import { CountriesService } from 'src/countries/service/countries.service';
import { CountriesInterface } from '../models/countries.interface';
import { CountryDto } from '../dto/countries.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns list of all supported countries.',
    type: CountryDto,
  })
  async getCountries(): Promise<CountriesInterface[]> {
    return await this.countriesService.getCountries();
  }
}
