import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, map, catchError } from 'rxjs/operators';
import {Prof, ProfList, ProfSchedule} from './models/Professors';
import {Seance} from './models/Seance';
import {INITIAL_PROFS_LIST} from './professors.data';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {
  private profsSubject = new BehaviorSubject<ProfList>(INITIAL_PROFS_LIST);
  private loaded = false;
  private currentDate = '2025-02-23 23:34:44';
  private currentUser = 'YaacoubDouaa';

  profs: ProfList = INITIAL_PROFS_LIST;


  constructor() {
    this.updateCurrentTime();
  }

  private updateCurrentTime(): void {
    setInterval(() => {
      const now = new Date();
      this.currentDate = this.formatDateTime(now);
    }, 1000);
  }

  private formatDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }

  // Get professor by code
  getProfessorByCode(codeEnseignant: string): Observable<Prof | null> {
    return this.getProfs().pipe(
      map(profs => {
        const professor = Object.values(profs).find(p => p.codeEnseignant === codeEnseignant);
        return professor || null;
      })
    );
  }

  // Get professor by name
  getProfessorByName(name: string): Observable<Prof | null> {
    return this.getProfs().pipe(
      map(profs => profs[name] || null)
    );
  }

  // Get current professor's schedule
  getCurrentProfessorSchedule(): Observable<ProfSchedule | null> {
    return this.getProfs().pipe(
      map(profs => {
        const professor = Object.values(profs).find(p => p.name === this.currentUser);
        return professor?.schedule || null;
      })
    );
  }

  // Add new session to professor's schedule
  addSessionToProfessor(
    profName: string,
    day: string,
    time: string,
    niveau: string,
    session: Seance
  ): Observable<boolean> {
    if (!this.isProfAvailable(profName, day, time)) {
      return throwError(() => new Error('Time slot is not available'));
    }

    const prof = this.profs[profName];
    if (!prof) {
      return throwError(() => new Error('Professor not found'));
    }

    // Initialize nested objects if they don't exist
    if (!prof.schedule[day]) {
      prof.schedule[day] = {};
    }
    if (!prof.schedule[day][time]) {
      prof.schedule[day][time] = {};
    }

    prof.schedule[day][time][niveau] = session;
    this.profsSubject.next(this.profs);
    return of(true).pipe(delay(300)); // Simulate API delay
  }

  // Remove session from professor's schedule
  removeSessionFromProfessor(
    profName: string,
    day: string,
    time: string,
    niveau: string
  ): Observable<boolean> {
    const prof = this.profs[profName];
    if (!prof?.schedule?.[day]?.[time]?.[niveau]) {
      return throwError(() => new Error('Session not found'));
    }

    delete prof.schedule[day][time][niveau];

    // Clean up empty objects
    if (Object.keys(prof.schedule[day][time]).length === 0) {
      delete prof.schedule[day][time];
    }
    if (Object.keys(prof.schedule[day]).length === 0) {
      delete prof.schedule[day];
    }

    this.profsSubject.next(this.profs);
    return of(true).pipe(delay(300)); // Simulate API delay
  }

  // Update professor's teaching hours
  updateProfessorHours(profName: string, hours: number): Observable<boolean> {
    const prof = this.profs[profName];
    if (!prof) {
      return throwError(() => new Error('Professor not found'));
    }

    prof.heures = hours;
    this.profsSubject.next(this.profs);
    return of(true).pipe(delay(300));
  }

  // Get conflicts for a specific time slot
  getConflicts(day: string, time: string): Observable<Array<{prof: string, niveau: string}>> {
    return this.getProfs().pipe(
      map(profs => {
        const conflicts: Array<{prof: string, niveau: string}> = [];
        Object.values(profs).forEach(prof => {
          if (prof.schedule[day]?.[time]) {
            Object.keys(prof.schedule[day][time]).forEach(niveau => {
              conflicts.push({ prof: prof.name, niveau });
            });
          }
        });
        return conflicts;
      })
    );
  }

  // Get professor's total scheduled hours
  getProfessorTotalHours(profName: string): Observable<number> {
    return this.getProfs().pipe(
      map(profs => {
        const prof = profs[profName];
        if (!prof) return 0;

        let totalHours = 0;
        Object.values(prof.schedule).forEach(daySchedule => {
          Object.values(daySchedule).forEach(timeSlots => {
            totalHours += Object.keys(timeSlots).length * 1.5; // Assuming each session is 1.5 hours
          });
        });
        return totalHours;
      })
    );
  }

  // Check professor availability
  isProfAvailable(name: string, day: string, time: string): boolean {
    return !(this.profs[name]?.schedule?.[day]?.[time]);
  }

  // Get available time slots
  getAvailableTimeSlots(name: string, days: string[], times: string[]): { day: string, time: string }[] {
    let availableSlots: { day: string, time: string }[] = [];

    for (let day of days) {
      for (let time of times) {
        if (this.isProfAvailable(name, day, time)) {
          availableSlots.push({ day, time });
        }
      }
    }
    return availableSlots;
  }

  // Get all professors
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

  // Get current date and time
  getCurrentDateTime(): string {
    return this.currentDate;
  }

  // Get current user
  getCurrentUser(): string {
    return this.currentUser;
  }

