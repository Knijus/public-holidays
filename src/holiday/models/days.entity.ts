import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DaysInterface } from './days.interface';

@Entity()
export class DaysEntity {
  @PrimaryColumn()
  id: string; //countryCode and year. example: ltu2022

  @Column('json')
  month: DaysInterface;
}
