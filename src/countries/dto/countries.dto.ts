import { ApiProperty } from "@nestjs/swagger";

class Year {
	  
	@ApiProperty()			
	day: number;

	@ApiProperty()
	month: number;

	@ApiProperty()
	year: number;
  }

export class CountryDto {
	@ApiProperty()
	countryCode: string;

	@ApiProperty()
	regions: string[];

	@ApiProperty()
	holidayTypes: string[];

	@ApiProperty()
	fullName: string;

	@ApiProperty()
	fromDate: Year;


	@ApiProperty()
	toDate: Year;
}
	
