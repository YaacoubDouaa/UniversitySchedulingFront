export interface Personne {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  adresse: string;
  // List of signal IDs
  signalIds: number[];
}
export interface User {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'away';
}

// Administrateur Interface
export interface Administrateur extends Personne {
  codeAdmin: string;
}

// Enseignant Interface
export interface Enseignant extends Personne {
  codeEnseignant: string;
  heures: number;
  seanceIds: number[];
  propositionsDeRattrapageIds: number[];
}

// Etudiant Interface
export interface Etudiant extends Personne {
  matricule: string;
  brancheId: number;
  tpId: number;
}
export interface Student{
  id: number;
  name: string;
  groupe:string;
  niveau:string;
}

// Technicien Interface
export interface TechnicienDTO extends Personne {
  codeTechnicien: string;
}

