import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountriesEntity } from '../models/countries.entity';
import { CountriesInterface } from '../models/countries.interface';

@Injectable()
export class CountriesService {

	constructor(
		@InjectRepository(CountriesEntity)
		private countriesRepository: Repository<CountriesEntity>, 
		private httpService: HttpService
	) {}

	async getCountries(): Promise<CountriesInterface[]> {
		const allCountries = await this.countriesRepository.find();
		
		if (allCountries.length) {
			return allCountries;
		}

		const countriesFromEnrico = await this.httpService
		.get(`${process.env.ENRICO_SERVICE}/${process.env.RESPONSE_TYPE}/${process.env.ENRICO_VERSION}?action=${process.env.ACTION_GET_SUPPORTED_COUNTRIES}`).toPromise();

		this.countriesRepository.save(countriesFromEnrico.data);
		return countriesFromEnrico.data;
	}
}
