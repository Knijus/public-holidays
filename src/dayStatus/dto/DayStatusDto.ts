import { ApiProperty } from '@nestjs/swagger';

export class DayStatusDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  dayType: string;
}
