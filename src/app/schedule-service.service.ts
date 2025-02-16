
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Schedule} from './models/Schedule';
import {SalleSchedule} from './models/Salle';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleSource = new BehaviorSubject<SalleSchedule | null>(null);
  currentDisponibilite = this.scheduleSource.asObservable();
  constructor() { }

  changeSchedule(salleSchedule: SalleSchedule) {
    this.scheduleSource.next(salleSchedule);
  }
}
