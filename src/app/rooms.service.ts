import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {Salle, SalleList, SallesDispo} from './models/Salle';
import {Seance} from './models/Seance';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  // Initialize with empty SalleList instead of null
  private sallesSubject = new BehaviorSubject<SalleList>({});
  private loaded = false;

  private salles: SalleList = {
    'A-8': {
      id:1,
      name: 'A-8',
      type: 'COURS',
      capacite: 50,
      schedule: {
        LUNDI: {
          '8:30-10:00': {
            ING1_INFO: {
              name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
              id: 1,
              groupe: 'ING1_INFO',
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
              groupe: 'ING1_INFO',
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
              groupe: 'ING1_INFO',
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
              groupe: 'ING1_INFO',
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
      id:2,
      name: 'A-32',
      type: 'COURS',
      capacite: 40,
      schedule: {
        LUNDI: {
          '10:15-11:45': {
            ING1_INFO_TD1: {
              name: 'TD-Algèbre certification 2',
              id: 2,
              groupe: 'ING1_INFO_TD1',
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
              groupe: 'ING1_INFO_TD1',
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
              groupe: 'ING1_INFO_TD1',
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
              groupe: 'ING1_INFO',
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
              groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
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
              groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
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
              groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
              room: 'A-32',
              type: 'TD',
              professor: 'Sara MEJ'
            }
          }
        }
      }
    },
    'A-13': {
      id:3,
      name: 'A-13',
      type: 'TD',
      capacite: 30,
      schedule: {
        MERCREDI: {
          '8:30-10:00': {
            ING1_INFO_TD1: {
              name: 'TD-Optimisation combinatoire',
              id: 8,
              groupe: 'ING1_INFO_TD1',
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
              groupe: 'ING1_INFO_TD1',
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
      id:4,
      name: 'B-12',
      type: 'COURS',
      capacite: 60,
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
          },
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
        },
        VENDREDI: {
          '12:00-13:30': {
            ING2_TIC_TP: {
              name: 'TP-Cryptographie Avancée',
              id: 22,
              groupe: 'ING2_TIC_TP',
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
      id:5,
      name: 'C-05',
      type: 'LAB',
      capacite: 35,
      schedule: {
        LUNDI: {
          '8:30-10:00': {
            ING1_SE: {
              name: 'TP-Développement Web',
              id: 23,
              groupe: 'ING1_SE',
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
              groupe: 'ING1_SE',
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
              groupe: 'ING1_SE',
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
      id:6,
      name: 'D-20',
      type: 'SEMINAIRE',
      capacite: 80,
      schedule: {
        JEUDI: {
          '10:15-11:45': {
            ING3_EEA: {
              name: 'Séminaire-Ingénierie des Systèmes Embarqués',
              id: 26,
              groupe: 'ING3_EEA',
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
              groupe: 'ING3_EEA',
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
      id:7,
      name: 'E-10',
      type: 'COURS',
      capacite: 45,
      schedule: {
        MARDI: {
          '12:00-13:30': {
            ING1_MATH: {
              name: 'Ch-Analyse Mathématique',
              id: 28,
              groupe: 'ING1_MATH',
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
              groupe: 'ING1_MATH_TD',
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

  getSalles(): Observable<SalleList> {
    if (!this.loaded) {
      // Simulate API call with delay
      return of(this.salles).pipe(
        delay(1000),
        tap(salles => {
          this.loaded = true;
          this.sallesSubject.next(salles);
        })
      );
    }
    // No need to handle null case since we initialized with empty object
    return this.sallesSubject.asObservable();
  }

  getSalleById(id: string): Observable<Salle | undefined> {
    return this.getSalles().pipe(
      map(salles => salles[id])
    );
  }

  isSalleAvailable(salle: string, day: string, time: string): Observable<boolean> {
    return this.getSalles().pipe(
      map(salles => {
        const disponibilite = salles[salle]?.schedule;
        return !(disponibilite && disponibilite[day] && disponibilite[day][time]);
      })
    );
  }

  createSallesDispo(): Observable<SallesDispo> {
    return this.getSalles().pipe(
      map(salleList => {
        const sallesDispo: SallesDispo = {};

        for (const salleId in salleList) {
          if (salleList.hasOwnProperty(salleId)) {
            const salle = salleList[salleId];

            for (const day in salle.schedule) {
              if (salle.schedule.hasOwnProperty(day)) {
                if (!sallesDispo[day]) {
                  sallesDispo[day] = {};
                }

                const daySchedule = salle.schedule[day];

                for (const time in daySchedule) {
                  if (daySchedule.hasOwnProperty(time)) {
                    if (!sallesDispo[day][time]) {
                      sallesDispo[day][time] = [];
                    }

                    sallesDispo[day][time].push(salle);
                  }
                }
              }
            }
          }
        }
        return sallesDispo;
      })
    );
  }

  addSeance(day: string, time: string, seance: Seance): void {
    const currentSalles = this.sallesSubject.getValue();
    if (currentSalles[seance.room]) {
      const salle = currentSalles[seance.room];
      if (!salle.schedule[day]) {
        salle.schedule[day] = {};
      }
      if (!salle.schedule[day][time]) {
        salle.schedule[day][time] = {};
      }
      salle.schedule[day][time][seance.groupe] = seance;
      this.sallesSubject.next({...currentSalles});
    }
  }

  getAvailableRooms(day: string, time: string): Observable<string[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            // Check if the room has no schedule for this day and time
            return !(salle.schedule[day] && salle.schedule[day][time] &&
              Object.keys(salle.schedule[day][time]).length > 0);
          })
          .map(salle => salle.name);
      })
    );
  }

  getAvailableRoomsByDayAndTime(): Observable<{ [day: string]: { [time: string]: string[] } }> {
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
    const times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

    return this.getSalles().pipe(
      map(salles => {
        const availableRooms: { [day: string]: { [time: string]: string[] } } = {};

        // Initialize the structure
        days.forEach(day => {
          availableRooms[day] = {};
          times.forEach(time => {
            availableRooms[day][time] = Object.values(salles)
              .filter(salle => {
                // Check if the room has no schedule for this day and time
                return !(salle.schedule[day] && salle.schedule[day][time] &&
                  Object.keys(salle.schedule[day][time]).length > 0);
              })
              .map(salle => salle.name);
          });
        });

        return availableRooms;
      })
    );
  }

  // Function to get available rooms by type
  getAvailableRoomsByType(day: string, time: string, type: string): Observable<string[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            // Check if the room matches the type and has no schedule for this day and time
            return salle.type === type &&
              !(salle.schedule[day] && salle.schedule[day][time] &&
                Object.keys(salle.schedule[day][time]).length > 0);
          })
          .map(salle => salle.name);
      })
    );
  }

  // Function to get all available rooms with their details
  getAvailableRoomsWithDetails(day: string, time: string): Observable<Salle[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            return !(salle.schedule[day] && salle.schedule[day][time] &&
              Object.keys(salle.schedule[day][time]).length > 0);
          });
      })
    );
  }
  editSeance(day: string, time: string, seance: Seance): void {
    const currentSalles = this.sallesSubject.getValue();
    if (currentSalles[seance.room]) {
      const salle = currentSalles[seance.room];
      if (salle.schedule[day] && salle.schedule[day][time]) {
        salle.schedule[day][time][seance.groupe] = seance;
        this.sallesSubject.next({...currentSalles});
      }
    }
  }

  deleteSeance(day: string, time: string, seance: Seance): void {
    const currentSalles = this.sallesSubject.getValue();
    if (currentSalles[seance.room]) {
      const salle = currentSalles[seance.room];
      if (salle.schedule[day] && salle.schedule[day][time]) {
        delete salle.schedule[day][time][seance.groupe];
        this.sallesSubject.next({...currentSalles});
      }
    }
  }

}
