import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class HolidayEntity {
	@PrimaryColumn()
	id: string; //countryCode and year. example: ltu2022

	@Column("json")
	month: Month;

}

interface Month {
	1?: Days;
	2?: Days;
	3?: Days;
	4?: Days;
	5?: Days;
	6?: Days;
	7?: Days;
	8?: Days;
	9?: Days;
	10?: Days;
	11?: Days;
	12?: Days;
}

interface Days {
	day: number;
	month: number;
	year: number;
	dayOfWeek: number;
	Name: JSON[];
	holidayType: string;
}