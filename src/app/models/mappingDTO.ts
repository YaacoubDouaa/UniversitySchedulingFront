import {RattrapageSchedule, Schedule} from "./Schedule";
import {Seance, SeanceDTO} from "./Seance";

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
