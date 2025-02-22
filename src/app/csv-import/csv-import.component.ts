import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Papa } from 'ngx-papaparse';
import { ScheduleService } from '../schedule-service.service';

interface ScheduleRow {
  [key: string]: string;
}

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.css'],
  standalone: false
})
export class CsvImportComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  uploadForm: FormGroup;
  mappingForm: FormGroup;
  file: File | null = null;
  parsedData: ScheduleRow[] = [];
  previewData: MatTableDataSource<ScheduleRow>;
  displayedColumns: string[] = [];
  isProcessing = false;
  processingProgress = 0;

  constructor(
    private formBuilder: FormBuilder,
    private papa: Papa,
    private scheduleService: ScheduleService
  ) {
    this.uploadForm = this.formBuilder.group({
      file: ['', Validators.required]
    });
    this.mappingForm = this.formBuilder.group({});
    this.previewData = new MatTableDataSource<ScheduleRow>([]);
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.uploadForm.patchValue({ file: this.file.name });
    }
  }

  parseFile(): void {
    if (this.file) {
      this.isProcessing = true;
      this.processingProgress = 0;
      const totalSize = this.file.size;
      let processedSize = 0;

      this.papa.parse(this.file, {
        complete: (result) => {
          this.parsedData = result.data as ScheduleRow[];
          this.displayedColumns = Object.keys(this.parsedData[0]);
          this.previewData = new MatTableDataSource(this.parsedData.slice(0, 5));
          this.createMappingForm();
          this.isProcessing = false;
          this.processingProgress = 100;
          this.stepper.next();
        },
        header: true,
        skipEmptyLines: true,
        step: (results) => {
          processedSize += results.data.length;
          this.processingProgress = Math.round((processedSize / totalSize) * 100);
        }
      });
    }
  }

  createMappingForm(): void {
    const group: any = {};
    this.displayedColumns.forEach(column => {
      group[column] = [''];
    });
    this.mappingForm = this.formBuilder.group(group);
  }

  mapFields(): void {
    const mapping = this.mappingForm.value;
    const mappedData = this.parsedData.map(row => {
      const mappedRow: ScheduleRow = {};
      Object.keys(mapping).forEach(key => {
        if (mapping[key]) {
          mappedRow[mapping[key]] = row[key];
        }
      });
      return mappedRow;
    });
    // this.scheduleService.setScheduleData(mappedData);
    this.stepper.next();
  }

  // downloadJson(): void {
  //   const jsonData = JSON.stringify(this.scheduleService.getScheduleData());
  //   const blob = new Blob([jsonData], { type: 'application/json' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'schedule.json';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

  // saveSchedule(): void {
  //   this.scheduleService.saveSchedule().subscribe(
  //     () => {
  //       // Handle successful save
  //       console.log('Schedule saved successfully');
  //     },
  //     (error) => {
  //       // Handle error
  //       console.error('Error saving schedule:', error);
  //     }
  //   );
  // }
  saveSchedule() {

  }

  downloadJson() {

  }
}
