import {EnseignantDTO, Prof} from "./Professors";
import {RattrapageSchedule, Schedule} from "./Schedule";
import {Seance, SeanceDTO} from "./Seance";
import {BrancheDTO, SalleDTO} from './dto';
import {Salle, SalleList} from './Salle';
import {Branche} from './Branches';

/**
 * Processes a list of SeanceDTO objects and fills Schedule and RattrapageSchedule objects
 *
 * @param seanceDTOs Array of SeanceDTO objects from the API
 * @returns An object containing both the regular schedule and rattrapage schedule
 */
export function processSeancesToSchedules(seanceDTOs: SeanceDTO[]): {
  schedule: Schedule,
  rattrapageSchedule: RattrapageSchedule
} {
  // Initialize empty schedule objects
  const schedule: Schedule = {};
  const rattrapageSchedule: RattrapageSchedule = {};

  // Process each seance
  seanceDTOs.forEach(dto => {
    // Map DTO to Seance object with our mapping function
    const seance = mapSeanceDTOToSeance(dto);

    // Check if this is a makeup session
    const isRattrapage = determineIfRattrapage(dto);
    seance.isRattrapage = isRattrapage;

    // Format time string for consistent lookup
    const timeSlot = formatTimeSlot(dto.heureDebut, dto.heureFin);
    seance.time = timeSlot;

    // Extract day
    const day = dto.jour;
    seance.day = day;

    // Extract level/group information (assuming it's in the first branch name)
    const niveau = extractNiveauFromBranches(dto.branches);

    if (isRattrapage) {
      // Handle rattrapage schedule
      if (!rattrapageSchedule[day]) {
        rattrapageSchedule[day] = {};
      }

      if (!rattrapageSchedule[day][timeSlot]) {
        rattrapageSchedule[day][timeSlot] = [];
      }

      rattrapageSchedule[day][timeSlot].push(seance);
    } else {
      // Handle regular schedule
      if (!schedule[day]) {
        schedule[day] = {};
      }

      if (!schedule[day][niveau]) {
        schedule[day][niveau] = {};
      }

      if (!schedule[day][niveau][timeSlot]) {
        schedule[day][niveau][timeSlot] = [];
      }

      schedule[day][niveau][timeSlot].push(seance);
    }
  });

  return { schedule, rattrapageSchedule };
}

/**
 * Maps a SeanceDTO object to a Seance object
 * @param dto The SeanceDTO object to map
 * @returns Mapped Seance object
 */
function mapSeanceDTOToSeance(dto: SeanceDTO): Seance {
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
    isRattrapage: false, // Will be updated later
    time: timeFormatted,
    day: dto.jour,
  };
}

/**
 * Determines if a session is a makeup session based on information in the DTO
 * You may need to adjust this logic based on how your system identifies rattrapages
 */
function determineIfRattrapage(dto: SeanceDTO): boolean {
  // This is an example - adjust based on your application's logic
  // For instance, it could be flagged in the type field, or have a special frequency
  return dto.type?.toLowerCase().includes('rattrapage') ||
    dto.matiere?.toLowerCase().includes('rattrapage') ||
    dto.frequence?.toLowerCase().includes('rattrapage');
}

/**
 * Extracts niveau (class/level) from branch information
 */
function extractNiveauFromBranches(branches?: Array<{ name: string }>): string {
  if (!branches || branches.length === 0) {
    return 'Undefined';
  }

  // Assume the level is in the first branch name
  // You may need to adjust this logic based on your data structure
  return branches[0].name;
}

/**
 * Formats time slot consistently for lookup
 */
function formatTimeSlot(start: string, end: string): string {
  return `${start} - ${end}`;
}

/**
 * Maps an EnseignantDTO to a Prof object
 * @param dto The EnseignantDTO to map
 * @param allSeances Array of all Seance objects (used to populate the schedule)
 * @returns Mapped Prof object
 */
