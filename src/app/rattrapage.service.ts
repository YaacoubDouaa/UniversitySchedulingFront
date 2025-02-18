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
}
