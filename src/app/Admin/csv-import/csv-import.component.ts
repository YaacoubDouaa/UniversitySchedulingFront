import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Papa } from 'ngx-papaparse';
import { ScheduleService } from '../../Services/ScheduleService/schedule-service.service';
import { SpecializedCsvParserService } from '../../CsvParser/specialized-csv-parser.service';
import { SeanceDTO } from '../../models/dto';
import { APP_CONSTANTS } from '../../initialData/constants';

// Import all DTOs
import {
  PersonneDTO,
  AdministrateurDTO,
  BrancheDTO,
  EnseignantDTO,
  EtudiantDTO,
  FichierExcelDTO,
  NotificationDTO,
  PropositionDeRattrapageDTO,
  SalleDTO,
  SeanceConflictDTO,
  SeanceRoomConflictDTO,
  SignalDTO,
  SingleSeanceConflictDTO,
  TDDTO,
  TechnicienDTO,
  TPDTO
} from '../../models/dto';

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

// Enhanced export data interface to match all DTOs
interface ExportData {
  metadata: {
    fileName: string;
    exportDate: string;
    exportedBy: string;
    generatedAt: string;
  };
  salles: SalleDTO[];
  enseignants: EnseignantDTO[];
  branches: BrancheDTO[];
  tds: TDDTO[];
  tps: TPDTO[];
  seances: SeanceDTO[];
  etudiants?: EtudiantDTO[];
  administrateurs?: AdministrateurDTO[];
  techniciens?: TechnicienDTO[];
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
  parsedData: any[] = [];
  convertedSeances: SeanceDTO[] = [];
  previewData: MatTableDataSource<ScheduleRow>;
  displayedColumns: string[] = [];

  // Entity collections for JSON export
  salles: SalleDTO[] = [];
  enseignants: EnseignantDTO[] = [];
  branches: BrancheDTO[] = [];
  tds: TDDTO[] = [];
  tps: TPDTO[] = [];

  // UI state
  isProcessing = false;
  processingProgress = 0;
  validationErrors: string[] = [];
  hasHeaderRow = true;
  errorMessage: string | null = null;

  // Date time information
  currentDateTime: string = this.getCurrentDateTime();
  currentUser: string = APP_CONSTANTS.CURRENT_USER;

  // Property to control mapping form visibility
  showMappingForm: boolean = false;

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
        // Parse the CSV data using our specialized parser
        const { seances, salles, enseignants, branches, tds, tps } = this.parseScheduleCSV(content);

        this.convertedSeances = seances;
        this.salles = salles;
        this.enseignants = enseignants;
        this.branches = branches;
        this.tds = tds;
        this.tps = tps;

        // Create preview data from the converted seances
        const previewData: ScheduleRow[] = this.convertedSeances.slice(0, 10).map(seance => ({
          id: String(seance.id) || 'To be generated',
          jour: seance.jour,
          heureDebut: seance.heureDebut,
          heureFin: seance.heureFin,
          type: seance.type,
          matiere: seance.matiere,
          frequence: seance.frequence || 'weekly',
          salle: this.getSalleNameById(seance.salleId),
          enseignant: this.getEnseignantNameById(seance.enseignantId),
          branches: this.getBrancheNamesById(seance.brancheIds).join(', ')
        }));

        // Initialize the table data
        if (previewData.length > 0) {
          this.displayedColumns = Object.keys(previewData[0]);
          this.previewData = new MatTableDataSource<ScheduleRow>(previewData);
        }

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