// In your ProfessorsService class
  getProfessorData(currentUser: string): Observable<Prof | null> {
    return this.getProfs().pipe(
      map(profs => {
        // Try to find professor by exact name
        let professor = profs[currentUser];

        // If not found by exact name, try to find by partial match or code
        if (!professor) {
          const foundProf = Object.values(profs).find(p =>
            p.name.toLowerCase().includes(currentUser.toLowerCase()) ||
            p.codeEnseignant.toLowerCase() === currentUser.toLowerCase()
          );

          // If still not found, return null
          if (!foundProf) {
            console.warn(`Professor not found for user: ${currentUser}`);
            return null;
          }

          professor = foundProf;
        }

        // Now we know professor exists, we can safely use it
        return {
          ...professor,
          totalScheduledHours: this.calculateTotalHours(professor.schedule),
          currentWeekSessions: this.getCurrentWeekSessions(professor.schedule),
          upcomingSessions: this.getUpcomingSessions(professor.schedule)
        };
      }),
      catchError(error => {
        console.error('Error fetching professor data:', error);
        return throwError(() => new Error('Failed to fetch professor data'));
      })
    );
  }

// Helper methods for getProfessorData
  private calculateTotalHours(schedule: ProfSchedule): number {
    let totalHours = 0;
    Object.values(schedule).forEach(daySchedule => {
      Object.values(daySchedule).forEach(timeSlots => {
        totalHours += Object.keys(timeSlots).length * 1.5; // Each session is 1.5 hours
      });
    });
    return totalHours;
  }

  private getCurrentWeekSessions(schedule: ProfSchedule): Seance[] {
    const currentDate = new Date();
    const currentDay = this.getDayName(currentDate);
    const sessions: Seance[] = [];

    if (schedule[currentDay]) {
      Object.values(schedule[currentDay]).forEach(timeSlots => {
        Object.values(timeSlots).forEach(session => {
          sessions.push(session);
        });
      });
    }

    return sessions;
  }

  private getUpcomingSessions(schedule: ProfSchedule): Array<Seance & { day: string; time: string }> {
    const currentDate = new Date();
    const currentDay = this.getDayName(currentDate);
    const currentTime = this.getCurrentTimeSlot();
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const upcomingSessions: Array<Seance & { day: string; time: string }> = [];

    // Get current day index
    const currentDayIndex = days.indexOf(currentDay);

    // Loop through remaining days of the week
    for (let i = currentDayIndex; i < days.length; i++) {
      const day = days[i];
      if (schedule[day]) {
        Object.entries(schedule[day]).forEach(([time, timeSlots]) => {
          // For current day, only include upcoming time slots
          if (i === currentDayIndex && this.isTimeSlotPassed(currentTime, time)) {
            return;
          }

          Object.values(timeSlots).forEach(session => {
            upcomingSessions.push({
              ...session,
              day,
              time
            });
          });
        });
      }
    }

    // Sort by day and time
    return upcomingSessions.sort((a, b) => {
      const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return this.compareTimeSlots(a.time, b.time);
    });
  }

  private getDayName(date: Date): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return days[date.getDay()];
  }

  private getCurrentTimeSlot(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeSlots = [
      '8:30-10:00',
      '10:15-11:45',
      '13:00-14:30',
      '14:45-16:15',
      '16:30-18:00'
    ];

    // Find the current time slot
    for (const slot of timeSlots) {
      const [start] = slot.split('-');
      const [startHour, startMinute] = start.split(':').map(Number);
      if (hours < startHour || (hours === startHour && minutes < startMinute)) {
        return slot;
      }
    }

    return timeSlots[0]; // Return first slot if outside normal hours
  }

  private isTimeSlotPassed(currentSlot: string, compareSlot: string): boolean {
    const [currentStart] = currentSlot.split('-');
    const [compareStart] = compareSlot.split('-');
    const [currentHour, currentMinute] = currentStart.split(':').map(Number);
    const [compareHour, compareMinute] = compareStart.split(':').map(Number);

    if (currentHour > compareHour) return true;
    if (currentHour === compareHour && currentMinute > compareMinute) return true;
    return false;
  }

  private compareTimeSlots(a: string, b: string): number {
    const [aStart] = a.split('-');
    const [bStart] = b.split('-');
    const [aHour, aMinute] = aStart.split(':').map(Number);
    const [bHour, bMinute] = bStart.split(':').map(Number);

    if (aHour !== bHour) return aHour - bHour;
    return aMinute - bMinute;
  }}
