import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RattrapageSchedule } from './models/Schedule';
import { Seance } from './models/Seance';

@Injectable({
  providedIn: 'root'
})
export class RattrapageService {
  private rattrapageSchedule: RattrapageSchedule = {};
  private rattrapageScheduleSubject = new BehaviorSubject<RattrapageSchedule>(this.rattrapageSchedule);

  constructor() {}

  addRattrapageSeance(day: string, time: string, seance: Seance): void {
    if (!this.rattrapageSchedule[day]) {
      this.rattrapageSchedule[day] = {};
    }

    if (!this.rattrapageSchedule[day][time]) {
      this.rattrapageSchedule[day][time] = [];
    }

    this.rattrapageSchedule[day][time].push(seance);

    // Emit updated schedule to all subscribers
    this.rattrapageScheduleSubject.next(this.rattrapageSchedule);
  }

  getRattrapageSchedule(): Observable<RattrapageSchedule> {
    return this.rattrapageScheduleSubject.asObservable(); // Return an observable that updates automatically
  }
  // New method to update salle for a specific seance
  updateSeanceSalle(day: string, time: string, seanceId: number, salle: string): boolean {
    try {
      // Check if the day and time slot exist
      if (!this.rattrapageSchedule[day] || !this.rattrapageSchedule[day][time]) {
        console.error('Day or time slot not found in rattrapage schedule');
        return false;
      }

      // Find the seance with the matching ID
      const seanceIndex = this.rattrapageSchedule[day][time]
        .findIndex(seance => seance.id === seanceId);

      // If seance is found, update its salle
      if (seanceIndex !== -1) {
        this.rattrapageSchedule[day][time][seanceIndex] = {
          ...this.rattrapageSchedule[day][time][seanceIndex],
          room: salle
        };

        // Emit the updated schedule
        this.rattrapageScheduleSubject.next({...this.rattrapageSchedule});
        return true;
      } else {
        console.error('Seance not found with ID:', seanceId);
        return false;
      }
    } catch (error) {
      console.error('Error updating salle:', error);
      return false;
    }
  }

  // Helper method to get a specific seance
  getSeance(day: string, time: string, seanceId: number): Seance | null {
    try {
      if (this.rattrapageSchedule[day]?.[time]) {
        return this.rattrapageSchedule[day][time]
          .find(seance => seance.id === seanceId) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting seance:', error);
      return null;
    }
  }

}
