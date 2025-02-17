import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import Observable and of from rxjs
import { RattrapageSchedule } from './models/Schedule';
import { Seance } from './models/Seance';

@Injectable({
  providedIn: 'root'
})
export class RattrapageService {
  private rattrapageSchedule: RattrapageSchedule = {};

  constructor() {}

  addRattrapageSeance(day: string, time: string, seance: Seance): void {
    if (!this.rattrapageSchedule[day]) {
      this.rattrapageSchedule[day] = {};
    }

    if (!this.rattrapageSchedule[day][time]) {
      this.rattrapageSchedule[day][time] = [];
    }

    this.rattrapageSchedule[day][time].push(seance);
  }

  getRattrapageSessions(day?: string, time?: string): Seance[] {
    if (day && time) {
      return this.rattrapageSchedule[day]?.[time] || [];
    } else if (day) {
      return Object.values(this.rattrapageSchedule[day] || {}).flat();
    } else {
      return Object.values(this.rattrapageSchedule).flatMap(daySchedule =>
        Object.values(daySchedule).flat()
      );
    }
  }

  getRattrapageSchedule(): Observable<RattrapageSchedule> {
    return of(this.rattrapageSchedule);  // Return the schedule as an observable
  }
}
