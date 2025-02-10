import {Salle} from './Salle';

export interface Seance {
  name: string;
  id: number;
  room: string;
  type: 'COURS' | 'TD' | 'TP'|string;
  professor: string;
  code: string;
  biWeekly?: boolean;
}

// SeanceConflict Interface
export interface SeanceConflict {
  seance1: Seance;
  seance2: Seance;
  conflictTypes: string[];
}
