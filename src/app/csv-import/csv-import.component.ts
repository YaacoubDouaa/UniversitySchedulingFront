import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Papa } from 'ngx-papaparse';
import { ScheduleService } from '../schedule-service.service';
import {FichierExcel} from '../models/FichierExcel';

interface ScheduleRow {
  [key: string]: string;
}

interface FileInfo {
  name: string;
  type: string;
  size: string;
  lastModified: string;
  rowCount: number;
  columnCount: number;
  sampleData: any[];
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
  parsedData: ScheduleRow[] = [];
  previewData: MatTableDataSource<ScheduleRow>;
  displayedColumns: string[] = [];

  // UI state
  isProcessing = false;
  processingProgress = 0;
  validationErrors: string[] = [];
  hasHeaderRow = true;

  // Date time information
  currentDateTime: string = '2025-02-25 22:30:12';
  currentUser: string = 'YaacoubDouaa';

  constructor(
    private formBuilder: FormBuilder,
    private papa: Papa,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.formBuilder.group({
      file: ['', Validators.required],
      hasHeader: [true]
    });

    this.mappingForm = this.formBuilder.group({});
    this.previewData = new MatTableDataSource<ScheduleRow>([]);
  }

  ngOnInit(): void {}

  /**
   * Handles file selection and validates file type
   */
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

