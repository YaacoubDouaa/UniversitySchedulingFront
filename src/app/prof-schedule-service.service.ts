import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProfSchedule} from './models/Professors';

@Injectable({
  providedIn: 'root'
})
export class ProfScheduleService {



  private profScheduleSource = new BehaviorSubject<ProfSchedule | null>(null);
  currentDisponibilite = this.profScheduleSource.asObservable();

  constructor() { }

  changeProfSchedule(profSchedule: ProfSchedule) {
    this.profScheduleSource.next(profSchedule);
  }
}
