

// interface Seance {
//   name: string;
//   room: string;
//   type: 'COURS' | 'TD' | 'TP';
//   professor: string;
//   code: string;
//   biweekly: boolean;
// }
//
// interface Schedule {
//   [day: string]: {
//     [time: string]: Seance[] | null;
//   };
// }
//
// @Component({
//   selector: 'app-schedule',
//   standalone: false,
//   templateUrl: './schedule.component.html',
//   styleUrls: ['./schedule.component.css']
// })
// export class ScheduleComponent {
//   days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
//   timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
//   showModal = false;

//   schedule: Schedule = {
//     LUNDI: {
//       '8:30-10:00': [{ name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Sara MTIW', biweekly: false }],
//       '10:15-11:45': [{ name: 'TD-Algèbre certification 2', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Soumaya BEN AICHA', biweekly: false }],
//       '13:00-14:30': [{ name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Sara MTIW', biweekly: false }],
//       '14:45-16:15': [{ name: 'TD-HDIG-Preuve de programmes', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Lassâad HAMEL', biweekly: false }],
//       '16:30-18:00': null
//     },
//     MARDI: {
//       '8:30-10:00': [{ name: 'Ch-Optimisation combinatoire', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Abir BEN DHIHA', biweekly: false }],
//       '10:15-11:45': null,
//       '13:00-14:30': null,
//       '14:45-16:15': [{ name: 'TD-Français - certification 2', code: 'ING1_INFO_TD1', room: 'C-13', type: 'TD', professor: 'Hadda SMIDA', biweekly: false }],
//       '16:30-18:00': null
//     },
//     MERCREDI: {
//       '8:30-10:00': [{ name: 'TD-Optimisation combinatoire', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TD', professor: 'Abir BEN DHIHA', biweekly: false }],
//       '10:15-11:45': [{ name: 'TD-Conception et analyse dalgorithmes', code: 'ING1_INFO_TD1', room: 'A-34', type: 'TD', professor: 'Mariem GUIS', biweekly: false }],
//       '13:00-14:30': null,
//       '14:45-16:15': [{ name: 'Ch-Conception et analyse dalgorithmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI', biweekly: false }],
//       '16:30-18:00': null
//     },
//     JEUDI: {
//       '8:30-10:00': null,
//       '10:15-11:45': [{ name: 'TP-Techniques dapprentissage automatique', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TP', professor: 'Mariem GARA', biweekly: false }],
//       '13:00-14:30': [{ name: 'Ch-Intelligence Artificielle', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI', biweekly: false }],
//       '14:45-16:15': [{ name: 'Ch-Types de données et preuve de programmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Ali KANOUN', biweekly: false }],
//       '16:30-18:00': [{ name: 'CB-Preuve de programmes', code: 'ING1_INFO', room: 'A-32', type: 'COURS', professor: 'Ali KANOUN', biweekly: false }]
//     },
//     VENDREDI: {
//       '8:30-10:00': null,
//       '10:15-11:45': [{ name: 'TD-Techniques de communication', code: 'ING1_INFO_TD1', room: 'C-15', type: 'TD', professor: 'Abir BERIDA', biweekly: true }],
//       '13:00-14:30': null,
//       '14:45-16:15': [{ name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Manel MEJ', biweekly: true }],
//       '16:30-18:00': [{ name: 'TP-3H00-3.15-frama-C et la preuve de programmes', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Sara MEJ', biweekly: true }]
//     },
//     SAMEDI: {
//       '8:30-10:00': [{ name: 'Ch-Processus stochastique', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Sara MTIW', biweekly: false }],
//       '10:15-11:45': null,
//       '13:00-14:30': null,
//       '14:45-16:15': [{ name: 'TD-3H00-3.15-Processus stochastique', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TD', professor: 'Sara MEJ', biweekly: false }],
//       '16:30-18:00': null
//     }
//   };



import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';


interface Seance {
  name: string;
  id: number;
  room: string;
  type: 'COURS' | 'TD' | 'TP'|string;
  professor: string;
  code: string;
  biWeekly?: boolean;
}

interface Schedule {
  [day: string]: {
    [niveau: string]: {
      [time: string]: Seance[] ;
    };
  };
}


