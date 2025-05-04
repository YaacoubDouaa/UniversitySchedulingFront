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
/**
 * Maps a SeanceDTO object to a Seance object
 * @param dto The SeanceDTO object to map
 * @returns Mapped Seance object
 */
export function mapSeanceDTOToSeance(dto: SeanceDTO): Seance {
  // Format time as "HH:MM - HH:MM"
  const timeFormatted = `${dto.heureDebut} - ${dto.heureFin}`;

  // Check if bi-weekly based on frequence value
  const isBiWeekly = dto.frequence?.toLowerCase() === 'bi-hebdomadaire';

  // Extract group from branches if available
  const groupName = dto.branches && dto.branches.length > 0
    ? dto.branches.map(b => b.name).join(', ')
    : '';

  return {
    name: dto.matiere,
    id: dto.id ? parseInt(dto.id, 10) : 0,
    room: dto.salle?.name || '',
    type: dto.type,
    professor: dto.enseignant?.name || '',
    groupe: groupName,
    biWeekly: isBiWeekly,
    isRattrapage: false, // Default value as it's not present in DTO
    time: timeFormatted,
    day: dto.jour,
  };
}

/**
 * Maps a Seance object to a SeanceDTO object
 * @param seance The Seance object to map
 * @returns Mapped SeanceDTO object
 */
export function mapSeanceToSeanceDTO(seance: Seance): SeanceDTO {
  // Extract start and end times from the time string (format: "HH:MM - HH:MM")
  let heureDebut = '';
  let heureFin = '';

  if (seance.time) {
    const timeParts = seance.time.split(' - ');
    if (timeParts.length === 2) {
      heureDebut = timeParts[0].trim();
      heureFin = timeParts[1].trim();
    }
  }

  return {
    id: seance.id?.toString(),
    jour: seance.day || '',
    heureDebut: heureDebut,
    heureFin: heureFin,
    type: seance.type,
    matiere: seance.name,
    frequence: seance.biWeekly ? 'BI-HEBDOMADAIRE' : 'HEBDOMADAIRE',
    salle: seance.room ? { name: seance.room } : undefined,
    enseignant: seance.professor ? { name: seance.professor } : undefined,
    branches: seance.groupe ? [{ name: seance.groupe }] : [],
  };
}
