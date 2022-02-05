import { DayStatusInterface } from "src/dayStatus/models/dayStatus.interface";

export interface MaxFreedayInterface {
	holiday: JSON[],
	numberOfFreedays: number;
	days: DayStatusInterface[];
	
}