export function mapEnseignantDTOToProf(dto: EnseignantDTO, allSeances: Seance[] = []): Prof {
  // Create empty schedule
  const schedule: Schedule = {};

  // Filter seances that belong to this professor and add to schedule
  const professorSeances = allSeances.filter(seance =>
    dto.seanceIds.includes(seance.id)
  );

  // Populate the schedule
  professorSeances.forEach(seance => {
    const day = seance.day || '';
    const time = seance.time || '';
    const niveau = seance.groupe || 'Unknown';

    if (!schedule[day]) {
      schedule[day] = {};
    }

    if (!schedule[day][niveau]) {
      schedule[day][niveau] = {};
    }

    if (!schedule[day][niveau][time]) {
      schedule[day][niveau][time] = [];
    }

    schedule[day][niveau][time].push(seance);
  });

  // Get current week's sessions
  const currentWeekSessions = professorSeances.filter(seance =>
    !seance.isRattrapage && (!seance.biWeekly || isCurrentWeekBiWeekly())
  );

  // Get upcoming sessions (including rattrapages)
  const upcomingSessions = professorSeances
    .filter(seance => seance.isRattrapage || seance.rattrapageDate)
    .map(seance => ({
      ...seance,
      day: seance.day || '',
      time: seance.time || ''
    }));

  // Calculate total scheduled hours
  const totalScheduledHours = calculateTotalHours(professorSeances);

  return {
    name: extractProfessorName(dto), // Need to extract from seances or have separate endpoint
    codeEnseignant: dto.codeEnseignant,
    heures: dto.heures,
    schedule: schedule,
    totalScheduledHours: totalScheduledHours,
    currentWeekSessions: currentWeekSessions,
    totalHours: dto.heures, // Same as heures property
    upcomingSessions: upcomingSessions,
  };
}

/**
 * Maps a SalleDTO to a Salle object
 * @param dto The SalleDTO to map
 * @param allSeances Array of all Seance objects (used to populate the schedule)
 * @returns Mapped Salle object
 */
export function mapSalleDTOToSalle(dto: SalleDTO, allSeances: Seance[] = []): Salle {
  // Create empty schedule
  const schedule: Schedule = {};

  // Filter seances that are scheduled in this room and add to schedule
  const roomSeances = allSeances.filter(seance =>
    dto.seanceIds.includes(seance.id)
  );

  // Populate the schedule
  roomSeances.forEach(seance => {
    const day = seance.day || '';
    const time = seance.time || '';
    const niveau = seance.groupe || 'Unknown';

    if (!schedule[day]) {
      schedule[day] = {};
    }

    if (!schedule[day][niveau]) {
      schedule[day][niveau] = {};
    }

    if (!schedule[day][niveau][time]) {
      schedule[day][niveau][time] = [];
    }

    schedule[day][niveau][time].push(seance);
  });

  return {
    id: dto.id || 0,
    name: dto.identifiant,
    type: dto.type,
    capacite: dto.capacite,
    schedule: schedule
  };
}

/**
 * Maps multiple SalleDTO objects to a SalleList
 * @param dtos Array of SalleDTO objects
 * @param allSeances Array of all Seance objects (used to populate the schedules)
 * @returns SalleList object
 */
export function mapSalleDTOsToSalleList(dtos: SalleDTO[], allSeances: Seance[] = []): SalleList {
  const salleList: SalleList = {};

  dtos.forEach(dto => {
    const salle = mapSalleDTOToSalle(dto, allSeances);
    salleList[dto.identifiant] = salle;
  });

  return salleList;
}

/**
 * Helper function to extract professor name from DTO or seances
 * Need to implement based on your data structure
 */
function extractProfessorName(dto: EnseignantDTO): string {
  // This is a placeholder. You might need to get this information from
  // a separate endpoint or extract it from the seances themselves
  return dto.codeEnseignant;
}

/**
 * Helper function to check if current week is for bi-weekly sessions
 * Implement according to your business logic
 */
function isCurrentWeekBiWeekly(): boolean {
  // Placeholder implementation
  // Calculate based on current week number or specific logic for your app
  const now = new Date();
  return now.getWeek() % 2 === 0; // Example: even weeks are bi-weekly
}

/**
 * Helper function to calculate total hours from seances
 */
function calculateTotalHours(seances: Seance[]): number {
  return seances.reduce((total, seance) => {
    // Extract duration from time string (e.g., "08:30 - 10:00")
    if (seance.time) {
      const [start, end] = seance.time.split(' - ');
      if (start && end) {
        const startTime = parseTimeString(start);
        const endTime = parseTimeString(end);
        if (startTime && endTime) {
          const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + durationHours;
        }
      }
    }
    return total;
  }, 0);
}

