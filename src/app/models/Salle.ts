import {Seance} from './Seance';

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

export interface SalleSchedule{
  [day: string]: {
    [time: string]:{[groupe:string] : Seance;}
  };
}

export interface Salle {
  id: number;
  name: string;
  type: string;
  capacite: number;
  schedule: SalleSchedule;
}
