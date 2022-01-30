export interface CountriesInterface {
  countryCode: string;
  regions: string[];
  holidayTypes: string[];
  fullName: string;
  fromDate: {
    day: number;
    month: number;
    year: number;
  };
  toDate: {
    day: number;
    month: number;
    year: number;
  };
}
