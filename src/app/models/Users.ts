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
export interface UserSettings {
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  fontSize: number;
  theme: 'light' | 'dark' | 'system';
  layout: 'default' | 'compact' | 'expanded';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    accountActivity: boolean;
    newFeatures: boolean;
    marketing: boolean;
    frequency: 'real-time' | 'daily' | 'weekly';
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  privacy: {
    analyticsSharing: boolean;
    personalizedAds: boolean;
    visibility: 'public' | 'private';
    dataRetention: '6-months' | '1-year' | '2-years' | 'indefinite';
  };
}

export interface Account {
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
}

export interface Metric {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  status: string;
  progress: number;
  target: number;
  date: string;
}
