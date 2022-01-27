import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './controller/countries.controller';
import { CountriesEntity } from './entity/countries.entity';
import { CountriesService } from './service/countries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountriesEntity]),
    HttpModule
],
  
  controllers: [CountriesController],
  
  providers: [CountriesService]
})
export class CountriesModule {}
