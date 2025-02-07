// import { Component } from '@angular/core';
//
// interface Seance {
//   name: string;
//   room: string;
//   type: 'COURS' | 'TD' | 'TP';
//   professor: string;
//   code: string;
// }
//
//
// interface Schedule {
//   [day: string]: {
//     [time: string]: Seance | null;
//   };
// }
// @Component({
//   selector: 'app-schedule',
//   standalone: false,
//   templateUrl: './schedule.component.html',
//   styleUrl: './schedule.component.css'
// })
// export class ScheduleComponent {
//   days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
//   timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
//   showModal = false;
//   selectedActivity: {
//     seance: Seance | null;
//     day: string;
//     time: string;
//   } | null = null;
//
//
//
//
//
// schedule: Schedule = {
//   LUNDI: {
//     '8:30-10:00': { name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Sara MTIW' },
//     '10:15-11:45': { name: 'TD-Algèbre certification 2', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Soumaya BEN AICHA' },
//     '13:00-14:30': { name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Sara MTIW' },
//     '14:45-16:15': { name: 'TD-HDIG-Preuve de programmes', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Lassâad HAMEL' },
//     '16:30-18:00': null
//   },
//   MARDI: {
//     '8:30-10:00': { name: 'Ch-Optimisation combinatoire', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Abir BEN DHIHA' },
//     '10:15-11:45': null,
//     '13:00-14:30': null,
//     '14:45-16:15': { name: 'TD-Français - certification 2', code: 'ING1_INFO_TD1', room: 'C-13', type: 'TD', professor: 'Hadda SMIDA' },
//     '16:30-18:00': null
//   },
//   MERCREDI: {
//     '8:30-10:00': { name: 'TD-Optimisation combinatoire', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TD', professor: 'Abir BEN DHIHA' },
//     '10:15-11:45': { name: 'TD-Conception et analyse dalgorithmes', code: 'ING1_INFO_TD1', room: 'A-34', type: 'TD', professor: 'Mariem GUIS' },
//     '13:00-14:30': null,
//     '14:45-16:15': { name: 'Ch-Conception et analyse dalgorithmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI' },
//     '16:30-18:00': null
//   },
//   JEUDI: {
//     '8:30-10:00': null,
//     '10:15-11:45': { name: 'TP-Techniques dapprentissage automatique', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TP', professor: 'Mariem GARA' },
//     '13:00-14:30': { name: 'Ch-Intelligence Artificielle', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI' },
//     '14:45-16:15': { name: 'Ch-Types de données et preuve de programmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Ali KANOUN' },
//     '16:30-18:00': { name: 'CB-Preuve de programmes', code: 'ING1_INFO', room: 'A-32', type: 'COURS', professor: 'Ali KANOUN' }
//   },
//   VENDREDI: {
//     '8:30-10:00': null,
//     '10:15-11:45': { name: 'TD-Techniques de communication', code: 'ING1_INFO_TD1', room: 'C-15', type: 'TD', professor: 'Abir BERIDA' },
//     '13:00-14:30': null,
//     '14:45-16:15': { name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Manel MEJ' },
//     '16:30-18:00': { name: 'TP-3H00-3.15-frama-C et la preuve de programmes', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Sara MEJ' }
//   },
//   SAMEDI: {
//     '8:30-10:00': { name: 'Ch-Processus stochastique', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Sara MTIW' },
//     '10:15-11:45': null,
//     '13:00-14:30': null,
//     '14:45-16:15': { name: 'TD-3H00-3.15-Processus stochastique', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TD', professor: 'Sara MEJ' },
//     '16:30-18:00': null
//   }
// };
//
//
// getActivityColor(type: string | undefined): string {
//     switch (type) {
//       case 'COURS':
//         return '#9BDDF0';
//       case 'TD':
//         return '#9ACFF6';
//       case 'TP':
//         return '#C8E6C9';
//       default:
//         return 'transparent';
//     }
//   }
//
//   openEditModal(seance: Seance | null, day: string, time: string) {
//     this.selectedActivity = {
//       seance: seance ? { ...seance } : { name: '', room: '', type: 'COURS', professor: '', code: '' },
//       day,
//       time
//     };
//     this.showModal = true;
//   }
//
//   closeModal(event?: Event): void {
//     if (event) {
//       event.stopPropagation(); // Prevent closing when clicking inside the modal
//     }
//     this.selectedActivity = null;
//   }
//
//   // saveActivity() {
//   //   if (this.selectedActivity) {
//   //     const { day, time, activity } = this.selectedActivity;
//   //     const scheduleItem = this.schedule.find(item => item.time === time);
//   //     if (scheduleItem) {
//   //       scheduleItem.activities[day.toLowerCase()] = activity;
//   //     }
//   //   }
//   //   this.closeModal();
//   // }
//
//   // deleteActivity() {
//   //   if (this.selectedActivity) {
//   //     const { day, time } = this.selectedActivity;
//   //     const scheduleItem = this.schedule.find(item => item.time === time);
//   //     if (scheduleItem) {
//   //       scheduleItem.activities[day.toLowerCase()] = null;
//   //     }
//   //   }
//   //   this.closeModal();
//   // }
//
//   saveChanges() {
//
//   }
// }
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

