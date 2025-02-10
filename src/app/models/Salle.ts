import {Seance} from './Seance';
import {Schedule} from './Schedule';

// export interface Salle {
//   name: string;
//   type: string;
//   capacite: number;
//   schedule: [day:string]:[time:string]:seance:Seance;
//   }//les timeSlots diponibles
//
//
//
export interface SalleList{
  [id: string]: Salle;
}
export interface SalleSchedule{
  [day: string]: {
    [time: string]:{[niveau:string] : Seance;}
  };
}

export interface Salle {
  name: string;
  type: string;
  capacite: number;
  schedule: SalleSchedule;
}