      // Extract and display file information
      this.extractFileInfo();
    }
  }

  /**
   * Extracts and displays information about the selected file
   */
  extractFileInfo(): void {
    if (!this.file) return;

    const sizeInKB = this.file.size / 1024;
    let sizeString = sizeInKB < 1024
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

    // Read first few lines to get column preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      const lines = content.split('\n').slice(0, 10);

      if (lines.length > 0) {
        const firstLine = lines[0].split(',');
        this.fileInfo!.columnCount = firstLine.length;

        // Estimate row count based on file size and average line length
        const averageLineLength = content.length / lines.length;
        this.fileInfo!.rowCount = Math.round(this.file!.size / averageLineLength);
      }
    };
    reader.readAsText(this.file);
  }

  /**
   * Parses the CSV file using PapaParse library
   */
  parseFile(): void {
    if (!this.file) return;

    this.isProcessing = true;
    this.processingProgress = 0;
    this.validationErrors = [];

    const parseConfig = {
      complete: (result: any) => {
        // Process the completed parse result
        if (result.data && result.data.length) {
          this.parsedData = result.data as ScheduleRow[];
          this.displayedColumns = Object.keys(this.parsedData[0] || {});

          // Update file info with actual row and column counts
          if (this.fileInfo) {
            this.fileInfo.rowCount = this.parsedData.length;
            this.fileInfo.columnCount = this.displayedColumns.length;
            this.fileInfo.sampleData = this.parsedData.slice(0, 5);
          }

          this.previewData = new MatTableDataSource(this.parsedData.slice(0, 5));
          this.createMappingForm();
          this.validateData();
        } else {
          this.showError('No data found in the file or invalid CSV format.');
        }

        this.isProcessing = false;
        this.processingProgress = 100;

        if (this.validationErrors.length === 0) {
          this.stepper.next();
        }
      },
      error: (error: any) => {
        this.showError(`Error parsing file: ${error}`);
        this.isProcessing = false;
      },
      header: this.hasHeaderRow,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (results: any, parser: any) => {
        // Update progress during parsing
        this.processingProgress = Math.min(
          99,
          Math.round((results.meta.cursor / this.file!.size) * 100)
        );
      }
    };

    this.papa.parse(this.file, parseConfig);
  }

  /**
   * Creates form controls for field mapping
   */
  createMappingForm(): void {
    const group: any = {};

    this.displayedColumns.forEach(column => {
      // Try to auto-map columns based on common names
      let defaultValue = '';

      const lowerCol = column.toLowerCase();
      if (lowerCol.includes('day') || lowerCol.includes('jour')) {
        defaultValue = 'day';
      } else if (lowerCol.includes('time') || lowerCol.includes('heure')) {
        defaultValue = 'time';
      } else if (lowerCol.includes('course') || lowerCol.includes('cours')) {
        defaultValue = 'course';
      } else if (lowerCol.includes('prof')) {
        defaultValue = 'professor';
      } else if (lowerCol.includes('room') || lowerCol.includes('salle')) {
        defaultValue = 'room';
      } else if (lowerCol.includes('group') || lowerCol.includes('groupe')) {
        defaultValue = 'groupe';
      }

      group[column] = [defaultValue];
    });

    this.mappingForm = this.formBuilder.group(group);
  }

  /**
   * Maps CSV fields to application data model
   */
  mapFields(): void {
    if (this.validationErrors.length > 0) {
      this.showError('Please fix validation errors before proceeding');
      return;
    }

    const mapping = this.mappingForm.value;
    const requiredFields = ['day', 'time', 'course'];

    // Check if required fields are mapped
    const mappedFields = Object.values(mapping);
    const missingFields = requiredFields.filter(
      field => !mappedFields.includes(field)
    );

    if (missingFields.length > 0) {
      this.showError(`Missing required field mappings: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const mappedData = this.parsedData.map(row => {
        const mappedRow: ScheduleRow = {};
        Object.keys(mapping).forEach(key => {
          if (mapping[key]) {
            mappedRow[mapping[key]] = row[key];
          }
        });
        return mappedRow;
      });

      // Store processed data
      this.saveProcessedData(mappedData);
      this.showSuccess('Data successfully mapped!');
      this.stepper.next();
    } catch (error) {
      this.showError(`Error mapping fields: ${error}`);
    }
  }

  /**
   * Validates the imported data for common issues
   */
  validateData(): void {
    this.validationErrors = [];

    // Check for minimum rows
    if (this.parsedData.length === 0) {
      this.validationErrors.push('The file contains no data');
      return;
    }

    // Check for empty columns
    const emptyColumnIndexes = this.displayedColumns
      .filter(col => this.parsedData.every(row => !row[col]))
      .map(col => this.displayedColumns.indexOf(col) + 1);

    if (emptyColumnIndexes.length > 0) {
      this.validationErrors.push(
        `Column(s) ${emptyColumnIndexes.join(', ')} appear to be empty`
      );
    }

    // Check for duplicate column names
    const columnCounts = this.displayedColumns.reduce((acc, col) => {
      acc[col] = (acc[col] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicates = Object.keys(columnCounts)
      .filter(col => columnCounts[col] > 1);

    if (duplicates.length > 0) {
      this.validationErrors.push(
        `Duplicate column names detected: ${duplicates.join(', ')}`
      );
    }
  }

  /**
   * Save the processed data to the schedule service
   */
  saveProcessedData(mappedData: any[]): void {
    // Convert mapped data to the format expected by the schedule service
    const scheduleData = this.convertToScheduleFormat(mappedData);

    // Add processed file to import history
    this.addToImportHistory({
      id: Date.now(),
      fileName: this.file?.name || 'Unknown file',
      status: this.validationErrors.length > 0 ? 'Warning' : 'Success',
      errors: this.validationErrors,
      importDate: new Date().toISOString()
    });
  }

  /**
   * Converts mapped data to the schedule format
   */
  convertToScheduleFormat(mappedData: any[]): any {
    // This would be implemented based on your specific schedule data structure
    return mappedData;
  }

  /**
   * Add imported file to history
   */
  addToImportHistory(fileRecord: FichierExcel): void {
    // This would integrate with your file history service
    console.log('File added to import history:', fileRecord);
  }

  /**
   * Download the processed data as JSON
   */
  downloadJson(): void {
    const jsonData = JSON.stringify(this.convertToScheduleFormat(this.parsedData));
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.file?.name.replace('.csv', '')}_processed.json`;
    a.click();

    window.URL.revokeObjectURL(url);
    this.showSuccess('JSON file downloaded!');
  }

  /**
   * Save the schedule to the backend
   */
  saveSchedule(): void {
    this.showSuccess('Schedule saved successfully!');
    // Would integrate with your backend service
  }

  /**
   * Toggle header row handling
   */
  toggleHeaderRow(event: any): void {
    this.hasHeaderRow = event.checked;
  }

  /**
   * Display error message
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Display success message
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Get the current date time
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Get the current user
   */
  getCurrentUser(): string {
    return this.currentUser;
  }
}
