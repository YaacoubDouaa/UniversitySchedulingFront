import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';
import { SalleList, SalleSchedule } from '../models/Salle';
import { Seance } from '../models/Seance';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  types = ['COURS', 'TD'];
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  showModal: boolean = false;
  private selectedFrequency: string = "weekly";
  salleSchedule: SalleSchedule = {
    LUNDI: {},
    MARDI: {},
    MERCREDI: {},
    JEUDI: {},
    VENDREDI: {},
    SAMEDI: {},
    DIMANCHE: {}
  };
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;

  protected showAddModal: boolean = false;
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
              name: 'Ch-Conception et analyse d\'algorithmes',
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
              name: 'TP-3H00-3.15-Fondements de l\'intelligence Artificielle',
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
              name: 'TP-Techniques d\'apprentissage automatique',
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
    },
    'B-12': {
      name: 'B-12',
      type: 'COURS',
      capacite: 60,
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
          },
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
        },
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
    'C-05': {
      name: 'C-05',
      type: 'LAB',
      capacite: 35,
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
          },
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
        },
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
    'D-20': {
      name: 'D-20',
      type: 'SEMINAIRE',
      capacite: 80,
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
          },
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
    'E-10': {
      name: 'E-10',
      type: 'COURS',
      capacite: 45,
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
        },
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

  constructor(private router: Router, private salleScheduleService: ScheduleService) { }

  isSalleAvailable(salle: string, day: string, time: string): boolean {
    const disponibilite = this.salles[salle].schedule;
    return !(disponibilite[day] && disponibilite[day][time]);
  }

  onSelectSalle(salleSchedule: SalleSchedule) {
    this.salleScheduleService.changeSchedule(salleSchedule);
    this.salleSchedule = salleSchedule;
    this.router.navigate(['/room-schedule']);
  }

  getSalleColor(salle: string, day: string, time: string, type: string): string {
    return this.isSalleAvailable(salle, day, time) ? '#d4edda' : '#f8d7da';
  }

  shouldDisplaySalle(salle: any): boolean {
    if (!this.selectedType || this.selectedType === '') {
      return true;
    }
    return salle.type === this.selectedType;
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
    if (this.selectedActivity && this.salleSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (!this.salleSchedule[day]) this.salleSchedule[day] = {};
      if (!this.salleSchedule[day][time]) this.salleSchedule[day][time] = {};

      const niveau = seance.code || 'Default';
      this.salleSchedule[day][time][niveau] = seance;
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
    if (this.selectedActivity && this.salleSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (this.salleSchedule[day] && this.salleSchedule[day][time]) {
        const niveau = seance.code || 'Default';
        this.salleSchedule[day][time][niveau] = seance;
      }
    }
    this.showModal = false;
  }

  openDeleteModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = { seance, day, time };
    this.showModal = true;
  }

  saveDeleteChanges(): void {
    if (this.selectedActivity && this.salleSchedule) {
      const { day, time, seance } = this.selectedActivity;

      const niveaux = Object.keys(this.salleSchedule[day]?.[time] || {});
      niveaux.forEach(niveau => {
        if (this.salleSchedule![day][time][niveau]?.id === seance.id) {
          delete this.salleSchedule![day][time][niveau];
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

  openViewModal(salle: string, day: string, time: string) {
    if (this.salles[salle]?.schedule[day]?.[time]) {
      console.log('Opening view modal:', this.salles[salle].schedule[day][time]);
    } else {
      console.log('No session found for the selected time slot.');
    }
  }

  protected readonly Object = Object;
}