  /**
   * Parse the complex schedule CSV format
   * This method handles the specific university schedule format with days and time slots
   */
  parseScheduleCSV(csvContent: string): {
    seances: SeanceDTO[],
    salles: SalleDTO[],
    enseignants: EnseignantDTO[],
    branches: BrancheDTO[],
    tds: TDDTO[],
    tps: TPDTO[]
  } {
    const lines = csvContent.split('\n');
    const seances: SeanceDTO[] = [];

    // Maps to track unique entities
    const salleMap = new Map<string, SalleDTO>();
    const enseignantMap = new Map<string, EnseignantDTO>();
    const brancheMap = new Map<string, BrancheDTO>();
    const tdMap = new Map<string, TDDTO>();
    const tpMap = new Map<string, TPDTO>();

    // First row contains days of the week
    const daysRow = lines[0].split(',');

    // Second row contains time slots
    const timeRow = lines[1].split(',');

    // Process each room row
    for (let i = 2; i < lines.length; i += 3) {
      if (lines[i].trim() === '') continue;

      const roomRow = lines[i].split(',');
      const classesRow = lines[i+1]?.split(',') || [];
      const subjectsRow = lines[i+2]?.split(',') || [];

      // Get the room code from the first column
      const roomCode = roomRow[0].trim();

      // Add the room to our collection
      if (roomCode && !salleMap.has(roomCode)) {
        const roomId = salleMap.size + 1;
        salleMap.set(roomCode, {
          id: roomId,
          identifiant: roomCode,
          type: this.determineRoomType(roomCode),
          capacite: this.estimateRoomCapacity(roomCode),
          disponibilite: [],
          seanceIds: []
        });
      }

      // Process each cell in the row (each day/time combination)
      for (let j = 1; j < roomRow.length; j++) {
        // Skip empty cells
        if (!roomRow[j] || roomRow[j].trim() === '') continue;

        // Determine day and time from headers
        const dayIndex = Math.floor((j-1) / 6);
        const timeSlotIndex = (j-1) % 6;

        if (dayIndex >= daysRow.length || !daysRow[dayIndex]) continue;

        const jour = this.mapDayName(daysRow[dayIndex].trim());
        const timeSlot = timeRow[j].trim();

        // Parse time slot to get start and end times
        const [heureDebut, heureFin] = this.parseTimeSlot(timeSlot);

        // Extract class groups (branches)
        const classGroups = roomRow[j].split('|')[0].trim().split(',').map(g => g.trim());

        // Extract course info
        const courseInfo = subjectsRow[j] ? subjectsRow[j].trim() : 'Non spécifié';

        // Extract teacher info
        const teacherInfo = classesRow[j] ? classesRow[j].trim() : 'Non spécifié';

        // Process each class group for this session
        for (const groupName of classGroups) {
          if (!groupName) continue;

          // Add branch if it doesn't exist
          if (!brancheMap.has(groupName)) {
            const { niveau, specialite } = this.parseBrancheName(groupName);
            const brancheId = brancheMap.size + 1;

            brancheMap.set(groupName, {
              id: brancheId,
              niveau,
              specialite,
              nbTD: this.estimateTDCount(groupName),
              departement: this.determineDepartment(specialite),
              seanceIds: []
            });

            // Create TD groups for this branch
            for (let tdNum = 1; tdNum <= this.estimateTDCount(groupName); tdNum++) {
              const tdName = `${groupName}_TD${tdNum}`;
              const tdId = tdMap.size + 1;

              tdMap.set(tdName, {
                id: tdId,
                nb: tdNum,
                nbTP: this.estimateTPCount(groupName, tdNum),
                brancheId,
                tpIds: [],
                seanceIds: []
              });

              // Create TP groups for this TD
              for (let tpNum = 1; tpNum <= this.estimateTPCount(groupName, tdNum); tpNum++) {
                const tpName = `${tdName}_TP${tpNum}`;
                const tpId = tpMap.size + 1;

                tpMap.set(tpName, {
                  id: tpId,
                  nb: tpNum,
                  tdId,
                  etudiantIds: [],
                  seanceIds: []
                });

                // Update the TD with this TP
                const td = tdMap.get(tdName);
                if (td) {
                  td.tpIds.push(tpId);
                }
              }
            }
          }

          // Add teacher if doesn't exist
          if (!enseignantMap.has(teacherInfo)) {
            const enseignantId = enseignantMap.size + 1;
            const [nom, prenom] = this.parseTeacherName(teacherInfo);

            enseignantMap.set(teacherInfo, {
              id: enseignantId,
              cin: `E${enseignantId.toString().padStart(8, '0')}`,
              nom: nom || 'Nom',
              prenom: prenom || `Enseignant${enseignantId}`,
              email: `enseignant${enseignantId}@university.edu`,
              tel: `0${Math.floor(600000000 + Math.random() * 99999999)}`,
              adresse: 'Université',
              codeEnseignant: `ENS${enseignantId.toString().padStart(4, '0')}`,
              heures: 0,
              seanceIds: [],
              propositionIds: [],
              signalIds: []
            });
          }

          // Create a seance (session)
          const seanceId = seances.length + 1;
          const brancheId = brancheMap.get(groupName)?.id || 0;
          const salleId = salleMap.get(roomCode)?.id || 0;
          const enseignantId = enseignantMap.get(teacherInfo)?.id || 0;

          const seance: SeanceDTO = {
            id: seanceId,
            jour,
            heureDebut,
            heureFin,
            type: this.determineSessionType(courseInfo),
            matiere: this.parseCourseName(courseInfo),
            frequence: 'weekly',
            salleId,
            enseignantId,
            brancheIds: [brancheId],
            tdIds: [],
            tpIds: []
          };

          seances.push(seance);

          // Update related entities with this session
          if (salleMap.has(roomCode)) {
            const salle = salleMap.get(roomCode)!;
            salle.seanceIds.push(seanceId);
          }

          if (enseignantMap.has(teacherInfo)) {
            const enseignant = enseignantMap.get(teacherInfo)!;
            enseignant.seanceIds.push(seanceId);
            enseignant.heures += this.calculateSessionHours(heureDebut, heureFin);
          }

          if (brancheMap.has(groupName)) {
            const branche = brancheMap.get(groupName)!;
            branche.seanceIds.push(seanceId);
          }

          // Check if this is for specific TD or TP groups
          if (groupName.includes('_TD')) {
            const tdName = groupName.includes('_TP')
              ? groupName.substring(0, groupName.lastIndexOf('_TP'))
              : groupName;

            if (tdMap.has(tdName)) {
              const td = tdMap.get(tdName)!;
              td.seanceIds.push(seanceId);
              seance.tdIds.push(td.id);

              // If this is a TP session
              if (groupName.includes('_TP')) {
                if (tpMap.has(groupName)) {
                  const tp = tpMap.get(groupName)!;
                  tp.seanceIds.push(seanceId);
                  seance.tpIds.push(tp.id);
                }
              }
            }
          }
        }
      }
    }

    return {
      seances,
      salles: Array.from(salleMap.values()),
      enseignants: Array.from(enseignantMap.values()),
      branches: Array.from(brancheMap.values()),
      tds: Array.from(tdMap.values()),
      tps: Array.from(tpMap.values())
    };
  }

