import { DayStatusInterface } from "src/dayStatus/models/dayStatus.interface";

export interface MaxFreedayInterface {
	days: DayStatusInterface[];
	numberOfFreedays: number;
}