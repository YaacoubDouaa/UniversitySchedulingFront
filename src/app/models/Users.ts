export interface Personne {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  adresse: string;
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


// Technicien Interface
export interface TechnicienDTO extends Personne {
  codeTechnicien: string;
}
