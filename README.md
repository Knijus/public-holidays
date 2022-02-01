<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://seeklogo.com/images/N/nestjs-logo-09342F76C0-seeklogo.com.png" width="130" height="130" alt="Nest Logo" /></a>
  <a href="http://postgresql.org/" target="blank"><img src="https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg" width="130" height="130" alt="Postgres Logo" /></a>
</p>


## Description

Small API project using Nestjs and Postgres. API has several endpoints:
 - returns list of all covered countries;
 - returns public holiday dates for given country and year.
 - return specific day status for given country.

 This API is already deployed on heroku server - https://publicholiday.herokuapp.com/api.

 There will be a further improvements of this API:
  - will be added one more endpoint, where it returns longest in row holidays (freedays and holidays) for given country and year
  - furher improvements for service logic, error handling and etc.

## Installation
1. Clone this repo 
```bash
$ git clone https://github.com/Knijus/public-holidays
```
2. Install nessesary dependencies
```bash
$ npm install
```
3. Install Postgres database

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - [Justinas Kniukšta](https://github.com/Knijus)


