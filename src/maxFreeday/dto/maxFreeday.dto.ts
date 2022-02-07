import { ApiProperty } from "@nestjs/swagger";
import { DayStatusInterface } from "src/dayStatus/models/dayStatus.interface";

export class MaxFreedayDto {
	@ApiProperty()
	holiday: JSON[]

	@ApiProperty()
	numberOfFreedays: number;
	
	@ApiProperty()
	days: DayStatusInterface[];

	
}