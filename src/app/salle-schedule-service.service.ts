
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Schedule} from './models/Schedule';
import {SalleSchedule} from './models/Salle';

@Injectable({
  providedIn: 'root'
})
export class SalleScheduleServiceService {
  private disponibiliteSource = new BehaviorSubject<SalleSchedule | null>(null);
  currentDisponibilite = this.disponibiliteSource.asObservable();

  constructor() { }

  changeDisponibilite(salleSchedule: SalleSchedule) {
    this.disponibiliteSource.next(salleSchedule);
  }
}
