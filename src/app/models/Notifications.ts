// FichierExcel Interface
export interface FichierExcel {
  id: number;
  fileName: string;
  status: string;
  errors: string[];
  importDate: string; // ISO Date Format
}

// Notification Interface
export interface Notification {
  id: number;
  message: string;
  date: string; // ISO Date Format
  type: string;
  read: boolean;
  recepteurId: number;
  expediteurId: number;
}

// PropositionDeRattrapage Interface
export interface PropositionDeRattrapage {
  id: number;
  date: string; // ISO Date Format
  reason: string;
  status: string;
  enseignantId: number;
}

// Signal Interface
export interface Signal {
  id: number;
  message: string;
  severity: string;
  timestamp: string; // ISO Date Format
}
