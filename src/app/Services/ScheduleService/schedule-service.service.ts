import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Schedule } from '../../models/Schedule';
import { Seance } from '../../models/Seance';
import {demoSchedule} from '../../initialData/initialData';
import {HttpClient} from '@angular/common/http';

class SaveRequest {
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  /**
   * BehaviorSubject to manage and broadcast schedule state changes
   * Initialized with an empty schedule object
   */
  private scheduleSubject = new BehaviorSubject<Schedule>(demoSchedule);

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
  currentDisponibilite: Observable<Schedule>=new Observable();
  private apiUrl: string='';

  constructor(private http: HttpClient) {}
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
  addSession(day: string,  niveau: string, time: string, seance: Seance): Observable<boolean> {
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
    console.log(schedule[day][niveau][time]);
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

  /**
   * Update an existing session
   * @param day Day of the week
   * @param time Time slot
   * @param group Student group
   * @param updatedSeance Updated session details
   */
  updateSession(day: string, time: string, group: string, updatedSeance: Seance): Observable<boolean> {
    try {
      const schedule = this.scheduleSubject.getValue();

      if (!schedule[day]?.[group]?.[time]) {
        return throwError(() => new Error('Session not found'));
      }

      const sessions = schedule[day][group][time];
      const index = sessions.findIndex(s => s.id === updatedSeance.id);

      if (index === -1) {
        return throwError(() => new Error('Session not found'));
      }

      // Update session
      sessions[index] = updatedSeance;
      this.scheduleSubject.next({ ...schedule });

      return of(true);
    } catch (error) {
      return throwError(() => new Error('Failed to update session'));
    }
  }

  /**
   * Delete a session from the schedule
   * @param day Day of the week
   * @param time Time slot
   * @param group Student group
   * @param seanceId Session ID to delete
   */
  deleteSession(day: string, time: string, group: string, seanceId: number): Observable<boolean> {
    try {
      const schedule = this.scheduleSubject.getValue();

      if (!schedule[day]?.[group]?.[time]) {
        return throwError(() => new Error('Session not found'));
      }

      const sessions = schedule[day][group][time];
      const index = sessions.findIndex(s => s.id === seanceId);

      if (index === -1) {
        return throwError(() => new Error('Session not found'));
      }

      // Remove session
      sessions.splice(index, 1);

      // Clean up empty structures
      this.cleanupSchedule(schedule, day, group, time);

      this.scheduleSubject.next({ ...schedule });

      return of(true);
    } catch (error) {
      return throwError(() => new Error('Failed to delete session'));
    }
  }

  /**
   * Get room schedule
   */
  getRoomSchedule(room: string): Observable<Schedule> {
    // This should be replaced with actual API call
    return this.currentDisponibilite;
  }



  /**
   * Gets a snapshot of the current schedule
   * @returns Schedule The current schedule value
   */
  getScheduleSnapshot(): Schedule {
    return this.scheduleSubject.getValue();
  }

  /**
   * Gets schedule for a specific day
   * @param day The day to get schedule for
   * @returns Observable<{[niveau: string]: {[time: string]: Seance[]}}>
   */
  getDaySchedule(day: string): Observable<{[niveau: string]: {[time: string]: Seance[]}}> {
    return new Observable(observer => {
      try {
        const schedule = this.scheduleSubject.getValue();
        observer.next(schedule[day] || {});
        observer.complete();
      } catch (error) {
        observer.error('Failed to get day schedule');
      }
    });
  }

  /**
   * Gets the current schedule state as an Observable
   * Returns an Observable that emits the current schedule and continues to emit on changes
   *
   * @returns Observable<Schedule> Stream of schedule updates
   */
  getSchedule(): Observable<Schedule> {
    try {
      // Return the BehaviorSubject as an Observable
      return this.scheduleSubject.asObservable();
    } catch (error) {
      console.error('Error getting schedule:', error);
      // Return error as Observable
      return throwError(() => new Error('Failed to retrieve schedule'));
    }
  }

  /**
   * Changes the current schedule and updates all subscribers
   * @param salleSchedule The new schedule to set
   */
  changeSchedule(salleSchedule: Schedule): void {
    try {
      // Update the schedule subject with the new schedule
      this.scheduleSubject.next({ ...salleSchedule });

      // Update current disponibilite
      this.currentDisponibilite = of(salleSchedule);

      // Log success
      console.log('Schedule updated successfully:', {
        timestamp: this.getCurrentDateTime(),
        user: this.getCurrentUser()
      });
    } catch (error) {
      // Log error
      console.error('Error changing schedule:', error);
      throw new Error('Failed to change schedule');
    }
  }
  saveSeances(request: SaveRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/seances`, request);
  }

  /**
   * Current salle (room) name
   * Stores the name of the currently selected room
   */
  private salleName: string = 'A101'; // Default room name

  /**
   * Change the current salle name
   * Updates the salle name and triggers any necessary refresh
   *
   * @param name - New salle name to set
   */
  changeSalleName(name: string): void {
    this.salleName = name;
    console.log(`Salle name changed to: ${name}`);

    // Optional: Notify subscribers about the room change
    // You could emit an event or update any related data

    // Example: Update timestamp when room is changed
    this.updateCurrentDateTime();
  }

  /**
   * Gets the current salle name
   * @returns string The name of the currently selected salle
   */
  getCurrentSalleName(): string {
    return this.salleName;
  }
}
