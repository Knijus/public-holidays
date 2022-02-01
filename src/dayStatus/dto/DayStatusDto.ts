import { ApiProperty } from "@nestjs/swagger";

export class DayStatusDto {
  @ApiProperty()
  date: String;

  @ApiProperty()
  dayType: string;
}
