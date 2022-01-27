import { Controller, Get } from '@nestjs/common';
import { CountriesListService } from 'src/countries-list/service/countries-list.service';

@Controller('countriesList')
export class CountriesListController {
	constructor(private readonly countriesListService: CountriesListService) {}

	@Get()
	async getCountriesList(): Promise<JSON> {
		return await this.countriesListService.getCountriesList();
	}
}

