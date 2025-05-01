/**
 * Base interface for Personne entity.
 * Represents common attributes for all individuals within the system.
 */
export interface PersonneDTO {
  id?: number;        // Unique identifier for the person
  cin: string;        // National identification number
  nom: string;        // Last name
  prenom: string;     // First name
  email: string;      // Contact email
  tel: string;        // Telephone number
  adresse: string;    // Physical address
}

/**
 * Interface for Administrateur entity.
 * Extends PersonneDTO to include additional attributes specific to an Administrator.
 */
export interface AdministrateurDTO extends PersonneDTO {
  codeAdmin: string;  // Unique code for the administrator
}

/**
 * Interface for Branche entity.
 * Represents an academic program or specialization.
 */
export interface BrancheDTO {
  id?: number;           // Unique identifier for the Branche
  niveau: string;        // Level of study (e.g., undergraduate, graduate)
  specialite: string;    // Specialization or major
  nbTD: number;          // Number of tutorial sessions
  departement: string;   // Associated department
  seanceIds: number[];   // List of Seance IDs associated with this Branche
}

/**
 * Interface for Enseignant entity.
 * Extends PersonneDTO to include additional attributes specific to a Teacher.
 */
export interface EnseignantDTO extends PersonneDTO {
  codeEnseignant: string; // Unique code for the teacher
  heures: number;         // Total teaching hours
  seanceIds: number[];    // List of Seance IDs representing sessions taught by the teacher
  propositionIds: number[]; // List of PropositionDeRattrapage IDs representing proposed catch-up sessions
  signalIds: number[];    // List of Signal IDs
}

/**
 * Interface for Etudiant entity.
 * Extends PersonneDTO to include additional attributes specific to a Student.
 */
export interface EtudiantDTO extends PersonneDTO {
  matricule: string;  // Student ID
  brancheId: number;  // ID of the associated Branche representing the student's program or specialization
  tpId: number;       // ID of the associated TP representing the student's practical session
}

/**
 * Interface for FichierExcel entity.
 * Represents scheduling data imported into the system.
 */
export interface FichierExcelDTO {
  id?: number;           // Unique identifier for the file
  fileName: string;      // Name of the Excel file
  status: string;        // Import status (e.g., successful, failed)
  errors: string[];      // List of errors encountered during import
  importDate: Date;      // Date and time of import
}

/**
 * Interface for Notification entity.
 * Represents messages sent to users about schedule changes, announcements, or alerts.
 */
export interface NotificationDTO {
  id?: number;            // Unique identifier for the notification
  message: string;        // Content of the notification
  date: Date;             // Date and time the notification was sent
  type: string;           // Type of notification (e.g., update, alert, reminder)
  read: boolean;          // Indicates if the notification has been read
  recepteurId: number;    // ID of the recipient (Personne)
  expediteurId: number;   // ID of the sender (Personne or system)
}

/**
 * Interface for PropositionDeRattrapage entity.
 * Represents a proposal submitted by a teacher to schedule a make-up session.
 */
export interface PropositionDeRattrapageDTO {
  id?: number;           // Unique identifier for the proposal
  date: Date;            // Proposed date for the catch-up session
  reason: string;        // Explanation for the catch-up session
  status: string;        // Current status of the proposal (e.g., pending, approved, rejected)
  enseignantId: number;  // ID of the associated Enseignant who proposed the catch-up session
}

/**
 * Interface for Salle entity.
 * Represents a physical classroom or lab space.
 */
export interface SalleDTO {
  id?: number;          // Unique identifier for the room
  identifiant: string;  // Room identifier
  type: string;         // Room type (e.g., lecture hall, lab)
  capacite: number;     // Capacity of the room
  disponibilite: string[]; // List of available time slots for the room
  seanceIds: number[];  // List of Seance IDs representing sessions scheduled in the room
}

/**
 * Interface for SeanceConflict entity.
 * Represents a conflict between two sessions.
 */
export interface SeanceConflictDTO {
  seance1Id: number;      // ID of the first conflicting session
  seance2Id: number;      // ID of the second conflicting session
  conflictTypes: string[]; // List of conflict types
}

/**
 * Interface for Seance entity.
 * Represents a scheduled teaching session (lecture, tutorial, practical).
 */
export interface SeanceDTO {
  id?: number;         // Unique identifier for the session
  jour: string;        // Day of the session
  heureDebut: string;  // Start time of the session
  heureFin: string;    // End time of the session
  type: string;        // Type of session (e.g., CR, CI, TD, TP)
  matiere: string;     // Subject
  frequence: string;   // Frequency of the session (e.g., weekly, biweekly, specific date for catch-up)
  salleId: number;     // ID of the Salle assigned to the session
  enseignantId: number; // ID of the Enseignant assigned to the session
  brancheIds: number[]; // List of Branche IDs associated with this session
  tdIds: number[];     // List of TD IDs associated with this session
  tpIds: number[];     // List of TP IDs associated with this session
}

/**
 * Interface for SeanceRoomConflict entity.
 * Represents a room conflict between two sessions.
 */
export interface SeanceRoomConflictDTO {
  seance1Id: number;    // ID of the first conflicting session
  seance2Id: number;    // ID of the second conflicting session
  conflictType: string; // Type of conflict (e.g., "Room Conflict")
}

/**
 * Interface for Signal entity.
 * Represents a message sent by a teacher to report a problem or suggest a change regarding their schedule.
 */
export interface SignalDTO {
  id?: number;         // Unique identifier for the signal
  message: string;     // Details of the issue or suggestion
  severity: string;    // Importance level
  timestamp: Date;     // Date and time the signal was submitted
  enseignantId: string; // ID of the teacher who sent the signal
}

/**
 * Interface for SingleSeanceConflict entity.
 * Represents conflicts associated with a single session.
 */
export interface SingleSeanceConflictDTO {
  seanceId: number;       // ID of the session
  conflictTypes: string[]; // List of conflict types
}

/**
 * Interface for TD entity.
 * Represents group tutorial sessions associated with a Branche.
 */
export interface TDDTO {
  id: number;        // Unique identifier for the tutorial session
  nb: number;         // Number of tutorial sessions
  nbTP: number;       // Number of practical sessions associated
  brancheId: number;  // ID of the associated Branche representing the academic program or specialization
  tpIds: number[];    // List of TP IDs representing practical sessions
  seanceIds: number[]; // List of Seance IDs
}

/**
 * Interface for Technicien entity.
 * Extends PersonneDTO to include additional attributes specific to a Technician.
 */
export interface TechnicienDTO extends PersonneDTO {
  codeTechnicien: string; // Unique code for the technician
}

/**
 * Interface for TP entity.
 * Represents hands-on practical or lab sessions.
 */
export interface TPDTO {
  id: number;         // Unique identifier for the practical session
  nb: number;          // Number of practical sessions
  tdId: number;        // ID of the associated TD representing the tutorial session
  etudiantIds: number[]; // List of Etudiant IDs representing students enrolled in the practical session
  seanceIds: number[]; // List of Seances IDs representing Seances per TP
}
