import {Component, Injector} from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {RattrapageSchedule, Schedule} from '../models/Schedule';
import {Seance} from '../models/Seance';
import {RattrapageService} from '../rattrapage.service';


@Component({
  selector: 'app-view-schedule',
  standalone: false,
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.css'
})
export class ViewScheduleComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  fullText = 'Schedule Manager';
  displayText = '';

  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  showTD = true;
  showTP = true;
  selectedWeek = 'all'; // all, even, or odd
  schedule: Schedule = {
    LUNDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
          id: 1,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Sara MTIW',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '10:15-11:45': [{
          name: 'TD-Algèbre certification 2',
          id: 2,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Soumaya BEN AICHA',
          biWeekly: false
        }],
        '13:00-14:30': [{
          name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques',
          id: 3,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MTIW',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'TD-HDIG-Preuve de programmes',
          id: 4,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Lassâad HAMEL',
          biWeekly: false
        }]
      }
    },
    MARDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Optimisation combinatoire',
          id: 5,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'COURS',
          professor: 'Abir BEN DHIHA',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '14:45-16:15': [{
          name: 'TD-Français - certification 2',
          id: 6,
          groupe: 'ING1_INFO_TD1',
          room: 'C-13',
          type: 'TD',
          professor: 'Hadda SMIDA',
          biWeekly: false
        }]
      }
    },
    MERCREDI: {
      ING1_INFO: {
        '14:45-16:15': [{
          name: 'Ch-Conception et analyse dalgorithmes',
          id: 7,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Abir GHNIMI',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '8:30-10:00': [{
          name: 'TD-Optimisation combinatoire',
          id: 8,
          groupe: 'ING1_INFO_TD1',
          room: 'A-13',
          type: 'TD',
          professor: 'Abir BEN DHIHA',
          biWeekly: false
        }],
        '10:15-11:45': [{
          name: 'TD-Conception et analyse dalgorithmes',
          id: 9,
          groupe: 'ING1_INFO_TD1',
          room: 'A-34',
          type: 'TD',
          professor: 'Mariem GUIS',
          biWeekly: false
        }]
      }
    },
    JEUDI: {
      ING1_INFO: {
        '13:00-14:30': [{
          name: 'Ch-Intelligence Artificielle',
          id: 10,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Abir GHNIMI',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'Ch-Types de données et preuve de programmes',
          id: 11,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Ali KANOUN',
          biWeekly: false
        }],
        '16:30-18:00': [{
          name: 'CB-Preuve de programmes',
          id: 12,
          groupe: 'ING1_INFO',
          room: 'A-32',
          type: 'COURS',
          professor: 'Ali KANOUN'
        }]
      },
      ING1_INFO_TD1: {
        '10:15-11:45': [{
          name: 'TP-Techniques dapprentissage automatique',
          id: 13,
          groupe: 'ING1_INFO_TD1',
          room: 'A-13',
          type: 'TP',
          professor: 'Mariem GARA',
          biWeekly: false
        }]
      }
    },
    VENDREDI: {
      'ING1_INFO_TD1 || ING1_INFO_TD2': {
        '10:15-11:45': [{
          name: 'TD-Techniques de communication',
          id: 14,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }, {
          name: 'TD-Techniques de communication',
          id: 15,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }],
        '14:45-16:15': [{
          name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle',
          id: 16,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TP',
          professor: 'Manel MEJ',
          biWeekly: true
        }],
        '16:30-18:00': [{
          name: 'TP-3H00-3.15-frama-C et la preuve de programmes',
          id: 17,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TP',
          professor: 'Sara MEJ',
          biWeekly: true
        }]
      }
    },
    SAMEDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Processus stochastique',
          id: 18,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'COURS',
          professor: 'Sara MTIW'
        }]
      },
      ING1_INFO_TD1: {
        '14:45-16:15': [{
          name: 'TD-3H00-3.15-Processus stochastique',
          id: 19,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MEJ'
        }],
        '8:30-10:00': [{
          name: 'Ch-Processus stochastique',
          id: 20,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'TP',
          professor: 'Sara MTIW'
        }]
      }
    }
  };
  private rattrapageSchedule: RattrapageSchedule={};

  constructor(private router: Router,private rattrapageService: RattrapageService,private injector: Injector) {

  }
  private animateText() {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayText = this.fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
  ngOnInit(): void {
// Lazy injection of the service
    this.rattrapageService = this.injector.get(RattrapageService);
    // Subscribe to get the latest schedule data
    this.rattrapageService.getRattrapageSchedule().subscribe((schedule: RattrapageSchedule) => {
      this.rattrapageSchedule = schedule;
      console.log(this.rattrapageSchedule); // Just to confirm it's working
    });
    this.animateText();
  }
  private _filter(value: string | null, options: string[]): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getActivityColor(biweekly: boolean | undefined): string {
    switch (biweekly) {
      case true:
        return "#B0B8C7";
      case false:
        return 'transparent';
      default:
        return 'transparent';
    }}
  getTypeColor(type: string | undefined): string {
    switch (type) {
      case 'TD' :
        return "#5603ad";
      case 'TP':
        return '#2a9d8f';
      case 'COURS':
        return '#ee4266'
      default:
        return 'transparent';
    }}


//     return 'rgba(131, 197, 190, 0.8)';
  //   case 'TP':
  //     return '#489fb5';
  //   default:
  //     return 'transparent';
  // }

  navigateToSchedule() {
    this.router.navigate(['schedule']);
  }

   selectedGroup: string = '';
  displayedGroup: string[] = [];
  getDisplayedGroup(): string[] {
    this.displayedGroup = [];
    if (this.selectedGroup === 'ING1_INFO_TD1 || ING1_INFO_TD2') {
      this.displayedGroup.push('ING1_INFO_TD1 || ING1_INFO_TD2');
    } else if (this.selectedGroup === 'ING1_INFO_TD1') {
      this.displayedGroup.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');
    } else if (this.selectedGroup === 'ING1_INFO_TD2') {
      this.displayedGroup.push('ING1_INFO_TD2', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');
    }
    if(this.selectedGroup === 'ING1_INFO') {this.displayedGroup.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');}
    return this.displayedGroup;
  }

  filteredSchedule: Seance[] = [];
  groupOptions: string[] = ['ING1_INFO','ING1_INFO_TD1', 'ING1_INFO_TD2','ING1_INFO_TD1 || ING1_INFO_TD2'];

  getFilteredSchedule(): { [day: string]: { [time: string]: Seance[] | null } } {
    const filteredSchedule: { [day: string]: { [time: string]: Seance[] | null } } = {};

    this.days.forEach(day => {
      filteredSchedule[day] = {};
      Object.keys(this.schedule[day] || {}).forEach(group => {
        if (this.getDisplayedGroup().includes(group)) {
          Object.keys(this.schedule[day]?.[group] || {}).forEach(time => {
            const seances = this.schedule[day]?.[group]?.[time];
            if (seances) {
              if (!filteredSchedule[day][time]) {
                filteredSchedule[day][time] = [];
              }
              seances.forEach(seance => {
                if (
                  seance && (
                    (this.showTD && seance.type === 'TD') ||
                    (this.showTP && seance.type === 'TP') ||
                    seance.type === 'COURS'
                  )
                ) {
                  filteredSchedule[day][time]!.push(seance);
                }
              });
            }
          });
        }
      });

      // Add rattrapage seances with more robust checks
      if (this.rattrapageSchedule?.[day]) {
        Object.keys(this.rattrapageSchedule[day]).forEach(time => {
          if (!filteredSchedule[day][time]) {
            filteredSchedule[day][time] = [];
          }

          // Only add rattrapage seances if they're valid
          const rattrapageSeances = this.rattrapageSchedule[day]?.[time];
          if (Array.isArray(rattrapageSeances) && rattrapageSeances.length > 0) {
            rattrapageSeances.forEach(seance => {
              filteredSchedule[day][time]!.push({
                ...seance,
                //isRattrapage: true
              });
            });
          }
        });
      }
    });

    return filteredSchedule;
  }
  getSession(day: string, time: string): Seance[] {
    const sessions: Seance[] = [];

    if (this.schedule[day]) {
      Object.keys(this.schedule[day]).forEach(group => {
        if (this.getDisplayedGroup().includes(group)) {
          const seances = this.schedule[day][group][time];
          if (seances) {
            seances.forEach(seance => {
              if (
                (this.showTD && seance.type === 'TD') ||
                (this.showTP && seance.type === 'TP') ||
                seance.type === 'COURS'
              ) {
                sessions.push(seance);
              }
            });
          }
        }
      });
    }

    return sessions;
  }

}
