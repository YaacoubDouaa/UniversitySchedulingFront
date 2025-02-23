import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SalleList, SalleSchedule } from './models/Salle';
import { FichierExcel } from './models/FichierExcel';
import { HttpClient } from '@angular/common/http';
import { Schedule } from './models/Schedule';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleSource = new BehaviorSubject<SalleSchedule | null>(null);
  currentDisponibilite = this.scheduleSource.asObservable();

  private loaded = false;

  // Sample schedule data
  private schedule: Schedule = {

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
    },Dimanche: {
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
  private globalScheduleSource = new BehaviorSubject<Schedule>(this.schedule); // Initialize with a default schedule


  currentGlobalSchedule = this.globalScheduleSource.asObservable(); // Expose current global schedule
  private importedFiles: FichierExcel[] = []; // Store imported files metadata

  constructor(private http: HttpClient) {}

  /**
   * Change the current schedule
   * @param salleSchedule - SalleSchedule object to set
   */
  changeSchedule(salleSchedule: SalleSchedule) {
    this.scheduleSource.next(salleSchedule);
  }

  /**
   * Add imported file metadata to the list
   * @param file - FichierExcel object
   */
  addImportedFile(file: FichierExcel): void {
    this.importedFiles.push(file);
  }

  /**
   * Get all imported files metadata
   */
  getImportedFiles(): FichierExcel[] {
    return this.importedFiles;
  }

  /**
   * Upload a CSV file and return its processing result
   * @param file - The CSV file to upload
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/upload-schedule', formData);
  }

  /**
   * Fetch imported schedule files from the backend
   */
  fetchImportedFiles(): Observable<FichierExcel[]> {
    return this.http.get<FichierExcel[]>('/api/imported-files');
  }

  /**
   * Save the current schedule
   */
  saveSchedule(): Observable<any> {
    return this.http.post('/api/save-schedule', this.importedFiles);
  }

  /**
   * Fetch the global schedule from the backend
   */
  getGlobalSchedule(): Observable<Schedule> {
    if (!this.loaded) {
      // Simulate API call with delay
      return of(this.schedule).pipe(
        delay(1000),
        tap(schedule => {
          this.loaded = true;
          this.globalScheduleSource.next(schedule); // Notify subscribers with the loaded schedule
        })
      );
    } else {
      // Return the existing schedule without delay if already loaded
      return this.globalScheduleSource.asObservable();
    }
  }

  /**
   * Update the global schedule and notify subscribers
   */
  updateGlobalSchedule(): void {
    this.getGlobalSchedule().subscribe((schedule: Schedule) => {
      this.globalScheduleSource.next(schedule);
    });
  }

  /**
   * Set schedule data
   * @param mappedData - Array of ScheduleRow objects
   */
  // setScheduleData(mappedData: ScheduleRow[]) {
  //   // Implement functionality to handle mapped data if necessary
  // }


}