  /**
   * Helper methods for parsing the schedule data
   */

  // Parse time slot string like "08:30 - 10:00" into start and end times
  parseTimeSlot(timeSlot: string): [string, string] {
    const parts = timeSlot.split('-').map(part => part.trim());
    if (parts.length === 2) {
      return [parts[0], parts[1]];
    }
    return ['08:00', '10:00']; // Default if parsing fails
  }

  // Map French day names to standard format
  mapDayName(day: string): string {
    const dayMap: { [key: string]: string } = {
      'Lundi': 'Monday',
      'Mardi': 'Tuesday',
      'Mercredi': 'Wednesday',
      'Jeudi': 'Thursday',
      'Vendredi': 'Friday',
      'Samedi': 'Saturday',
      'Dimanche': 'Sunday'
    };
    return dayMap[day] || day;
  }

  // Parse branch/program name to extract level and specialization
  parseBrancheName(name: string): { niveau: string, specialite: string } {
    // Examples: L1_INFO, L2_TIC, L3_SE, etc.
    const parts = name.split('_');

    if (parts.length >= 2) {
      const levelCode = parts[0]; // L1, L2, L3, etc.
      const specialtyCode = parts[1]; // INFO, TIC, SE, etc.

      // Map level codes to descriptive levels
      const levelMap: { [key: string]: string } = {
        'L1': 'Licence 1',
        'L2': 'Licence 2',
        'L3': 'Licence 3',
        'M1': 'Master 1',
        'M2': 'Master 2',
        'CPI': 'Cycle Préparatoire Intégré',
        'ING': 'Ingénierie'
      };

      // Map specialty codes to full names
      const specialtyMap: { [key: string]: string } = {
        'INFO': 'Informatique',
        'TIC': 'Technologies de l\'Information et de la Communication',
        'SE': 'Systèmes Embarqués',
        'EEA': 'Électronique, Énergie électrique, Automatique',
        'MATH': 'Mathématiques',
        'MIM': 'Mathématiques et Informatique',
        'GL': 'Génie Logiciel',
        'EL': 'Électronique'
      };

      return {
        niveau: levelMap[levelCode] || levelCode,
        specialite: specialtyMap[specialtyCode] || specialtyCode
      };
    }

    return { niveau: 'Non spécifié', specialite: name };
  }

