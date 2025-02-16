import {Personne} from './Users';
import {Seance} from './Seance';
export interface ProfList{
  [name: string]: Prof;
}
export interface ProfSchedule{
  [day: string]: {
    [time: string]:{[niveau:string] : Seance;}
  };
}

export interface Prof {
  name: string;
  codeEnseignant: string;
  heures: number;
  schedule: ProfSchedule;
}

