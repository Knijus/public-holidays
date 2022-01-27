import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesListController } from './controller/countries-list.controller';
import { CountriesListEntity } from './entity/countries-list.entity';
import { CountriesListService } from './service/countries-list.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountriesListEntity]),
    HttpModule
],
  
  controllers: [CountriesListController],
  
  providers: [CountriesListService]
})
export class CountriesListModule {}
