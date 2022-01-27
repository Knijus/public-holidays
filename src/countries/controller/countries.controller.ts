import { Controller, Get } from '@nestjs/common';
import { CountriesService } from 'src/countries/service/countries.service';
import { CountriesInterface } from '../entity/countries.interface';

@Controller('countries')
export class CountriesController {
	constructor(private readonly countriesService: CountriesService) {}

	@Get()
	async getCountries(): Promise<CountriesInterface[]> {
		return await this.countriesService.getCountries();
	}
}

