import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DaysEntity {
  @PrimaryColumn()
  countryCode: string;

  @PrimaryColumn()
  year: number;

  @Column()
  date: Date;

  @Column()
  dayOfWeek: number;

  @Column()
  name: Name[];

  @Column()
  dayType: string;
}

interface Name {
  lang: string;
  text: string;
}
