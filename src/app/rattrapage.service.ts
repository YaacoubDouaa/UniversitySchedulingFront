import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RattrapageSchedule } from './models/Schedule';
import { Seance } from './models/Seance';

@Injectable({
  providedIn: 'root'
})
export class RattrapageService {
  private rattrapageSchedule: RattrapageSchedule = {
    'Lundi': {
      '08:30-10:00': [
        {
          id: 1, name: 'Maths', room: '101', professor: 'Dr. Smith', groupe: 'Group A',
          type: ''
        },
        {
          id: 2, name: 'Physics', room: '102', professor: 'Prof. Johnson', groupe: 'Group B',
          type: ''
        },
      ],
      '10:15-11:45': [
        {
          id: 3, name: 'Chemistry', room: '103', professor: 'Dr. Williams', groupe: 'Group C',
          type: ''
        },
      ],
    },
    'Mardi': {
      '12:00-13:30': [
        {
          id: 4, name: 'Biology', room: '104', professor: 'Prof. Davis', groupe: 'Group D',
          type: ''
        },
      ],
      '13:45-15:15': [
        {
          id: 5, name: 'Computer Science', room: '105', professor: 'Dr. Brown', groupe: 'Group E',
          type: ''
        },
      ],
    }
  };
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
