import { Column, Entity, PrimaryColumn } from 'typeorm';

interface fromToDate {
  day: number;
  month: number;
  year: number;
}

@Entity()
export class CountriesEntity {
  @PrimaryColumn()
  countryCode: string;

  @Column('text', { array: true })
  regions: string[];

  @Column('text', { array: true })
  holidayTypes: string[];

  @Column()
  fullName: string;

  @Column('json')
  fromDate: fromToDate;

  @Column('json')
  toDate: fromToDate;
}
