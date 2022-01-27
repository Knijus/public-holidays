import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountriesListEntity } from '../entity/countries-list.entity';

@Injectable()
export class CountriesListService {

	constructor(
		@InjectRepository(CountriesListEntity)
		private countriesListRepository: Repository<CountriesListEntity>, 
		private httpService: HttpService
	) {}


	async getCountriesList(): Promise<any> {
		const allCountries = await this.countriesListRepository.find();

		if (allCountries.length) {
			return  allCountries;
		}

		const countriesFromEnrico = await this.httpService
		.get(`${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_SUPPORTED_COUNTRIES}`).toPromise();

		this.countriesListRepository.save(countriesFromEnrico.data);
		return countriesFromEnrico.data;
	}
}
