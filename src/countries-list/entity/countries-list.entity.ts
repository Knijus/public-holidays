import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class CountriesListEntity {
	@PrimaryColumn()
	countryCode: string;

	@Column("text", { array: true })
	regions: string[];

	@Column("text", { array: true })
	holidayTypes: string[];

	@Column()
	fullName: string;

	// @Column("text", { array: true})
	// fromDate: JSON;

	// @Column("text", { array: true})
	// toDate: JSON;

}
