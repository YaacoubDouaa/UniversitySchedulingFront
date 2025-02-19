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
export interface EnseignantDTO {
  codeEnseignant: string;   // Unique code for the teacher
  heures: number;           // Total teaching hours

  // List of session IDs the teacher is responsible for
  seanceIds: number[];

  // List of proposed catch-up session IDs
  propositionIds: number[];

  // List of signal IDs
  signalIds: number[];
}

