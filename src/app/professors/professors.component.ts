import { Component } from '@angular/core';
import {ProfList, ProfSchedule} from '../models/Professors';
import {Router} from '@angular/router';
import {ProfScheduleService} from '../prof-schedule-service.service';
import {SalleSchedule} from '../models/Salle';
import {ScheduleService} from '../schedule-service.service';
import {Seance} from '../models/Seance';

@Component({
  selector: 'app-professors',
  standalone: false,

  templateUrl: './professors.component.html',
  styleUrl: './professors.component.css'
})
export class ProfessorsComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  types=['COURS','TD'];
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  showModal: boolean = false;
  private selectedFrequency: string = "weekly";
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;
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
            code: 'ING2_TIC',
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
            code: 'ING2_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Hana CHAIEB',
            biWeekly: false
          }
        }
      }
    }
  },
  'Karim KHELIL': {
    name: 'Karim KHELIL',
    codeEnseignant: 'P003',
    heures: 1,
    schedule: {
      VENDREDI: {
        '12:00-13:30': {
          ING2_TIC_TP: {
            name: 'TP-Cryptographie Avancée',
            id: 22,
            code: 'ING2_TIC_TP',
            room: 'B-12',
            type: 'TP',
            professor: 'Karim KHELIL',
            biWeekly: true
          }
        }
      }
    }
  },
  'Fatma JEMAA': {
    name: 'Fatma JEMAA',
    codeEnseignant: 'P004',
    heures: 2,
    schedule: {
      LUNDI: {
        '8:30-10:00': {
          ING1_SE: {
            name: 'TP-Développement Web',
            id: 23,
            code: 'ING1_SE',
            room: 'C-05',
            type: 'TP',
            professor: 'Fatma JEMAA',
            biWeekly: false
          }
        }
      }
    }
  },
  'Ahmed BELHADJ': {
    name: 'Ahmed BELHADJ',
    codeEnseignant: 'P005',
    heures: 2,
    schedule: {
      LUNDI: {
        '13:00-14:30': {
          ING1_SE: {
            name: 'TP-Programmation Orientée Objet',
            id: 24,
            code: 'ING1_SE',
            room: 'C-05',
            type: 'TP',
            professor: 'Ahmed BELHADJ',
            biWeekly: false
          }
        }
      }
    }
  },
  'Nada FAKHFAKH': {
    name: 'Nada FAKHFAKH',
    codeEnseignant: 'P006',
    heures: 1,
    schedule: {
      MERCREDI: {
        '16:30-18:00': {
          ING1_SE: {
            name: 'TP-Bases de Données',
            id: 25,
            code: 'ING1_SE',
            room: 'C-05',
            type: 'TP',
            professor: 'Nada FAKHFAKH',
            biWeekly: true
          }
        }
      }
    }
  },
  'Zied ALOUANI': {
    name: 'Zied ALOUANI',
    codeEnseignant: 'P007',
    heures: 2,
    schedule: {
      JEUDI: {
        '10:15-11:45': {
          ING3_EEA: {
            name: 'Séminaire-Ingénierie des Systèmes Embarqués',
            id: 26,
            code: 'ING3_EEA',
            room: 'D-20',
            type: 'SEMINAIRE',
            professor: 'Zied ALOUANI',
            biWeekly: false
          }
        }
      }
    }
  },
  'Mouna KHEMIRI': {
    name: 'Mouna KHEMIRI',
    codeEnseignant: 'P008',
    heures: 2,
    schedule: {
      JEUDI: {
        '14:45-16:15': {
          ING3_EEA: {
            name: 'Séminaire-Internet des Objets',
            id: 27,
            code: 'ING3_EEA',
            room: 'D-20',
            type: 'SEMINAIRE',
            professor: 'Mouna KHEMIRI',
            biWeekly: false
          }
        }
      }
    }
  },
  'Leila KHARRAT': {
    name: 'Leila KHARRAT',
    codeEnseignant: 'P009',
    heures: 2,
    schedule: {
      MARDI: {
        '12:00-13:30': {
          ING1_MATH: {
            name: 'Ch-Analyse Mathématique',
            id: 28,
            code: 'ING1_MATH',
            room: 'E-10',
            type: 'COURS',
            professor: 'Leila KHARRAT',
            biWeekly: false
          }
        }
      }
    }
  },
  'Salma YAHYA': {
    name: 'Salma YAHYA',
    codeEnseignant: 'P010',
    heures: 1,
    schedule: {
      SAMEDI: {
        '8:30-10:00': {
          ING1_MATH_TD: {
            name: 'TD-Probabilités et Statistiques',
            id: 29,
            code: 'ING1_MATH_TD',
            room: 'E-10',
            type: 'TD',
            professor: 'Salma YAHYA',
            biWeekly: true
          }
        }
      }
    }
  }
};
  profSchedule: SalleSchedule = {
    LUNDI: {},
    MARDI: {},
    MERCREDI: {},
    JEUDI: {},
    VENDREDI: {},
    SAMEDI: {},
    DIMANCHE: {}
  };


constructor(private router: Router, private profScheduleService: ScheduleService) {}

  isProfAvailable(name: string, day: string, time: string): boolean {
    const disponibilite = this.profs[name].schedule;

    return !(disponibilite[day] && disponibilite[day][time] );}

  getSalleColor(salle: string, day: string, time: string,type:string): string {
    return this.isProfAvailable(salle, day, time) ? '#d4edda' : '#f8d7da';
  }
  onSelectProf(profSchedule:  ProfSchedule) {
    this.profScheduleService.changeSchedule(profSchedule);
    this.router.navigate(['/room-schedule']);
  }


  openAddModal(day: string, time: string): void {
    this.selectedActivity = {
      seance: { name: '', id: 0, room: '', type: 'COURS', professor: '', code: '', biWeekly: this.selectedFrequency === 'biweekly' },
      day,
      time
    };
    this.showModal = true;
  }

  saveAddChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (!this.profSchedule[day]) this.profSchedule[day] = {};
      if (!this.profSchedule[day][time]) this.profSchedule[day][time] = {};

      const niveau = seance.code || 'Default';
      this.profSchedule[day][time][niveau] = seance;
    }
    this.showModal = false;
  }

  openEditModal(seance: Seance | null, day: string, time: string) {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '',id:0, room: '', type: 'COURS', professor: '', code: '',biWeekly: this.selectedFrequency==='biweekly' },
      day,
      time,

    };
    this.showModal = true;
  }


  saveEditChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (this.profSchedule[day] && this.profSchedule[day][time]) {
        const niveau = seance.code || 'Default';
        this.profSchedule[day][time][niveau] = seance;
      }
    }
    this.showModal = false;
  }

  openDeleteModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = { seance, day, time };
    this.showModal = true;
  }

  saveDeleteChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      const niveaux = Object.keys(this.profSchedule[day]?.[time] || {});
      niveaux.forEach(niveau => {
        if (this.profSchedule![day][time][niveau]?.id === seance.id) {
          delete this.profSchedule![day][time][niveau];
        }
      });
    }
    this.showModal = false;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedActivity = null;
  }

  openViewModal(prof: string, day: string, time: string) {
    if (this.profs[prof]?.schedule[day]?.[time]) {
      console.log('Opening view modal:', this.profs[prof].schedule[day][time]);
    } else {
      console.log('No session found for the selected time slot.');
    }
  }

  protected readonly Object = Object;
}
