export interface DaysInterface {
  jan?: Days;
  feb?: Days;
  mar?: Days;
  apr?: Days;
  may?: Days;
  jun?: Days;
  jul?: Days;
  aug?: Days;
  sep?: Days;
  oct?: Days;
  nov?: Days;
  dec?: Days;
}

interface Days {
  date: string;
  dayOfWeek?: number;
  name?: JSON[];
  dayType: string;
}
