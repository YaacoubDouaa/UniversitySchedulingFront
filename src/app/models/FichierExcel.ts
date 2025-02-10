// FichierExcel Interface
export interface FichierExcel {
  id: number;
  fileName: string;
  status: string;
  errors: string[];
  importDate: string; // ISO Date Format
}

