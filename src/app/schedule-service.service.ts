
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {SalleSchedule} from './models/Salle';
import {FichierExcel} from './models/FichierExcel';
import {HttpClient} from '@angular/common/http';

class ScheduleRow {
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleSource = new BehaviorSubject<SalleSchedule | null>(null);
  currentDisponibilite = this.scheduleSource.asObservable();


  changeSchedule(salleSchedule: SalleSchedule) {
    this.scheduleSource.next(salleSchedule);
  }
  private importedFiles: FichierExcel[] = []; // Store imported files metadata

  constructor(private http: HttpClient) {}

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


  setScheduleData(mappedData: ScheduleRow[]) {

  }
}