  // Determine department based on specialization
  determineDepartment(specialite: string): string {
    const deptMap: { [key: string]: string } = {
      'Informatique': 'Département Informatique',
      'Technologies de l\'Information et de la Communication': 'Département Informatique',
      'Systèmes Embarqués': 'Département Électronique',
      'Électronique, Énergie électrique, Automatique': 'Département Électronique',
      'Mathématiques': 'Département Mathématiques',
      'Mathématiques et Informatique': 'Département Mathématiques',
      'Génie Logiciel': 'Département Informatique',
      'Électronique': 'Département Électronique'
    };

    return deptMap[specialite] || 'Département Non spécifié';
  }

  // Estimate number of tutorial groups based on program name
  estimateTDCount(programName: string): number {
    if (programName.includes('_SEC')) {
      return 3; // Sections typically have 3 TD groups
    } else if (programName.startsWith('L1')) {
      return 5; // First year programs typically have more groups
    } else if (programName.startsWith('L2')) {
      return 4; // Second year
    } else if (programName.startsWith('L3')) {
      return 3; // Third year
    } else if (programName.startsWith('M')) {
      return 2; // Master programs have fewer groups
    }
    return 3; // Default
  }

  // Estimate number of practical groups per tutorial group
  estimateTPCount(programName: string, tdNumber: number): number {
    if (programName.includes('INFO') || programName.includes('TIC')) {
      return 2; // Computer science programs usually have more TP groups
    }
    return 2; // Default
  }

  // Parse teacher name from the CSV cell
  parseTeacherName(teacherInfo: string): [string, string] {
    // If it contains underscore, it might be structured
    if (teacherInfo.includes('_')) {
      const parts = teacherInfo.split('_');
      if (parts.length >= 2) {
        return [parts[1], parts[0]]; // Assuming format is firstname_lastname
      }
    }

    // Handle known prefixes like "ens_" or "tech_"
    if (teacherInfo.startsWith('ens_') || teacherInfo.startsWith('tech_')) {
      return ['', teacherInfo.substring(4)];
    }

    return ['', teacherInfo]; // Default case
  }

  // Parse course name from the CSV cell
  parseCourseName(courseInfo: string): string {
    // Remove prefixes like "CR-", "TD-", "TP-"
    let courseName = courseInfo;

    ['CR-', 'TD-', 'TP-', 'C.I-'].forEach(prefix => {
      if (courseName.startsWith(prefix)) {
        courseName = courseName.substring(prefix.length);
      }
    });

    // Remove time durations like "2h00-"
    const durationMatch = courseName.match(/^\d+[Hh]\d*-/);
    if (durationMatch) {
      courseName = courseName.substring(durationMatch[0].length);
    }

    // Remove prefix fractions like "1/15-"
    const fractionMatch = courseName.match(/^\d+\/\d+-/);
    if (fractionMatch) {
      courseName = courseName.substring(fractionMatch[0].length);
    }

    return courseName.trim();
  }

