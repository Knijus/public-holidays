import { ApiProperty } from "@nestjs/swagger";
import { DayStatusInterface } from "src/dayStatus/models/dayStatus.interface";

export class Freedays {
	@ApiProperty()
	days: DayStatusInterface;

	@ApiProperty()
	numberOfFreedays: number;
}