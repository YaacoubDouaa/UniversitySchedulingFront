import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, map, catchError } from 'rxjs/operators';
import { Prof, ProfList } from './models/Professors';
import { Seance } from './models/Seance';
import { Schedule } from './models/Schedule';
import { INITIAL_PROFS_LIST } from './professors.data';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {
  // BehaviorSubject for state management
  private profsSubject = new BehaviorSubject<ProfList>(INITIAL_PROFS_LIST);

  // Service state
  private loaded = false;
  private currentDateTime = '2025-02-24 16:59:53';
  private currentUser = 'YaacoubDouaa';
  private dateTimeFormat = 'YYYY-MM-DD HH:MM:SS';

  // Initial data
  profs: ProfList = INITIAL_PROFS_LIST;

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize service and start date time updates
   */
  private initializeService(): void {
    this.updateCurrentDateTime();
    setInterval(() => this.updateCurrentDateTime(), 1000);
  }

  /**
   * Update current date time with proper formatting
   */
  private updateCurrentDateTime(): void {
    const now = new Date();
    this.currentDateTime = this.formatDateTime(now);
  }

  /**
   * Format date to UTC string with specified format
   */
  private formatDateTime(date: Date): string {
    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0')
    ].join('-') + ' ' + [
      String(date.getUTCHours()).padStart(2, '0'),
      String(date.getUTCMinutes()).padStart(2, '0'),
      String(date.getUTCSeconds()).padStart(2, '0')
    ].join(':');
  }

  /**
   * Get all professors
   */
  getProfs(): Observable<ProfList> {
    if (!this.loaded) {
      return of(this.profs).pipe(
        delay(1000),
        tap(profs => {
          this.loaded = true;
          this.profsSubject.next(profs);
        }),
        catchError(error => {
          console.error('Error loading professors:', error);
          return throwError(() => new Error('Failed to load professors'));
        })
      );
    }
    return this.profsSubject.asObservable();
  }

  /**
   * Get professor by code
   */
  getProfessorByCode(code: string): Observable<Prof | null> {
    return this.getProfs().pipe(
      map(profs => Object.values(profs).find(p => p.codeEnseignant === code) || null)
    );
  }

  /**
   * Get professor schedule
   */
  getProfessorSchedule(code: string): Observable<Schedule | null> {
    return this.getProfessorByCode(code).pipe(
      map(prof => prof?.schedule || null)
    );
  }

  /**
   * Add session to professor schedule
   */
  addSession(
    profCode: string,
    day: string,
    niveau: string,
    time: string,
    session: Seance
  ): Observable<boolean> {
    const prof = this.profs[profCode];
    if (!prof) {
      return throwError(() => new Error(`Professor ${profCode} not found`));
    }

    if (!this.isTimeSlotAvailable(prof.schedule, day, niveau, time)) {
      return throwError(() => new Error('Time slot not available'));
    }

    // Initialize schedule structure if needed
    if (!prof.schedule[day]) prof.schedule[day] = {};
    if (!prof.schedule[day][niveau]) prof.schedule[day][niveau] = {};
    if (!prof.schedule[day][niveau][time]) prof.schedule[day][niveau][time] = [];

    // Add session
    prof.schedule[day][niveau][time].push(session);
    this.profsSubject.next({...this.profs});

    return of(true).pipe(delay(300));
  }

  /**
   * Remove session from professor schedule
   */
  removeSession(
    profCode: string,
    day: string,
    niveau: string,
    time: string,
    sessionId: number
  ): Observable<boolean> {
    const prof = this.profs[profCode];
    if (!prof?.schedule?.[day]?.[niveau]?.[time]) {
      return throwError(() => new Error('Session not found'));
    }

    // Remove session
    prof.schedule[day][niveau][time] = prof.schedule[day][niveau][time]
      .filter(s => s.id !== sessionId);

    // Cleanup empty structures
    this.cleanupSchedule(prof.schedule, day, niveau, time);
    this.profsSubject.next({...this.profs});

    return of(true);
  }

  /**
   * Clean up empty schedule entries
   */
  private cleanupSchedule(schedule: Schedule, day: string, niveau: string, time: string): void {
    if (schedule[day][niveau][time].length === 0) {
      delete schedule[day][niveau][time];
      if (Object.keys(schedule[day][niveau]).length === 0) {
        delete schedule[day][niveau];
        if (Object.keys(schedule[day]).length === 0) {
          delete schedule[day];
        }
      }
    }
  }

  /**
   * Check time slot availability
   */
  private isTimeSlotAvailable(
    schedule: Schedule,
    day: string,
    niveau: string,
    time: string
  ): boolean {
    return !schedule?.[day]?.[niveau]?.[time]?.length;
  }

  /**
   * Get available time slots
   */
  getAvailableTimeSlots(
    profCode: string,
    niveau: string
  ): Observable<Array<{day: string, time: string}>> {
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const times = [
      '8:30-10:00',
      '10:15-11:45',
      '13:00-14:30',
      '14:45-16:15',
      '16:30-18:00'
    ];

    return this.getProfessorByCode(profCode).pipe(
      map(prof => {
        if (!prof) return [];

        return days.flatMap(day =>
          times.filter(time => this.isTimeSlotAvailable(prof.schedule, day, niveau, time))
            .map(time => ({day, time}))
        );
      })
    );
  }

  /**
   * Get the current date time string
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Get the current user login
   */
  getCurrentUser(): string {
    return this.currentUser;
  }

  /**
   * Get comprehensive professor data
   */
  getProfessorData(profCode: string): Observable<Prof | null> {
    return this.getProfessorByCode(profCode).pipe(
      map(prof => {
        if (!prof) return null;

        return {
          ...prof,
          totalHours: this.calculateTotalHours(prof.schedule),
          currentSessions: this.getCurrentSessions(prof.schedule),
          upcomingSessions: this.getUpcomingSessions(prof.schedule)
        };
      })
    );
  }

  /**
   * Calculate total scheduled hours
   */
  private calculateTotalHours(schedule: Schedule): number {
    let total = 0;
    Object.values(schedule).forEach(daySchedule => {
      Object.values(daySchedule).forEach(niveauSchedule => {
        Object.values(niveauSchedule).forEach(timeSlots => {
          total += timeSlots.length * 1.5; // Each session is 1.5 hours
        });
      });
    });
    return total;
  }

  /**
   * Get current day's sessions
   */
  private getCurrentSessions(schedule: Schedule): Seance[] {
    const currentDay = this.getCurrentDay();
    if (!schedule[currentDay]) return [];

    return Object.values(schedule[currentDay]).flatMap(niveauSchedule =>
      Object.values(niveauSchedule).flatMap(timeSlots => timeSlots)
    );
  }

  /**
   * Get upcoming sessions
   */
  private getUpcomingSessions(schedule: Schedule): Array<Seance & {
    day: string;
    time: string;
    niveau: string;
  }> {
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const currentDay = this.getCurrentDay();
    const currentDayIndex = days.indexOf(currentDay);
    const currentTime = this.getCurrentTimeSlot();

    const upcoming: Array<Seance & {day: string; time: string; niveau: string}> = [];

    for (let i = currentDayIndex; i < days.length; i++) {
      const day = days[i];
      if (!schedule[day]) continue;

      Object.entries(schedule[day]).forEach(([niveau, niveauSchedule]) => {
        Object.entries(niveauSchedule).forEach(([time, sessions]) => {
          if (i === currentDayIndex && this.isTimePassed(time, currentTime)) return;

          sessions.forEach(session => {
            upcoming.push({...session, day, time, niveau});
          });
        });
      });
    }

    return this.sortSessions(upcoming);
  }

  /**
   * Get current day name
   */
  private getCurrentDay(): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return days[new Date().getDay()];
  }

  /**
   * Get current time slot
   */
  private getCurrentTimeSlot(): string {
    const now = new Date();
    const timeSlots = [
      '8:30-10:00',
      '10:15-11:45',
      '13:00-14:30',
      '14:45-16:15',
      '16:30-18:00'
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return timeSlots.find(slot => {
      const [start] = slot.split('-');
      const [hours, minutes] = start.split(':').map(Number);
      return currentMinutes <= hours * 60 + minutes;
    }) || timeSlots[0];
  }

  /**
   * Check if time has passed
   */
  private isTimePassed(time: string, currentTime: string): boolean {
    const [t1] = time.split('-');
    const [t2] = currentTime.split('-');
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);
    return h1 * 60 + m1 < h2 * 60 + m2;
  }

  /**
   * Sort sessions by day and time
   */
  private sortSessions<T extends {day: string; time: string}>(sessions: T[]): T[] {
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return sessions.sort((a, b) => {
      const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;

      const [aStart] = a.time.split('-');
      const [bStart] = b.time.split('-');
      const [aHours, aMinutes] = aStart.split(':').map(Number);
      const [bHours, bMinutes] = bStart.split(':').map(Number);

      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });
  }

  getCurrentProfessorSchedule() {

  }
}
