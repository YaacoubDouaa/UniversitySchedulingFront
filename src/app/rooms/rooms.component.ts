import { Component } from '@angular/core';
import {Router} from '@angular/router';

import {Schedule} from '../models/Schedule';
import {SalleScheduleServiceService} from '../salle-schedule-service.service';
import {SalleList, SalleSchedule} from '../models/Salle';



@Component({
  selector: 'app-rooms',
  standalone: false,

  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  types=['COURS','TD'];
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  salles: SalleList = {
    'A-8': {
      name: 'A-8',
      type: 'COURS',
      capacite: 50,
      schedule: {
        LUNDI: {
          '8:30-10:00': {
            ING1_INFO: {
              name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
              id: 1,
              code: 'ING1_INFO',
              room: 'A-8',
              type: 'COURS',
              professor: 'Sara MTIW',
              biWeekly: false
            }
          }
        },
        MERCREDI: {
          '14:45-16:15': {
            ING1_INFO: {
              name: 'Ch-Conception et analyse dalgorithmes',
              id: 7,
              code: 'ING1_INFO',
              room: 'A-8',
              type: 'COURS',
              professor: 'Abir GHNIMI',
              biWeekly: false
            }
          }
        },
        JEUDI: {
          '13:00-14:30': {
            ING1_INFO: {
              name: 'Ch-Intelligence Artificielle',
              id: 10,
              code: 'ING1_INFO',
              room: 'A-8',
              type: 'COURS',
              professor: 'Abir GHNIMI',
              biWeekly: false
            }
          },
          '14:45-16:15': {
            ING1_INFO: {
              name: 'Ch-Types de données et preuve de programmes',
              id: 11,
              code: 'ING1_INFO',
              room: 'A-8',
              type: 'COURS',
              professor: 'Ali KANOUN',
              biWeekly: false
            }
          }
        }
      }
    },
    'A-32': {
      name: 'A-32',
      type: 'COURS',
      capacite: 40,
      schedule: {
        LUNDI: {
          '10:15-11:45': {
            ING1_INFO_TD1: {
              name: 'TD-Algèbre certification 2',
              id: 2,
              code: 'ING1_INFO_TD1',
              room: 'A-32',
              type: 'TD',
              professor: 'Soumaya BEN AICHA',
              biWeekly: false
            }
          },
          '13:00-14:30': {
            ING1_INFO_TD1: {
              name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques',
              id: 3,
              code: 'ING1_INFO_TD1',
              room: 'A-32',
              type: 'TD',
              professor: 'Sara MTIW',
              biWeekly: false
            }
          },
          '14:45-16:15': {
            ING1_INFO_TD1: {
              name: 'TD-HDIG-Preuve de programmes',
              id: 4,
              code: 'ING1_INFO_TD1',
              room: 'A-32',
              type: 'TD',
              professor: 'Lassâd HAMEL',
              biWeekly: false
            }
          }
        },
        JEUDI: {
          '16:30-18:00': {
            ING1_INFO: {
              name: 'CB-Preuve de programmes',
              id: 12,
              code: 'ING1_INFO',
              room: 'A-32',
              type: 'COURS',
              professor: 'Ali KANOUN'
            }
          }
        },
        VENDREDI: {
          '14:45-16:15': {
            'ING1_INFO_TD1 || ING1_INFO_TD2': {
              name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle',
              id: 16,
              code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
              room: 'A-32',
              type: 'TP',
              professor: 'Manel MEJ',
              biWeekly: true
            }
          },
          '16:30-18:00': {
            'ING1_INFO_TD1 || ING1_INFO_TD2': {
              name: 'TP-3H00-3.15-frama-C et la preuve de programmes',
              id: 17,
              code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
              room: 'A-32',
              type: 'TP',
              professor: 'Sara MEJ',
              biWeekly: true
            }
          }
        },
        SAMEDI: {
          '14:45-16:15': {
            ING1_INFO_TD1: {
              name: 'TD-3H00-3.15-Processus stochastique',
              id: 19,
              code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
              room: 'A-32',
              type: 'TD',
              professor: 'Sara MEJ'
            }
          }
        }
      }
    },
    'A-13': {
      name: 'A-13',
      type: 'TD',
      capacite: 30,
      schedule: {
        MERCREDI: {
          '8:30-10:00': {
            ING1_INFO_TD1: {
              name: 'TD-Optimisation combinatoire',
              id: 8,
              code: 'ING1_INFO_TD1',
              room: 'A-13',
              type: 'TD',
              professor: 'Abir BEN DHIHA',
              biWeekly: false
            }
          }
        },
        JEUDI: {
          '10:15-11:45': {
            ING1_INFO_TD1: {
              name: 'TP-Techniques dapprentissage automatique',
              id: 13,
              code: 'ING1_INFO_TD1',
              room: 'A-13',
              type: 'TP',
              professor: 'Mariem GARA',
              biWeekly: false
            }
          }
        }
      }
    }
  };

  constructor(private router: Router, private salleScheduleService: SalleScheduleServiceService) {}

  onSelectSalle(disponibilite: SalleSchedule) {
    this.salleScheduleService.changeDisponibilite(disponibilite);
    this.router.navigate(['/room-schedule']);
  }

  isSalleAvailable(salle: string, day: string, time: string): boolean {
    const disponibilite = this.salles[salle].schedule;

    return !(disponibilite[day] && disponibilite[day][time] );}


  getSalleColor(salle: string, day: string, time: string,type:string): string {
    return this.isSalleAvailable(salle, day, time) ? '#d4edda' : '#f8d7da';
  }
  shouldDisplaySalle(salle: any): boolean {
    // ✅ Show all rooms when "All" is selected or no type is selected
    if (!this.selectedType || this.selectedType === '') {
      return true;  // Show all rooms
    }
    // 🔍 Otherwise, filter by the selected type
    return salle.type === this.selectedType;
  }

  protected readonly Object = Object;
}