/**
 * Parse time string in format "HH:MM" to Date object
 */
function parseTimeString(timeStr: string): Date | null {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Helper extension for Date to get week number
 */
declare global {
  interface Date {
    getWeek(): number;
  }
}

// Add getWeek method to Date prototype if not exists
if (!Date.prototype.getWeek) {
  Date.prototype.getWeek = function(): number {
    const firstDay = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(((this.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7);
  };
}

/**
 * Maps a BrancheDTO object to a Branche object
 * @param dto The BrancheDTO to map
 * @param allSeances Array of all Seance objects (used to find associated seances)
 * @returns Mapped Branche object
 */
export function mapBrancheDTOToBranche(dto: BrancheDTO, allSeances: Seance[] = []): Branche {
  // Filter seances that belong to this branch
  const brancheSeances = allSeances.filter(seance =>
    dto.seanceIds.includes(seance.id)
  );

  return {
    id: dto.id || 0,
    niveau: dto.niveau,
    specialite: dto.specialite,
    nbTD: dto.nbTD,
    departement: dto.departement,
    seances: brancheSeances
  };
}

/**
 * Maps multiple BrancheDTO objects to Branche objects
 * @param dtos Array of BrancheDTO objects
 * @param allSeances Array of all Seance objects (used to find associated seances)
 * @returns Array of mapped Branche objects
 */
export function mapBrancheDTOsToBranches(dtos: BrancheDTO[], allSeances: Seance[] = []): Branche[] {
  return dtos.map(dto => mapBrancheDTOToBranche(dto, allSeances));
}

/**
 * Maps a Branche to a BrancheDTO object
 * @param branche The Branche to convert
 * @returns Mapped BrancheDTO object
 */
export function mapBrancheToBrancheDTO(branche: Branche): BrancheDTO {
  return {
    id: branche.id,
    niveau: branche.niveau,
    specialite: branche.specialite,
    nbTD: branche.nbTD,
    departement: branche.departement,
    seanceIds: branche.seances.map(seance => seance.id)
  };
}


// Sample test data
const testSeanceDTOs: SeanceDTO[] = [
  // Regular session - Professor 1, Room 1, GINF2
  {
    id: '101',
    jour: 'Lundi',
    heureDebut: '08:30',
    heureFin: '10:00',
    type: 'COURS',
    matiere: 'Mathematics',
    frequence: 'HEBDOMADAIRE',
    salle: { name: 'Room A101' },
    enseignant: { name: 'Dr. Smith' },
    branches: [{ name: 'GINF2' }]
  },
  // Regular session - Professor 1, Room 2, GINF1
  {
    id: '102',
    jour: 'Lundi',
    heureDebut: '10:15',
    heureFin: '11:45',
    type: 'TD',
    matiere: 'Physics',
    frequence: 'BI-HEBDOMADAIRE',
    salle: { name: 'Lab B203' },
    enseignant: { name: 'Dr. Smith' },
    branches: [{ name: 'GINF1' }]
  },
  // Rattrapage session - Professor 2, Room 1, GINF3
  {
    id: '103',
    jour: 'Mardi',
    heureDebut: '13:00',
    heureFin: '14:30',
    type: 'RATTRAPAGE',
    matiere: 'Chemistry',
    frequence: 'UNIQUE',
    salle: { name: 'Room A101' },
    enseignant: { name: 'Dr. Williams' },
    branches: [{ name: 'GINF3' }]
  },
  // Regular session - Professor 2, Room 3, GINF2
  {
    id: '104',
    jour: 'Mercredi',
    heureDebut: '15:00',
    heureFin: '16:30',
    type: 'TP',
    matiere: 'Computer Science',
    frequence: 'HEBDOMADAIRE',
    salle: { name: 'Lab C305' },
    enseignant: { name: 'Dr. Williams' },
    branches: [{ name: 'GINF2' }]
  },
  // Regular session - Professor 3, Room 2, GINF3
  {
    id: '105',
    jour: 'Jeudi',
    heureDebut: '09:00',
    heureFin: '11:00',
    type: 'COURS',
    matiere: 'Database Systems',
    frequence: 'HEBDOMADAIRE',
    salle: { name: 'Lab B203' },
    enseignant: { name: 'Prof. Johnson' },
    branches: [{ name: 'GINF3' }]
  }
];

// Sample professor data
const testEnseignantDTOs: EnseignantDTO[] = [
  {
    codeEnseignant: 'SMITH001',
    heures: 20,
    seanceIds: [101, 102],
    propositionIds: [],
    signalIds: []
  },
  {
    codeEnseignant: 'WILLIAMS002',
    heures: 15,
    seanceIds: [103, 104],
    propositionIds: [],
    signalIds: []
  },
  {
    codeEnseignant: 'JOHNSON003',
    heures: 10,
    seanceIds: [105],
    propositionIds: [],
    signalIds: []
  }
];

// Sample room data
const testSalleDTOs: SalleDTO[] = [
  {
    id: 1,
    identifiant: 'A101',
    type: 'Classroom',
    capacite: 40,
    disponibilite: ['08:00-18:00'],
    seanceIds: [101, 103]
  },
  {
    id: 2,
    identifiant: 'B203',
    type: 'Lab',
    capacite: 25,
    disponibilite: ['08:00-18:00'],
    seanceIds: [102, 105]
  },
  {
    id: 3,
    identifiant: 'C305',
    type: 'Computer Lab',
    capacite: 30,
    disponibilite: ['08:00-18:00'],
    seanceIds: [104]
  }
];

// Test the functions
function runTest() {
  console.log('Starting test of mapping functions...');

  // Process SeanceDTO[] to Schedule and RattrapageSchedule
  console.log('\n1. Testing processSeancesToSchedules:');
  const { schedule, rattrapageSchedule } = processSeancesToSchedules(testSeanceDTOs);

  console.log('Regular Schedule:');
  console.log(JSON.stringify(schedule, null, 2));

  console.log('\nRattrapage Schedule:');
  console.log(JSON.stringify(rattrapageSchedule, null, 2));

  // Convert DTOs to Seance objects for use in other mappings
  const allSeances: Seance[] = testSeanceDTOs.map(dto => {
    const seance = {
      name: dto.matiere,
      id: dto.id ? parseInt(dto.id, 10) : 0,
      room: dto.salle?.name || '',
      type: dto.type,
      professor: dto.enseignant?.name || '',
      groupe: dto.branches && dto.branches.length > 0 ? dto.branches[0].name : '',
      biWeekly: dto.frequence?.toLowerCase() === 'bi-hebdomadaire',
      isRattrapage: dto.type?.toLowerCase().includes('rattrapage'),
      time: `${dto.heureDebut} - ${dto.heureFin}`,
      day: dto.jour
    };
    return seance;
  });






  // Test EnseignantDTO mapping
  console.log('\n2. Testing mapEnseignantDTOToProf:');
  const prof1 = mapEnseignantDTOToProf(testEnseignantDTOs[0], allSeances);
  console.log('Professor 1 (Dr. Smith):');
  console.log('Name:', prof1.name);
  console.log('Code:', prof1.codeEnseignant);
  console.log('Total Hours:', prof1.totalHours);
  console.log('Scheduled Hours:', prof1.totalScheduledHours);
  console.log('Current Week Sessions:', prof1.currentWeekSessions?.length);
  console.log('Schedule:', JSON.stringify(prof1.schedule, null, 2));

  // Test SalleDTO mapping
  console.log('\n3. Testing mapSalleDTOToSalle:');
  const salle1 = mapSalleDTOToSalle(testSalleDTOs[0], allSeances);
  console.log('Room 1 (A101):');
  console.log('Name:', salle1.name);
  console.log('Type:', salle1.type);
  console.log('Capacity:', salle1.capacite);
  console.log('Schedule:', JSON.stringify(salle1.schedule, null, 2));

  // Test SalleDTO[] to SalleList mapping
  console.log('\n4. Testing mapSalleDTOsToSalleList:');
  const salleList = mapSalleDTOsToSalleList(testSalleDTOs, allSeances);
  console.log('Room IDs:', Object.keys(salleList));
  console.log('Room B203 details:', JSON.stringify(salleList['B203'], null, 2));

  console.log('\nAll tests completed!');
}

// Run the test
runTest();
