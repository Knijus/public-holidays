import { Column, Entity, PrimaryColumn } from "typeorm";
import { HolidayInterface } from "./holiday.interface";

@Entity()
export class HolidayEntity {
	@PrimaryColumn()
	id: string; //countryCode and year. example: ltu2022

	@Column("json")
	month: HolidayInterface;

}