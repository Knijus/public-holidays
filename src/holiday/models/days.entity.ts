import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DaysEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column()
  year: number;

  @Column()
  date: Date;

  @Column({nullable: true})
  dayOfWeek?: number;

  @Column('json', { nullable: true })
  name?: JSON;

  @Column()
  dayType: string;
}
