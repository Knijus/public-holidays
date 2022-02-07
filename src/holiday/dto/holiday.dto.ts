import { ApiProperty } from '@nestjs/swagger';

class Days {
  @ApiProperty()
  date: string;

  @ApiProperty()
  dayOfWeek: number;

  @ApiProperty()
  name?: JSON[];

  @ApiProperty()
  dayType: string;
}

export class HolidayDto {
  @ApiProperty()
  jan?: Days;

  @ApiProperty()
  feb?: Days;

  @ApiProperty()
  mar?: Days;

  @ApiProperty()
  apr?: Days;

  @ApiProperty()
  may?: Days;

  @ApiProperty()
  jun?: Days;

  @ApiProperty()
  jul?: Days;

  @ApiProperty()
  aug?: Days;

  @ApiProperty()
  sep?: Days;

  @ApiProperty()
  oct?: Days;

  @ApiProperty()
  nov?: Days;

  @ApiProperty()
  dec?: Days;
}
