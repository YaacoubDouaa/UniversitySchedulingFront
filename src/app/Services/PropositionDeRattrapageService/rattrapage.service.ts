import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { RattrapageSchedule } from '../../models/Schedule';
import { Seance } from '../../models/Seance';

@Injectable({
  providedIn: 'root'
})
export class RattrapageService {
  /**
   * System state
   */
  private readonly currentDateTime = '2025-02-24 19:47:13';
  private readonly currentUser = 'YaacoubDouaa';

  // Track the last used ID
  private lastUsedId = 5;

  /**
   * Initial rattrapage schedule state
   */
  private readonly initialSchedule: RattrapageSchedule = {
    'LUNDI': {
      '08:30-10:00': [
        {
          id: 1,
          name: 'Maths',
          room: '101',
          professor: 'Dr. Smith',
          groupe: 'ING1_INFO',
          type: 'COURS',
          biWeekly: false
        },
        {
          id: 2,
          name: 'Physics',
          room: '102',
          professor: 'Prof. Johnson',
          groupe: 'ING2_INFO',
          type: 'TD',
          biWeekly: false
        },
      ],
      '10:15-11:45': [
        {
          id: 3,
          name: 'Chemistry',
          room: '103',
          professor: 'Dr. Williams',
          groupe: 'ING3_INFO',
          type: 'TP',
          biWeekly: true
        },
      ],
    },
    'MARDI': {
      '13:00-14:30': [
        {
          id: 4,
          name: 'Biology',
          room: '104',
          professor: 'Prof. Davis',
          groupe: 'ING1_INFO',
          type: 'COURS',
          biWeekly: false
        },
      ],
      '14:45-16:15': [
        {
          id: 5,
          name: 'Computer Science',
          room: '105',
          professor: 'Dr. Brown',
          groupe: 'ING2_INFO',
          type: 'TD',
          biWeekly: true
        },
      ],
    }
  };

  /**
   * Schedule state management
   */
  private rattrapageScheduleSubject = new BehaviorSubject<RattrapageSchedule>(this.initialSchedule);
  currentSchedule = this.rattrapageScheduleSubject.asObservable();

  /**
   * Generate new unique ID
   */
  private generateNewId(): number {
    return ++this.lastUsedId;
  }

  /**
   * Add a new makeup session
   */
  addRattrapageSeance(day: string, time: string, seance: Seance): Observable<boolean> {
    try {
      const schedule = this.rattrapageScheduleSubject.getValue();

      if (!schedule[day]) {
        schedule[day] = {};
      }

      if (!schedule[day][time]) {
        schedule[day][time] = [];
      }

      // Ensure seance has all required properties
      const newSeance: Seance = {
        ...seance,
        id: seance.id || this.generateNewId(),
        biWeekly: Boolean(seance.biWeekly)
      };

      schedule[day][time].push(newSeance);
      this.rattrapageScheduleSubject.next({ ...schedule });

      return of(true);
    } catch (error) {
      console.error('Error adding makeup session:', error);
      return throwError(() => new Error('Failed to add makeup session'));
    }
  }

  /**
   * Get all makeup sessions
   */
  getRattrapageSchedule(): Observable<RattrapageSchedule> {
    return this.currentSchedule;
  }

  /**
   * Update room for a specific session
   */
  updateSeanceSalle(day: string, time: string, seanceId: number, newRoom: string): Observable<boolean> {
    try {
      const schedule = this.rattrapageScheduleSubject.getValue();

      if (!schedule[day]?.[time]) {
        return throwError(() => new Error('Time slot not found'));
      }

      const seanceIndex = schedule[day][time]
        .findIndex(seance => seance.id === seanceId);

      if (seanceIndex === -1) {
        return throwError(() => new Error('Session not found'));
      }

      schedule[day][time][seanceIndex] = {
        ...schedule[day][time][seanceIndex],
        room: newRoom
      };

      this.rattrapageScheduleSubject.next({ ...schedule });
      return of(true);
    } catch (error) {
      console.error('Error updating room:', error);
      return throwError(() => new Error('Failed to update room'));
    }
  }

  /**
   * Get a specific session
   */
  getSeance(day: string, time: string, seanceId: number): Observable<Seance | null> {
    try {
      const schedule = this.rattrapageScheduleSubject.getValue();
      const seance = schedule[day]?.[time]?.find(s => s.id === seanceId);
      return of(seance || null);
    } catch (error) {
      console.error('Error getting session:', error);
      return throwError(() => new Error('Failed to get session'));
    }
  }

  /**
   * Delete a makeup session
   */
  deleteSeance(day: string, time: string, seanceId: number): Observable<boolean> {
    try {
      const schedule = this.rattrapageScheduleSubject.getValue();

      if (!schedule[day]?.[time]) {
        return throwError(() => new Error('Time slot not found'));
      }

      const initialLength = schedule[day][time].length;
      schedule[day][time] = schedule[day][time].filter(s => s.id !== seanceId);

      if (schedule[day][time].length === initialLength) {
        return throwError(() => new Error('Session not found'));
      }

      this.cleanupSchedule(schedule, day, time);
      this.rattrapageScheduleSubject.next({ ...schedule });
      return of(true);
    } catch (error) {
      console.error('Error deleting session:', error);
      return throwError(() => new Error('Failed to delete session'));
    }
  }

  /**
   * Clean up empty schedule entries
   */
  private cleanupSchedule(schedule: RattrapageSchedule, day: string, time: string): void {
    if (schedule[day][time].length === 0) {
      delete schedule[day][time];
      if (Object.keys(schedule[day]).length === 0) {
        delete schedule[day];
      }
    }
  }

  /**
   * Get current date and time
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Get current user
   */
  getCurrentUser(): string {
    return this.currentUser;
  }
}
