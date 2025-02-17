import { Injectable } from '@angular/core';
import {RattrapageSchedule} from './models/Schedule';
import {Seance} from './models/Seance';

@Injectable({
  providedIn: 'root'
})
export class RattrapageService {
  constructor() { }

  addRattrapageSeance(rattrapageSchedule: RattrapageSchedule,day: string, time: string, seance: Seance) {
    if (!rattrapageSchedule[day]) {
      rattrapageSchedule[day] = {};
    }

    if (!rattrapageSchedule[day][time]) {
      rattrapageSchedule[day][time] = [];
    }

    rattrapageSchedule[day][time].push(seance);
  }


}
