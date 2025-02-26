import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {Router} from '@angular/router';
import {ScheduleService} from '../schedule-service.service';
import {RattrapageService} from '../rattrapage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
/**
 * Interface for seance deletion
 */
interface SeanceToDelete {
  id: number;
  day: string;
  group: string;
  time: string;
}
@Component({
  selector: 'app-edit-modal',
  standalone: false,

  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent {
  selectedActivity:  {
    seance: {
      id: number,
      name: string,
      type:  "COURS" | "TD" | "TP" | string,
      professor: string,
      groupe: string,
      room: string,
      biWeekly: boolean,
      // Add any other required Seance properties with default values
    },
    day: string,
    time:string
  } = {
    seance: {
      id: 0,
      name: '',
      type: '',
      professor: '',
      groupe: '',
      room: '',
      biWeekly: false,
      // Add any other required Seance properties with default values
    },
    day: '',
    time: ''
  };

  /**
   * Form Controls
   * Manages form inputs for session creation/editing
   */
  nameControl = new FormControl('');
  roomControl = new FormControl('');
  typeControl = new FormControl('');
  professorControl = new FormControl('');
  frequencyControl = new FormControl('');
  selectedFrequency = '';


  /**
   * Reset selected activity to default state
   */
  resetSelectedActivity(): void {
    this.selectedActivity = {
      seance: {
        id: 0,
        name: '',
        type: '',
        professor: '',
        groupe: '',
        room: '',
        biWeekly: false
      },
      day: '',
      time: ''
    };
  }
  seanceToDelete: {
    id: number;
    day: string;
    group: string;
    time: string;
  } | null = null;
  /**
   * Helper method to set seance for deletion
   */
  setSeanceToDelete(seance: SeanceToDelete): void {
    this.seanceToDelete = seance;
  }

  /**
   * Helper method to reset deletion state
   */
  resetSeanceToDelete(): void {
    this.seanceToDelete = null;
    /**
     * Form Controls
     * Manages form inputs for session creation/editing
     */
    let nameControl = new FormControl('');
    let roomControl = new FormControl('');
    let typeControl = new FormControl('');
    let professorControl = new FormControl('');
    let frequencyControl = new FormControl('');
    let selectedFrequency = '';
  }
  /**
   * Autocomplete Options
   * Predefined options for form inputs
   */
  nameOptions: string[] = ['Math Class', 'History Class', 'Physics Class', 'Chemistry Class'];
  roomOptions: string[] = ['A-101', 'A-102', 'A-201', 'B-101'];
  typeOptions: string[] = ['COURS', 'TD', 'TP'];
  frequencyOptions: string[] = ['biweekly', 'weekly'];
  profOptions: string[] = ['prof1', 'prof2', 'prof3'];

  /**
   * Filtered Observables
   * Handles autocomplete filtering for form inputs
   */
  filteredNames: Observable<string[]> = this.createFilteredObservable(this.nameOptions);
  filteredRooms: Observable<string[]> = this.createFilteredObservable(this.roomOptions);
  filteredTypes: Observable<string[]> = this.createFilteredObservable(this.typeOptions);
  filteredFrequency: Observable<string[]> = this.createFilteredObservable(this.frequencyOptions);
  filteredProf: Observable<string[]> = this.createFilteredObservable(this.profOptions);
  /**
   * Creates a filtered observable for autocomplete
   * @param options Array of options to filter from
   * @returns Observable of filtered strings
   */
  private createFilteredObservable(options: string[]): Observable<string[]> {
    return new Observable<string[]>(subscriber => {
      subscriber.next(options);
      subscriber.complete();
    });
  }
  constructor(
    private router: Router,
    private scheduleService: ScheduleService,
    private rattrapageService: RattrapageService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar, // Add this
  ) {
    this.initializeFilteredObservables();
  }

  /**
   * Initialize filtered observables for autocomplete inputs
   */
  private initializeFilteredObservables(): void {


  }

 @Input() closeModal(): void {


  }

@Input() saveAddChanges(): void {

}

  @Input() saveEditChanges(): void {

  }
@Input() showModal: boolean | undefined;
}
