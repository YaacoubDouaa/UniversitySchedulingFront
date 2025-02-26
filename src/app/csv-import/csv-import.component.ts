import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Papa } from 'ngx-papaparse';
import { ScheduleService } from '../schedule-service.service';
import { SpecializedCsvParserService } from '../specialized-csv-parser.service';
import {Seance, SeanceDTO} from '../models/Seance';

interface ScheduleRow extends Record<string, string> {
  id: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: string;
  matiere: string;
  frequence: string;
  salle: string;
  enseignant: string;
  branches: string;
}

interface FileInfo {
  name: string;
  type: string;
  size: string;
  lastModified: string;
  rowCount: number;
  columnCount: number;
  sampleData: string[][];
}

interface SaveRequest {
  metadata: {
    importDate: string;
    importedBy: string;
    fileName: string;
    totalSeances: number;
  };
  seances: SeanceDTO[];
}

interface ImportHistory {
  id: number;
  fileName: string;
  importDate: string;
  status: 'Success' | 'Failed';
  errors: string[];
  totalRecords: number;
}

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.css'],
  standalone: false
})
export class CsvImportComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  // Form groups
  uploadForm: FormGroup;
  mappingForm: FormGroup;

  // File handling
  file: File | null = null;
  fileInfo: FileInfo | null = null;
  parsedData: SeanceDTO[] = [];
  convertedSeances: SeanceDTO[] = [];
  previewData: MatTableDataSource<ScheduleRow>;
  displayedColumns: string[] = [];

  // UI state
  isProcessing = false;
  processingProgress = 0;
  validationErrors: string[] = [];
  hasHeaderRow = true;
  errorMessage: string | null = null;

  // Date time information
  currentDateTime: string = '2025-02-26 00:38:06';
  currentUser: string = 'YaacoubDouaa';

  constructor(
    private formBuilder: FormBuilder,
    private papa: Papa,
    private scheduleService: ScheduleService,
    private specializedParser: SpecializedCsvParserService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.formBuilder.group({
      file: ['', Validators.required],
      hasHeader: [true]
    });

    this.mappingForm = this.formBuilder.group({});
    this.previewData = new MatTableDataSource<ScheduleRow>([]);
  }

  ngOnInit(): void {
    // Initialize component if needed
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];

      // Validate file type
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        this.showError('Invalid file type. Please select a CSV file.');
        input.value = '';
        return;
      }

      this.file = selectedFile;
      this.uploadForm.patchValue({ file: this.file.name });
      this.extractFileInfo();
    }
  }

  extractFileInfo(): void {
    if (!this.file) return;

    const sizeInKB = this.file.size / 1024;
    const sizeString = sizeInKB < 1024
      ? `${sizeInKB.toFixed(2)} KB`
      : `${(sizeInKB / 1024).toFixed(2)} MB`;

    this.fileInfo = {
      name: this.file.name,
      type: this.file.type || 'text/csv',
      size: sizeString,
      lastModified: new Date(this.file.lastModified).toLocaleString(),
      rowCount: 0,
      columnCount: 0,
      sampleData: []
    };

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      if (!content) return;

      const lines = content.split('\n').slice(0, 10);
      if (lines.length > 0) {
        const firstLine = lines[0].split(',');
        this.fileInfo!.columnCount = firstLine.length;
        const averageLineLength = content.length / lines.length;
        this.fileInfo!.rowCount = Math.round(this.file!.size / averageLineLength);
        this.fileInfo!.sampleData = lines.map(line => line.split(','));
      }
    };

    reader.onerror = (error) => {
      this.showError(`Error reading file info: ${error}`);
    };

    reader.readAsText(this.file);
  }

  parseFile(): void {
    if (!this.file) return;

    this.isProcessing = true;
    this.processingProgress = 0;
    this.validationErrors = [];

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      if (!content) {
        this.showError('Error reading file content');
        return;
      }

      try {
        // Parse the CSV data
        this.convertedSeances = this.specializedParser.parseScheduleCsvToSeanceDTO(content);

        // Create preview data from the converted seances
        const previewData: ScheduleRow[] = this.convertedSeances.slice(0, 5).map(seance => ({
          id: seance.id || 'To be generated',
          jour: seance.jour,
          heureDebut: seance.heureDebut,
          heureFin: seance.heureFin,
          type: seance.type,
          matiere: seance.matiere,
          frequence: seance.frequence,
          salle: seance.salle?.name || '',
          enseignant: seance.enseignant?.name || '',
          branches: seance.branches?.map(b => b.name).join(', ') || ''
        }));

        // Initialize the table data
        this.displayedColumns = Object.keys(previewData[0] || {});
        this.previewData = new MatTableDataSource<ScheduleRow>(previewData);
        this.parsedData = this.convertedSeances;

        // Show mapping form when data is loaded
        this.showMappingForm = true;

        // Validate the converted data
        this.validateConvertedData();

        // Update processing status
        this.isProcessing = false;
        this.processingProgress = 100;

        if (this.validationErrors.length === 0) {
          this.showSuccess('CSV successfully parsed!');
          this.stepper.next();
        } else {
          this.showError('There are validation errors. Please review before proceeding.');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        this.showError(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        this.isProcessing = false;
      }
    };

    reader.onerror = (error) => {
      this.showError(`Error reading file: ${error}`);
      this.isProcessing = false;
      this.processingProgress = 0;
    };

    reader.onprogress = (event: ProgressEvent<FileReader>) => {
      if (event.lengthComputable) {
        this.processingProgress = Math.round((event.loaded / event.total) * 50);
      }
    };

    reader.readAsText(this.file);
  }

  validateConvertedData(): void {
    this.validationErrors = [];

    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.validationErrors.push('No sessions could be extracted from the CSV');
      return;
    }

    const sessionsWithoutMatiere = this.convertedSeances.filter(s => !s.matiere || s.matiere === 'Non spécifié');
    if (sessionsWithoutMatiere.length > 0) {
      this.validationErrors.push(`${sessionsWithoutMatiere.length} sessions don't have a specified course name`);
    }

    const roomTimeConflicts = this.findRoomTimeConflicts();
    if (roomTimeConflicts.length > 0) {
      this.validationErrors.push(`${roomTimeConflicts.length} room-time conflicts detected`);
    }

    const teacherConflicts = this.findTeacherConflicts();
    if (teacherConflicts.length > 0) {
      this.validationErrors.push(`${teacherConflicts.length} teacher scheduling conflicts detected`);
    }
  }

  findRoomTimeConflicts(): Array<{ type: string; key: string; seances: SeanceDTO[] }> {
    const conflicts: Array<{ type: string; key: string; seances: SeanceDTO[] }> = [];
    const roomTimeMap = new Map<string, SeanceDTO[]>();

    this.convertedSeances.forEach(seance => {
      if (!seance.salle?.name) return;

      const key = `${seance.jour}_${seance.heureDebut}_${seance.heureFin}_${seance.salle.name}`;
      const existing = roomTimeMap.get(key) || [];
      roomTimeMap.set(key, [...existing, seance]);
    });

    roomTimeMap.forEach((seances, key) => {
      if (seances.length > 1) {
        conflicts.push({ type: 'room_conflict', key, seances });
      }
    });

    return conflicts;
  }

  findTeacherConflicts(): Array<{ type: string; key: string; seances: SeanceDTO[] }> {
    const conflicts: Array<{ type: string; key: string; seances: SeanceDTO[] }> = [];
    const teacherTimeMap = new Map<string, SeanceDTO[]>();

    this.convertedSeances.forEach(seance => {
      if (!seance.enseignant?.name) return;

      const key = `${seance.jour}_${seance.heureDebut}_${seance.heureFin}_${seance.enseignant.name}`;
      const existing = teacherTimeMap.get(key) || [];
      teacherTimeMap.set(key, [...existing, seance]);
    });

    teacherTimeMap.forEach((seances, key) => {
      if (seances.length > 1) {
        conflicts.push({ type: 'teacher_conflict', key, seances });
      }
    });

    return conflicts;
  }

  saveSeances(): void {
    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.showError('No data to save');
      return;
    }

    this.isProcessing = true;
    this.processingProgress = 0;

    const saveRequest: SaveRequest = {
      metadata: {
        importDate: this.currentDateTime,
        importedBy: this.currentUser,
        fileName: this.file?.name || 'Unknown file',
        totalSeances: this.convertedSeances.length
      },
      seances: this.convertedSeances
    };

    this.scheduleService.saveSeances(saveRequest).subscribe({
      next: (response: { success: boolean; message: string }) => {
        this.isProcessing = false;
        this.processingProgress = 100;
        this.showSuccess(`Successfully saved ${this.convertedSeances.length} sessions to the database.`);

        this.addToImportHistory({
          id: Date.now(),
          fileName: this.file?.name || 'Unknown file',
          importDate: this.currentDateTime,
          status: 'Success',
          errors: [],
          totalRecords: this.convertedSeances.length
        });

        this.stepper.next();
      },
      error: (error: Error) => {
        this.isProcessing = false;
        this.showError(`Error saving sessions: ${error.message || 'Unknown error'}`);

        this.addToImportHistory({
          id: Date.now(),
          fileName: this.file?.name || 'Unknown file',
          importDate: this.currentDateTime,
          status: 'Failed',
          errors: [error.message || 'Unknown error'],
          totalRecords: 0
        });
      }
    });
  }

  addToImportHistory(history: ImportHistory): void {
    // Implementation would depend on your backend service
    console.log('Import history:', history);
  }

  toggleHeaderRow(event: { checked: boolean }): void {
    this.hasHeaderRow = event.checked;
  }

  showError(message: string): void {
    this.errorMessage = message;
    console.error(message);

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    setTimeout(() => {
      if (this.errorMessage === message) {
        this.errorMessage = null;
      }
    }, 5000);
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  reset(): void {
    this.file = null;
    this.fileInfo = null;
    this.parsedData = [];
    this.convertedSeances = [];
    this.displayedColumns = [];
    this.previewData = new MatTableDataSource<ScheduleRow>([]);
    this.isProcessing = false;
    this.processingProgress = 0;
    this.validationErrors = [];
    this.uploadForm.reset();
    this.mappingForm.reset();
    this.errorMessage = null;

    if (this.stepper) {
      this.stepper.reset();
    }
  }
  /**
   * Download the converted seances as JSON
   */
  downloadJson(): void {
    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.showError('No data available to download');
      return;
    }

    try {
      // Create a formatted JSON object with metadata
      const exportData = {
        metadata: {
          fileName: this.file?.name || 'unknown',
          exportDate: this.currentDateTime,
          exportedBy: this.currentUser,
          totalSeances: this.convertedSeances.length,
          generatedAt: new Date().toISOString()
        },
        seances: this.convertedSeances
      };

      // Convert to pretty-printed JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create and trigger download link
      const a = document.createElement('a');
      a.href = url;
      a.download = this.file
        ? `${this.file.name.replace('.csv', '')}_${this.currentDateTime.replace(/[: ]/g, '-')}.json`
        : `schedule_export_${this.currentDateTime.replace(/[: ]/g, '-')}.json`;

      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      this.showSuccess('JSON file downloaded successfully');
    } catch (error) {
      this.showError(`Error downloading JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save the schedule to the system
   */
  saveSchedule(): void {
    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.showError('No data to save');
      return;
    }

    this.isProcessing = true;
    this.processingProgress = 0;

    const saveRequest: SaveRequest = {
      metadata: {
        importDate: this.currentDateTime,
        importedBy: this.currentUser,
        fileName: this.file?.name || 'Unknown file',
        totalSeances: this.convertedSeances.length
      },
      seances: this.convertedSeances
    };

    this.scheduleService.saveSeances(saveRequest).subscribe({
      next: (response: { success: boolean; message: string }) => {
        this.isProcessing = false;
        this.processingProgress = 100;

        if (response.success) {
          this.showSuccess(`Successfully saved ${this.convertedSeances.length} sessions to the database.`);

          // Record in import history
          this.addToImportHistory({
            id: Date.now(),
            fileName: this.file?.name || 'Unknown file',
            importDate: this.currentDateTime,
            status: 'Success',
            errors: [],
            totalRecords: this.convertedSeances.length
          });

          // Move to next step only on success
          this.stepper.next();
        } else {
          this.showError(`Failed to save sessions: ${response.message}`);
        }
      },
      error: (error: Error) => {
        this.isProcessing = false;
        this.processingProgress = 0;
        this.showError(`Error saving sessions: ${error.message || 'Unknown error'}`);

        // Record failed attempt
        this.addToImportHistory({
          id: Date.now(),
          fileName: this.file?.name || 'Unknown file',
          importDate: this.currentDateTime,
          status: 'Failed',
          errors: [error.message || 'Unknown error'],
          totalRecords: 0
        });
      }
    });
  }

  /**
   * Map fields from CSV to DTO structure
   */
  mapFields(): void {
    if (!this.parsedData || this.parsedData.length === 0) {
      this.showError('No data to map');
      return;
    }

    try {
      this.isProcessing = true;
      this.processingProgress = 0;

      // Get the mapping configuration from the form
      const mapping = this.mappingForm.value;

      // Validate required fields are mapped
      const requiredFields = ['jour', 'heureDebut', 'heureFin', 'matiere'];
      const mappedFields = Object.values(mapping);
      const missingRequiredFields = requiredFields.filter(field => !mappedFields.includes(field));

      if (missingRequiredFields.length > 0) {
        this.showError(`Missing required field mappings: ${missingRequiredFields.join(', ')}`);
        this.isProcessing = false;
        return;
      }

      // Convert the parsed data using the mapping
      this.convertedSeances = this.parsedData.map((row, index) => {
        try {
          const mappedSeance: SeanceDTO = {
            id: `TEMP_${index}`, // Temporary ID that will be replaced by the backend
            jour: this.getMappedValue(row, mapping, 'jour'),
            heureDebut: this.getMappedValue(row, mapping, 'heureDebut'),
            heureFin: this.getMappedValue(row, mapping, 'heureFin'),
            type: this.getMappedValue(row, mapping, 'type') || 'default',
            matiere: this.getMappedValue(row, mapping, 'matiere'),
            frequence: this.getMappedValue(row, mapping, 'frequence') || 'weekly',
            salle: {
              name: this.getMappedValue(row, mapping, 'salle') || 'TBD'
            },
            enseignant: {
              name: this.getMappedValue(row, mapping, 'enseignant') || 'TBD'
            },
            branches: this.getMappedValue(row, mapping, 'branches')
              ? [{ name: this.getMappedValue(row, mapping, 'branches') }]
              : []
          };

          this.processingProgress = Math.round((index / this.parsedData.length) * 100);
          return mappedSeance;
        } catch (error) {
          throw new Error(`Error mapping row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      this.isProcessing = false;
      this.processingProgress = 100;
      this.showSuccess('Fields mapped successfully');
      this.stepper.next();
    } catch (error) {
      this.isProcessing = false;
      this.showError(`Error mapping fields: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Helper method to get mapped value from row
   */
  private getMappedValue(row: any, mapping: { [key: string]: string }, targetField: string): string {
    const sourceField = Object.entries(mapping).find(([_, value]) => value === targetField)?.[0];
    return sourceField ? row[sourceField] || '' : '';
  }
  getCurrentDateTime(): string {
    // Return the stored current date time if available
    if (this.currentDateTime) {
      return this.currentDateTime;
    }

    // Get current UTC time
    const now = new Date();

    // Format to YYYY-MM-DD HH:MM:SS
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    // Update the stored current date time
    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return this.currentDateTime;
  }

  // Add this property to your component class
  showMappingForm: boolean = false;

// Add this method to toggle the form visibility
  toggleMappingForm(): void {
    this.showMappingForm = !this.showMappingForm;
  }
}
