
import {Seance} from './Seance';
import {Etudiant, Personne} from './Users';

// Branche Interface
export interface Branche {
  id: number;
  niveau: string;
  specialite: string;
  nbTD: number;
  departement: string;
  seances: Seance[];
}

// TD Interface
export interface TD {
  id: number;
  nb: number;
  nbTP: number;
  branche: Branche;
  tpList: TP[];
}

// TP Interface
export interface TP {
  id: number;
  nb: number;
  td: TD;
  etudiants: Etudiant[];
}

export interface BrancheList {
  [brancheName: string]: TD[];
}
export interface TDList {
  name: string;
  tpList: TP[];
}



