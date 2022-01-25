import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class countries {
	@PrimaryColumn()
	countryCode: string;

	@Column()
	regions: string[];

	@Column()
	holidayTypes: string[];

	@Column()
	fullName: string;

	@Column()
	fromDate: JSON;

	@Column()
	toDate: JSON;

}
