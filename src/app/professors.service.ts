import { Injectable } from '@angular/core';
import {ProfList} from './models/Professors';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {SalleList} from './models/Salle';
import {delay, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {

  // Initialize with empty SalleList instead of null
  private profsSubject = new BehaviorSubject<ProfList>({});
  private loaded = false;
  profs: ProfList = {
    'Omar NASRI': {
      name: 'Omar NASRI',
      codeEnseignant: 'P001',
      heures: 2,
      schedule: {
        MARDI: {
          '8:30-10:00': {
            ING2_TIC: {
              name: 'Ch-Réseaux Informatiques Avancés',
              id: 20,
              groupe: 'ING2_TIC',
              room: 'B-12',
              type: 'COURS',
              professor: 'Omar NASRI',
              biWeekly: false
            }
          }
        }
      }
    },
    'Hana CHAIEB': {
      name: 'Hana CHAIEB',
      codeEnseignant: 'P002',
      heures: 2,
      schedule: {
        MARDI: {
          '10:15-11:45': {
            ING2_TIC: {
              name: 'Ch-Sécurité des Systèmes',
              id: 21,
              groupe: 'ING2_TIC',
              room: 'B-12',
              type: 'COURS',
              professor: 'Hana CHAIEB',
              biWeekly: false
            }
          }
        }
      }
    }
    // Add other professors here...
  };

  constructor() {}

  isProfAvailable(name: string, day: string, time: string): boolean {
    return !(this.profs[name]?.schedule?.[day]?.[time]);
  }

  getAvailableTimeSlots(name: string, days: string[], times: string[]): { day: string, time: string }[] {
    let availableSlots: { day: string, time: string }[] = [];

    for (let day of days) {
      for (let time of times) {
        if (this.isProfAvailable(name, day, time)) {
          availableSlots.push({ day, time });
        }
      }
    }
    return availableSlots;
  }

  getProfs(): Observable<ProfList> {
    if (!this.loaded) {
      // Simulate API call with delay
      return of(this.profs).pipe(
        delay(1000),
        tap(salles => {
          this.loaded = true;
          this.profsSubject.next(salles);
        })
      );
    }
    // No need to handle null case since we initialized with empty object
    return this.profsSubject.asObservable();
  }
}
