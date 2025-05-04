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
export interface  SallesDispo{
  [Day:string]:{[Day:string]:Salle[]}
}

export interface SalleList{
  [id: string]: Salle;
}



export interface Salle {
  id: number;
  name: string;
  type: string;
  capacite: number;
  schedule: Schedule;
}

export interface SalleSchedule{
  [day: string]: {
    [time: string]:{[groupe:string] : Seance;}
  };
}