  // Determine session type (CR, TD, TP, etc.)
  determineSessionType(courseInfo: string): string {
    if (courseInfo.startsWith('CR-')) return 'CR'; // Cours
    if (courseInfo.startsWith('TD-')) return 'TD'; // Travaux Dirigés
    if (courseInfo.startsWith('TP-')) return 'TP'; // Travaux Pratiques
    if (courseInfo.startsWith('C.I-')) return 'CI'; // Cours Intégré
    if (courseInfo.includes('TD')) return 'TD';
    if (courseInfo.includes('TP')) return 'TP';

    return 'CR'; // Default
  }

  // Determine room type based on room code
  determineRoomType(roomCode: string): string {
    if (roomCode.startsWith('A-')) return 'Laboratoire';
    if (roomCode.startsWith('C-')) return 'Salle de cours';
    if (roomCode.startsWith('AMPHI')) return 'Amphithéâtre';
    return 'Salle standard';
  }

  // Estimate room capacity based on room code
  estimateRoomCapacity(roomCode: string): number {
    if (roomCode.startsWith('AMPHI')) return 150;
    if (roomCode.startsWith('A-')) return 30; // Labs usually have fewer places
    if (roomCode.startsWith('C-')) return 60;
    return 40; // Default capacity
  }

  // Calculate session duration in hours
  calculateSessionHours(start: string, end: string): number {
    try {
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);

      const startTime = startHour + startMin / 60;
      const endTime = endHour + endMin / 60;

      return Math.max(0, endTime - startTime);
    } catch {
      return 2; // Default to 2 hours if parsing fails
    }
  }

  // Helper methods to get entity names by ID for display
  getSalleNameById(id: number): string {
    const salle = this.salles.find(s => s.id === id);
    return salle ? salle.identifiant : 'Unknown';
  }

  getEnseignantNameById(id: number): string {
    const enseignant = this.enseignants.find(e => e.id === id);
    return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Unknown';
  }

  getBrancheNamesById(ids: number[]): string[] {
    return ids.map(id => {
      const branche = this.branches.find(b => b.id === id);
      return branche ? `${branche.niveau} ${branche.specialite}` : 'Unknown';
    });
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
      if (!seance.salleId) return;

      const key = `${seance.jour}_${seance.heureDebut}_${seance.heureFin}_${seance.salleId}`;
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
      if (!seance.enseignantId) return;

      const key = `${seance.jour}_${seance.heureDebut}_${seance.heureFin}_${seance.enseignantId}`;
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
    this.salles = [];
    this.enseignants = [];
    this.branches = [];
    this.tds = [];
    this.tps = [];
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
   * Download the converted data as JSON
   * Enhanced to include all entity types mapped from DTOs
   */
  downloadJson(): void {
    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.showError('No data available to download');
      return;
    }

    try {
      // Create a formatted JSON object with metadata and all entity collections
      const exportData: ExportData = {
        metadata: {
          fileName: this.file?.name || 'unknown',
          exportDate: this.currentDateTime,
          exportedBy: this.currentUser,
          generatedAt: new Date().toISOString()
        },
        salles: this.salles,
        enseignants: this.enseignants,
        branches: this.branches,
        tds: this.tds,
        tps: this.tps,
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

      this.showSuccess('Complete JSON file with all entity types downloaded successfully');
    } catch (error) {
      this.showError(`Error downloading JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save the complete schedule data to the system
   */
  saveSchedule(): void {
    if (!this.convertedSeances || this.convertedSeances.length === 0) {
      this.showError('No data to save');
      return;
    }

    this.isProcessing = true;
    this.processingProgress = 0;

    const exportData: ExportData = {
      metadata: {
        fileName: this.file?.name || 'unknown',
        exportDate: this.currentDateTime,
        exportedBy: this.currentUser,
        generatedAt: new Date().toISOString()
      },
      salles: this.salles,
      enseignants: this.enseignants,
      branches: this.branches,
      tds: this.tds,
      tps: this.tps,
      seances: this.convertedSeances
    };

    // Fixed the TypeScript error by ensuring the IDs are numbers
    // and making safe non-null assertions
    //   this.scheduleService.saveCompleteSchedule({
    //     ...exportData,
    //     salles: this.salles.map(s => ({ ...s, id: s.id || 0 })),
    //     enseignants: this.enseignants.map(e => ({ ...e, id: e.id || 0 })),
    //     branches: this.branches.map(b => ({ ...b, id: b.id || 0 })),
    //     tds: this.tds.map(td => ({ ...td, id: td.id || 0, brancheId: td.brancheId || 0 })),
    //     tps: this.tps.map(tp => ({ ...tp, id: tp.id || 0, tdId: tp.tdId || 0 })),
    //     seances: this.convertedSeances.map(s => ({
    //       ...s,
    //       id: s.id || 0,
    //       salleId: s.salleId || 0,
    //       enseignantId: s.enseignantId || 0
    //     }))
    //   }).subscribe({
    //     next: (response: { success: boolean; message: string }) => {
    //       this.isProcessing = false;
    //       this.processingProgress = 100;
    //
    //       if (response.success) {
    //         this.showSuccess(`Successfully saved complete schedule to the database.`);
    //
    //         // Record in import history
    //         this.addToImportHistory({
    //           id: Date.now(),
    //           fileName: this.file?.name || 'Unknown file',
    //           importDate: this.currentDateTime,
    //           status: 'Success',
    //           errors: [],
    //           totalRecords: this.convertedSeances.length + this.salles.length +
    //             this.enseignants.length + this.branches.length +
    //             this.tds.length + this.tps.length
    //         });
    //
    //         // Move to next step only on success
    //         this.stepper.next();
    //       } else {
    //         this.showError(`Failed to save schedule: ${response.message}`);
    //       }
    //     },
    //     error: (error: Error) => {
    //       this.isProcessing = false;
    //       this.processingProgress = 0;
    //       this.showError(`Error saving schedule: ${error.message || 'Unknown error'}`);
    //
    //       // Record failed attempt
    //       this.addToImportHistory({
    //         id: Date.now(),
    //         fileName: this.file?.name || 'Unknown file',
    //         importDate: this.currentDateTime,
    //         status: 'Failed',
    //         errors: [error.message || 'Unknown error'],
    //         totalRecords: 0
    //       });
    //     }
    //   });
    // }
  }
  /**
   * Map fields from CSV to DTO structure
   * This method is less relevant with the specialized parser but kept for compatibility
   */
  mapFields(): void {
    // With our specialized parser, most of the mapping is already done
    // This function is kept for backward compatibility
    this.showSuccess('Fields have been automatically mapped by the specialized parser');
    this.stepper.next();
  }

  /**
   * Helper method to get mapped value from row
   */
  private getMappedValue(row: any, mapping: { [key: string]: string }, targetField: string): string {
    const sourceField = Object.entries(mapping).find(([_, value]) => value === targetField)?.[0];
    return sourceField ? row[sourceField] || '' : '';
  }

  getCurrentDateTime(): string {
    // Update to use your provided date and time
    // For production, use below code to get actual time
    // Get current UTC time
    const now = new Date();

    // Format to YYYY-MM-DD HH:MM:SS
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return '2025-04-30 13:01:18'; // Use the provided date and time
  }

  // Toggle mapping form visibility
  toggleMappingForm(): void {
    this.showMappingForm = !this.showMappingForm;
  }
}
