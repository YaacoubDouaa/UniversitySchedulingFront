import { Injectable } from '@angular/core';
// @ts-ignore
import { Seance, Schedule } from './schedule.component';
import { SeanceConflict } from './models/Seance';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConflictService {
  private conflictsSubject: BehaviorSubject<SeanceConflict[]>;
  conflicts$: Observable<SeanceConflict[]>;

  private readonly initialConflicts: SeanceConflict[] = [
    {
      seance1: {
        name: 'Mathematics 101',
        id: 1,
        room: 'A101',
        type: 'COURS',
        professor: 'Dr. Smith',
        groupe: 'MATH101',
        biWeekly:false
      },
      seance2: {
        name: 'Physics 201',
        id: 2,
        room: 'A101',
        type: 'TD',
        professor: 'Dr. Johnson',
        groupe: 'PHYS201',
        biWeekly:false
      },
      day: 'LUNDI',
      time: '8:30-10:00',
      conflictTypes: ['Room Conflict', 'Time Conflict']
    },
    {
      seance1: {
        name: 'Chemistry 301',
        id: 3,
        room: 'B201',
        type: 'TP',
        professor: 'Dr. Brown',
        groupe: 'CHEM301',
        biWeekly:false
      },
      seance2: {
        name: 'Biology 202',
        id: 4,
        room: 'B202',
        type: 'COURS',
        professor: 'Dr. Brown',
        groupe: 'BIO202',
        biWeekly:false
      },
      day: 'MARDI',
      time: '8:30-10:00',
      conflictTypes: ['Professor Conflict']
    }
  ];

  constructor() {
    this.conflictsSubject = new BehaviorSubject<SeanceConflict[]>([...this.initialConflicts]);
    this.conflicts$ = this.conflictsSubject.asObservable();
  }

  // Get current conflicts
  getConflicts(): Observable<SeanceConflict[]> {
    return this.conflicts$;
  }

  // Reset conflicts to initial state
  resetConflicts(): void {
    this.conflictsSubject.next([...this.initialConflicts]);
  }

  // Update a specific conflict
  updateConflict(index: number, updatedConflict: SeanceConflict): void {
    const currentConflicts = [...this.conflictsSubject.value];
    if (index >= 0 && index < currentConflicts.length) {
      currentConflicts[index] = updatedConflict;
      this.conflictsSubject.next(currentConflicts);
    }
  }

  // Add a new conflict
  addConflict(conflict: SeanceConflict): void {
    const currentConflicts = [...this.conflictsSubject.value, conflict];
    this.conflictsSubject.next(currentConflicts);
  }

  // Remove a conflict
  removeConflict(index: number): void {
    const currentConflicts = [...this.conflictsSubject.value];
    if (index >= 0 && index < currentConflicts.length) {
      currentConflicts.splice(index, 1);
      this.conflictsSubject.next(currentConflicts);
    }
  }

  // Check if all conflicts are resolved
  areAllConflictsResolved(): boolean {
    return this.conflictsSubject.value.every(conflict => this.isConflictResolved(conflict));
  }

  // Check if a specific conflict is resolved
  isConflictResolved(conflict: SeanceConflict): boolean {
    return this.checkConflictResolution(conflict);
  }

  // Private helper method to check conflict resolution
  private checkConflictResolution(conflict: SeanceConflict): boolean {
    const { seance1, seance2, conflictTypes } = conflict;

    for (const conflictType of conflictTypes) {
      switch (conflictType) {
        case 'Room Conflict':
          if (seance1.room === seance2.room) {
            return false;
          }
          break;
        case 'Time Conflict':
          if (this.hasTimeConflict(conflict)) {
            return false;
          }
          break;
        case 'Professor Conflict':
          if (seance1.professor === seance2.professor) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  // Helper method to check time conflicts
  private hasTimeConflict(conflict: SeanceConflict): boolean {
    return this.timeOverlaps(conflict.time, conflict.time);
  }

  // Helper method to check if times overlap
  private timeOverlaps(time1: string, time2: string): boolean {
    const [start1, end1] = time1.split('-').map(t => this.convertTimeToMinutes(t.trim()));
    const [start2, end2] = time2.split('-').map(t => this.convertTimeToMinutes(t.trim()));
    return start1 < end2 && start2 < end1;
  }

  // Helper method to convert time to minutes for comparison
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Save conflicts to backend (Placeholder implementation)
  saveConflicts(): Observable<SeanceConflict[]> {
    return this.conflicts$;
  }
}
