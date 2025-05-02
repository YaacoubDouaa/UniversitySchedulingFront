import {Salle} from './Salle';

export interface Seance {
  name: string;
  id: number;
  room: string;
  type: 'COURS' | 'TD' | 'TP'|string;
  professor: string;
  groupe: string;
  biWeekly: boolean;
  isRattrapage?: boolean;
  time?: string;
  day?: string;
  rattrapageDate?: Date | string; // New property for makeup session date

}

// SeanceConflict Interface
export interface SeanceConflict {
  seance1: Seance;
  seance2: Seance;
  day:string;
  time:string;
  conflictTypes: string[];
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface SeanceDTO {
  id?: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: string;
  matiere: string;
  frequence: string;
  salle?: { name: string };
  enseignant?: { name: string };
  branches?: Array<{ name: string }>;
}
export interface ConflictResolutionLog {
  conflictId: number;
  resolvedBy: string;
  resolvedAt: string;
  resolutionDetails: string;
}
