import { Injectable } from '@angular/core';
// @ts-ignore
import { Seance, Schedule } from './schedule.component';

@Injectable({
  providedIn: 'root'
})
export class ConflictDetectionService {

  constructor() { }

  hasConflict(seance1: Seance, seance2: Seance): boolean {
    // Check if the seances have the same timeslot
    const sameTimeslot = seance1.time === seance2.time;

    // Check if the seances have the same room or the same professor
    const sameRoom = seance1.room === seance2.room;
    const sameProfessor = seance1.professor === seance2.professor;

    // A conflict occurs if they have the same timeslot and either the same room or the same professor
    return sameTimeslot && (sameRoom || sameProfessor);
  }

  checkForConflicts(schedule: Schedule, newSeance: Seance, day: string, time: string): { day: string, time: string, seance: Seance }[] {
    const conflicts: { day: string, time: string, seance: Seance }[] = [];

    for (const d of Object.keys(schedule)) {
      for (const t of Object.keys(schedule[d])) {
        const existingSeance = schedule[d][t];
        if (existingSeance && this.hasConflict(newSeance, existingSeance)) {
          conflicts.push({ day: d, time: t, seance: existingSeance });
        }
      }
    }

    return conflicts;
  }
}
