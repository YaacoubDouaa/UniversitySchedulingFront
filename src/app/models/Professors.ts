import {Personne} from './Users';
import {Seance} from './Seance';
import {Schedule} from './Schedule';
export interface ProfList{
  [name: string]: Prof;
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

// Professor interface
export interface Prof {

  name: string;
  codeEnseignant: string;
  heures: number;
  schedule: Schedule;
  totalScheduledHours?: number;
  currentWeekSessions?: Seance[];
  totalHours?: number;
  upcomingSessions?: Array<Seance & { day: string; time: string }>;
}