@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent  {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  showModal = true;
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;

  } | null = null;

  schedule: Schedule = {
    LUNDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
          id: 1,
          code: 'ING1_INFO',
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
          code: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Soumaya BEN AICHA',
          biWeekly: false
        }],
        '13:00-14:30': [{
          name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques',
          id: 3,
          code: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MTIW',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'TD-HDIG-Preuve de programmes',
          id: 4,
          code: 'ING1_INFO_TD1',
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
          code: 'ING1_INFO',
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
          code: 'ING1_INFO_TD1',
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
          code: 'ING1_INFO',
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
          code: 'ING1_INFO_TD1',
          room: 'A-13',
          type: 'TD',
          professor: 'Abir BEN DHIHA',
          biWeekly: false
        }],
        '10:15-11:45': [{
          name: 'TD-Conception et analyse dalgorithmes',
          id: 9,
          code: 'ING1_INFO_TD1',
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
          code: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Abir GHNIMI',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'Ch-Types de données et preuve de programmes',
          id: 11,
          code: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Ali KANOUN',
          biWeekly: false
        }],
        '16:30-18:00': [{
          name: 'CB-Preuve de programmes',
          id: 12,
          code: 'ING1_INFO',
          room: 'A-32',
          type: 'COURS',
          professor: 'Ali KANOUN'
        }]
      },
      ING1_INFO_TD1: {
        '10:15-11:45': [{
          name: 'TP-Techniques dapprentissage automatique',
          id: 13,
          code: 'ING1_INFO_TD1',
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
          code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }, {
          name: 'TD-Techniques de communication',
          id: 15,
          code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }],
        '14:45-16:15': [{
          name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle',
          id: 16,
          code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TP',
          professor: 'Manel MEJ',
          biWeekly: true
        }],
        '16:30-18:00': [{
          name: 'TP-3H00-3.15-frama-C et la preuve de programmes',
          id: 17,
          code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
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
          code: 'ING1_INFO',
          room: 'C-61',
          type: 'COURS',
          professor: 'Sara MTIW'
        }]
      },
      ING1_INFO_TD1: {
        '14:45-16:15': [{
          name: 'TD-3H00-3.15-Processus stochastique',
          id: 19,
          code: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MEJ'
        }],
        '8:30-10:00': [{
          name: 'Ch-Processus stochastique',
          id: 20,
          code: 'ING1_INFO',
          room: 'C-61',
          type: 'TP',
          professor: 'Sara MTIW'
        }]
      }
    }
  };


  // FormControl for autocomplete
  nameControl = new FormControl('');
  roomControl = new FormControl('');
  typeControl = new FormControl('');
  professorControl = new FormControl('');

  filteredNames: Observable<string[]>;
  filteredRooms: Observable<string[]>;
  filteredTypes: Observable<string[]>;

  // Dummy options for autocomplete
  nameOptions: string[] = ['Math Class', 'History Class', 'Physics Class', 'Chemistry Class'];
  roomOptions: string[] = ['A-101', 'A-102', 'A-201', 'B-101'];
  typeOptions: string[] = ['COURS', 'TD', 'TP'];

  constructor(private router: Router) {
    // Setup filtering for the autocomplete inputs
    this.filteredNames = this.nameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.nameOptions))
    );
    this.filteredRooms = this.roomControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.roomOptions))
    );
    this.filteredTypes = this.typeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.typeOptions))
    );
  }

  private _filter(value: string | null, options: string[]): string[] {
    const filterValue = value ? value.toLowerCase() : ''; // Handle null or undefined values
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }




  openEditModal(seance: Seance | null, day: string, time: string) {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '',id:0, room: '', type: 'COURS', professor: '', code: '',biWeekly: false, },
      day,
      time
    };
    this.showModal = true;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevent closing when clicking inside the modal
    }
    this.selectedActivity = null;
  }

  saveChanges() {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      const group = Object.keys(this.schedule[day]).find(grp => this.schedule[day][grp][time]);
      if (group) {
        const seanceIndex = this.schedule[day][group][time].findIndex(s => s.id === seance.id);
        if (seanceIndex !== -1) {
          // Update the existing seance with the new one
          this.schedule[day][group][time][seanceIndex] = seance;
        } else {
          // If the seance does not exist, add it to the list
          this.schedule[day][group][time].push(seance);
        }
      }
    }
    this.closeModal();
  }

  navigateToView() {
    this.router.navigate(['/view']);
  }
  getActivityColor(biweekly: boolean | undefined): string {
    switch (biweekly) {
      case true:
        return "rgba(224, 251, 252, 0.8)";
      case false:
        return 'transparent';
      default:
        return 'transparent';
    }}
  getTypeColor(type: string | undefined): string {
    switch (type) {
      case 'TD' :
        return "#7209b7";
      case 'TP':
        return '#2b9348';
      case 'COURS':
        return '#FF331F'
      default:
        return 'transparent';
    }}

  protected readonly Object = Object;
}






//     return 'rgba(131, 197, 190, 0.8)';
  //   case 'TP':
  //     return '#489fb5';
  //   default:
  //     return 'transparent';
  // }