interface Seance {
  name: string;
  room: string;
  type: 'COURS' | 'TD' | 'TP';
  professor: string;
  code: string;
}

interface Schedule {
  [day: string]: {
    [time: string]: Seance | null;
  };
}

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  showModal = false;
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;

  schedule: Schedule = {
  LUNDI: {
    '8:30-10:00': { name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Sara MTIW' },
    '10:15-11:45': { name: 'TD-Algèbre certification 2', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Soumaya BEN AICHA' },
    '13:00-14:30': { name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Sara MTIW' },
    '14:45-16:15': { name: 'TD-HDIG-Preuve de programmes', code: 'ING1_INFO_TD1', room: 'A-32', type: 'TD', professor: 'Lassâad HAMEL' },
    '16:30-18:00': null
  },
  MARDI: {
    '8:30-10:00': { name: 'Ch-Optimisation combinatoire', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Abir BEN DHIHA' },
    '10:15-11:45': null,
    '13:00-14:30': null,
    '14:45-16:15': { name: 'TD-Français - certification 2', code: 'ING1_INFO_TD1', room: 'C-13', type: 'TD', professor: 'Hadda SMIDA' },
    '16:30-18:00': null
  },
  MERCREDI: {
    '8:30-10:00': { name: 'TD-Optimisation combinatoire', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TD', professor: 'Abir BEN DHIHA' },
    '10:15-11:45': { name: 'TD-Conception et analyse dalgorithmes', code: 'ING1_INFO_TD1', room: 'A-34', type: 'TD', professor: 'Mariem GUIS' },
    '13:00-14:30': null,
    '14:45-16:15': { name: 'Ch-Conception et analyse dalgorithmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI' },
    '16:30-18:00': null
  },
  JEUDI: {
    '8:30-10:00': null,
    '10:15-11:45': { name: 'TP-Techniques dapprentissage automatique', code: 'ING1_INFO_TD1', room: 'A-13', type: 'TP', professor: 'Mariem GARA' },
    '13:00-14:30': { name: 'Ch-Intelligence Artificielle', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Abir GHNIMI' },
    '14:45-16:15': { name: 'Ch-Types de données et preuve de programmes', code: 'ING1_INFO', room: 'A-8', type: 'COURS', professor: 'Ali KANOUN' },
    '16:30-18:00': { name: 'CB-Preuve de programmes', code: 'ING1_INFO', room: 'A-32', type: 'COURS', professor: 'Ali KANOUN' }
  },
  VENDREDI: {
    '8:30-10:00': null,
    '10:15-11:45': { name: 'TD-Techniques de communication', code: 'ING1_INFO_TD1', room: 'C-15', type: 'TD', professor: 'Abir BERIDA' },
    '13:00-14:30': null,
    '14:45-16:15': { name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Manel MEJ' },
    '16:30-18:00': { name: 'TP-3H00-3.15-frama-C et la preuve de programmes', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TP', professor: 'Sara MEJ' }
  },
  SAMEDI: {
    '8:30-10:00': { name: 'Ch-Processus stochastique', code: 'ING1_INFO', room: 'C-61', type: 'COURS', professor: 'Sara MTIW' },
    '10:15-11:45': null,
    '13:00-14:30': null,
    '14:45-16:15': { name: 'TD-3H00-3.15-Processus stochastique', code: 'ING1_INFO_TD1 || ING1_INFO_TD2', room: 'A-32', type: 'TD', professor: 'Sara MEJ' },
    '16:30-18:00': null
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

  constructor() {
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


  getActivityColor(type: string | undefined): string {
    switch (type) {
      case 'COURS': return 'rgba(224, 251, 252, 0.8)'; // 30% opacity
      case 'TD': return 'rgba(131, 197, 190, 0.8)';  // 30% opacity
      case 'TP': return '#489fb5';   // 30% opacity
      default: return 'transparent';
    }
  }

  openEditModal(seance: Seance | null, day: string, time: string) {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '', room: '', type: 'COURS', professor: '', code: '' },
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
      if (seance) {
        this.schedule[day][time] = seance; // Save the updated activity
      }
    }
    this.closeModal();
  }
}
