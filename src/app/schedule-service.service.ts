import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Schedule } from './models/Schedule';
import { Seance } from './models/Seance';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  /**
   * BehaviorSubject to manage and broadcast schedule state changes
   * Initialized with an empty schedule object
   */
  private scheduleSubject = new BehaviorSubject<Schedule>({});

  /**
   * Public Observable for components to subscribe to schedule changes
   */
  currentSchedule = this.scheduleSubject.asObservable();

  /**
   * Current system date and time in UTC
   * Format: YYYY-MM-DD HH:MM:SS
   */
  private currentDateTime = '2025-02-24 19:34:58';

  /**
   * Current user's login information
   */
  private currentUser = 'YaacoubDouaa';

  /**
   * Validates if a new session can be added to a specific time slot
   * Rules:
   * 1. Empty slots can accept any type of session
   * 2. Slots with a weekly session cannot accept any new sessions
   * 3. Slots with existing sessions cannot accept weekly sessions
   * 4. Slots can have maximum 2 biweekly sessions
   *
   * @param day - The day of the week (e.g., 'LUNDI', 'MARDI')
   * @param time - Time slot (e.g., '8:30-10:00')
   * @param niveau - Academic level (e.g., 'ING1_INFO')
   * @param isBiweekly - Whether the new session is biweekly
   * @returns boolean indicating if the session can be added
   */
  canAddSession(day: string, time: string, niveau: string, isBiweekly: boolean): boolean {
    // Get existing sessions for the time slot
    const sessions = this.getSessionsForTimeSlot(day, time, niveau);

    // If no sessions exist, any type can be added
    if (sessions.length === 0) return true;

    // Check for existing weekly session
    const hasWeeklySession = sessions.some(s => !s.biWeekly);
    if (hasWeeklySession) return false;

    // Cannot add weekly session if any sessions exist
    if (!isBiweekly) return false;

    // Check biweekly session limit
    const biweeklySessions = sessions.filter(s => s.biWeekly);
    return biweeklySessions.length < 2;
  }

  /**
   * Adds a new session to the schedule with validation
   * Handles schedule structure creation if needed
   *
   * @param day - The day of the week
   * @param time - Time slot
   * @param niveau - Academic level
   * @param seance - Session details to add
   * @returns Observable<boolean> indicating success or error
   */
  addSession(day: string, time: string, niveau: string, seance: Seance): Observable<boolean> {
    // Validate if session can be added
    if (!this.canAddSession(day, time, niveau, seance.biWeekly)) {
      return throwError(() => new Error(
        this.getAddSessionErrorMessage(day, time, niveau, seance.biWeekly)
      ));
    }

    // Get current schedule state
    const schedule = this.scheduleSubject.getValue();

    // Create nested structure if needed
    if (!schedule[day]) schedule[day] = {};
    if (!schedule[day][niveau]) schedule[day][niveau] = {};
    if (!schedule[day][niveau][time]) schedule[day][niveau][time] = [];

    // Add new session
    schedule[day][niveau][time].push(seance);

    // Broadcast schedule update
    this.scheduleSubject.next(schedule);

    return of(true);
  }

  /**
   * Generates appropriate error messages for session addition failures
   *
   * @param day - The day of the week
   * @param time - Time slot
   * @param niveau - Academic level
   * @param isBiweekly - Whether the new session is biweekly
   * @returns Error message string
   */
  private getAddSessionErrorMessage(
    day: string,
    time: string,
    niveau: string,
    isBiweekly: boolean
  ): string {
    const sessions = this.getSessionsForTimeSlot(day, time, niveau);

    // Case: Trying to add to a slot with weekly session
    if (sessions.some(s => !s.biWeekly)) {
      return 'Cannot add a session when a weekly session exists';
    }

    // Case: Trying to add weekly session to non-empty slot
    if (!isBiweekly) {
      return 'Cannot add a weekly session when other sessions exist';
    }

    // Case: Biweekly session limit reached
    return 'Maximum number of biweekly sessions reached';
  }

  /**
   * Retrieves sessions for a specific time slot
   *
   * @param day - The day of the week
   * @param time - Time slot
   * @param niveau - Academic level
   * @returns Array of sessions
   */
  getSessionsForTimeSlot(day: string, time: string, niveau: string): Seance[] {
    const schedule = this.scheduleSubject.getValue();
    return schedule[day]?.[niveau]?.[time] || [];
  }

  /**
   * Updates system date and time
   * Should be called periodically to maintain current time
   */
  private updateCurrentDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toISOString().replace('T', ' ').slice(0, 19);
  }

  /**
   * Retrieves current date and time
   * @returns Formatted date time string
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Retrieves current user
   * @returns Current user's login
   */
  getCurrentUser(): string {
    return this.currentUser;
  }

  /**
   * Updates the entire schedule
   * Used when loading initial data or performing bulk updates
   *
   * @param schedule - New schedule state
   */
  updateSchedule(schedule: Schedule): void {
    this.scheduleSubject.next(schedule);
  }

  /**
   * Cleans up empty schedule entries
   * Should be called after session removals
   *
   * @param schedule - Schedule to clean
   * @param day - Day to check
   * @param niveau - Niveau to check
   * @param time - Time slot to check
   */
  private cleanupSchedule(
    schedule: Schedule,
    day: string,
    niveau: string,
    time: string
  ): void {
    if (schedule[day]?.[niveau]?.[time]?.length === 0) {
      delete schedule[day][niveau][time];

      if (Object.keys(schedule[day][niveau]).length === 0) {
        delete schedule[day][niveau];

        if (Object.keys(schedule[day]).length === 0) {
          delete schedule[day];
        }
      }
    }
  }
}
