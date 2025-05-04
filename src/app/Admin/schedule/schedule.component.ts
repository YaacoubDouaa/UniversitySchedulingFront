import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, startWith, map } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Seance } from '../../models/Seance';
import {RattrapageSchedule, Schedule} from '../../models/Schedule';
import {RattrapageService} from '../../Services/PropositionDeRattrapageService/rattrapage.service';
import {ScheduleService} from '../../Services/ScheduleService/schedule-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {APP_CONSTANTS} from '../../initialData/constants';


/**
 * Schedule Management Component
 * Handles the display and management of both regular and makeup sessions
 * Integrates with ScheduleService and RattrapageService for data management
 */
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
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  standalone:false,
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ScheduleComponent implements OnInit, OnDestroy {
  /**
   * System State Configuration
   * Stores current system time and user information
   */
  private readonly currentDateTime = '2025-02-24 20:42:07';
  protected readonly currentUser = 'YaacoubDouaa';

  /**
   * Schedule Configuration
   * Basic setup for schedule display
   */
  days = APP_CONSTANTS.DAYS;
  timeSlots = APP_CONSTANTS.TIME_SLOTS;
  groupOptions = APP_CONSTANTS.GROUPS;
  salleOPtions=APP_CONSTANTS.ROOMS

  /**
   * UI State Management
   * Controls visibility and state of UI components
   */
  showModal = false;

  showDeleteModal = false;
  showTD = true;
  showTP = true;
  selectedGroup = '';
  displayedGroup: string[] = [];
  fullText = 'Schedule Manager';
  displayText = '';

  /**
   * Schedule State Management
   * Maintains the current state of regular and makeup schedules
   */
  private scheduleSubscription?: Subscription;
  private rattrapageSubscription?: Subscription;
  private schedule: Schedule = {};
  private rattrapageSchedule: RattrapageSchedule = {};
  private idCounter = 20;

  /**
   * Activity Management
   * Handles currently selected or targeted activities
   */
    // Initialize selected activity with default values
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
  nameOptions: string[] = APP_CONSTANTS.SESSIONS;
  roomOptions: string[] = APP_CONSTANTS.ROOMS;
  typeOptions: string[] = APP_CONSTANTS.SESSION_TYPES;
  frequencyOptions: string[] =APP_CONSTANTS.FREQUENCIES;
  profOptions: string[] = APP_CONSTANTS.PROFS;

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

  /**
   * Component Constructor
   * Initializes services and sets up initial state
   */
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
    this.filteredNames = this.nameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.nameOptions))
    );

    this.filteredRooms = this.roomControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.roomOptions))
    );

    this.filteredTypes = this.typeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.typeOptions))
    );

    this.filteredFrequency = this.frequencyControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.frequencyOptions))
    );

    this.filteredProf = this.professorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.profOptions))
    );

  }


  /**
   * Lifecycle Hooks
   * Handle component initialization and cleanup
   */
  ngOnInit(): void {

    this.initializeSubscriptions();
    this.animateText();
    // Initial data load
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.scheduleSubscription?.unsubscribe();

  }

  /**
   * Initialize Service Subscriptions
   * Sets up data streams from services
   */
  private initializeSubscriptions(): void {
    this.scheduleSubscription = this.scheduleService.currentSchedule
      .subscribe(schedule => {
        this.schedule = schedule;
      });

    this.rattrapageSubscription = this.rattrapageService.getRattrapageSchedule()
      .subscribe(schedule => {
        this.rattrapageSchedule = schedule;
      });
  }

  selectedRoom='';


  /**
   * Title Animation
   * Animates the display of the component title
   */
  private animateText(): void {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayText = this.fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Modal Management Methods
   * Handle the opening, closing, and state management of modals
   */
  openAddModal(day: string, time: string): void {
    this.selectedActivity = {
      seance: {
        name: '',
        id: 0,
        room: '',
        type: 'COURS',
        professor: '',
        groupe: this.selectedGroup,
        biWeekly: false
      },
      day,
      time
    };
    this.showModal = true;

  }

  openEditModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time
    };
    this.selectedFrequency = seance.biWeekly ? 'biweekly' : 'weekly';
    this.showModal = true;
  }

  closeModal(): void {

    this.selectedActivity ={
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
    } ;
    this.showModal = false;

  }

  /**
   * Save new session with validation and warning messages
   */
  saveAddChanges(): void {
    // Validation checks with specific error messages
    if (!this.selectedActivity || !this.selectedGroup) {
      // Show warning message for missing group
      if (!this.selectedGroup) {
        this.showWarningMessage('Please select a group before adding a session.');
        return;
      }

      // Show warning message for missing activity details
      if (!this.selectedActivity) {
        this.showWarningMessage('Please fill in session details before saving.');
        return;
      }
      return;
    }

    // Validate required fields
    const { day, time, seance } = this.selectedActivity;
    if (!seance.name || !seance.professor || !seance.type) {
      this.showWarningMessage('Please fill in all required fields (Name, Professor, Type).');
      return;
    }

    // Proceed with save if validation passes
    seance.biWeekly = this.selectedFrequency === 'biweekly';
    seance.id = ++this.idCounter;
    seance.groupe = this.selectedGroup;

    this.scheduleService.addSession(day,  this.selectedGroup,time, seance)
      .subscribe({
        next: (success) => {
          if (success) {
            // Show success message

            // this.showSuccessMessage('Session added successfully!');
            this.refreshData();
            console.log('Session successfully added');
            this.closeModal();
          }
        },
        error: (error) => {
          // Show error message
          this.showErrorMessage('Failed to add session. Please try again.');
          console.error('Error adding session:', error);
        }
      });
  }

  /**
   * Warning message display
   * Add these methods to your component
   */
  private showWarningMessage(message: string): void {
    // Using MatSnackBar (if you're using Angular Material)
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

  }

  /**
   * Success message display
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Error message display
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Save edited session with validation and warning messages
   */
  saveEditChanges(): void {
    // Validate selected activity exists
    if (!this.selectedActivity) {
      this.showWarningMessage('No session selected for editing.');
      return;
    }

    const { day, time, seance } = this.selectedActivity;

    // Validate required fields
    if (!seance.name || !seance.professor || !seance.type || !seance.groupe) {
      this.showWarningMessage('Please fill in all required fields (Name, Professor, Type, Group).');
      return;
    }

    // Set frequency
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    // Update session
    this.scheduleService.updateSession(day, time, seance.groupe,seance)
      .subscribe({
        next: (success) => {
          if (success) {
            // Show success message
             this.showSuccessMessage('Session updated successfully!');

            // Get latest schedule
            this.scheduleService.getSchedule().subscribe(schedule => {
              this.schedule = { ...schedule };
              this.cdRef.detectChanges();
            });

            this.closeModal();
          }
        },
        error: (error) => {
          // Show error message
          this.showErrorMessage('Failed to update session. Please try again.');
          console.error('Error updating session:', error);
        },
        complete: () => {
          // Force refresh
          this.cdRef.detectChanges();
        }
      });
  }
  /**
   * Delete Management Methods
   * Handle deletion of schedule entries
   */
  openDeleteModal(id: number, day: string, group: string, time: string): void {
    this.showDeleteModal = true;
    this.seanceToDelete = { id, day, group, time };
  }

  confirmDelete(): void {
    if (!this.seanceToDelete) return;

    const { id, day, group, time } = this.seanceToDelete;

    this.scheduleService.deleteSession(day, time, group, id)
      .subscribe({
        next: () => {
          this.refreshData();
          this.closeDeleteModal();
        },

      });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.seanceToDelete = null;
  }

  getFilteredSchedule(): { [day: string]: { [time: string]: Seance[] | null } } {
    const filteredSchedule: { [day: string]: { [time: string]: Seance[] | null } } = {};

    // Always ensure selectedGroup is considered when filtering
    let displayGroups = this.getDisplayedGroup();

    // IMPORTANT FIX: Always include the current selected group
    if (this.selectedGroup && !displayGroups.includes(this.selectedGroup)) {
      displayGroups = [...displayGroups, this.selectedGroup];
    }

    // Debug logging to help track issues
    console.debug('Filtering schedule for groups:', displayGroups);

    // Process regular schedule
    this.days.forEach(day => {
      filteredSchedule[day] = {};

      // Check if there are entries for this day
      if (this.schedule[day]) {
        // List groups found in day's schedule
        const availableGroups = Object.keys(this.schedule[day]);
        console.debug(`Day ${day} has groups:`, availableGroups);

        // Filter normal sessions
        availableGroups.forEach(group => {
          // Check if this group should be displayed
          if (displayGroups.includes(group)) {
            const timeSlots = Object.keys(this.schedule[day][group] || {});

            timeSlots.forEach(time => {
              const seances = this.schedule[day][group][time];
              if (seances && seances.length > 0) {
                // Initialize array if needed
                if (!filteredSchedule[day][time]) {
                  filteredSchedule[day][time] = [];
                }

                // Add each seance that should be shown
                seances.forEach(seance => {
                  if (this.shouldShowSeance(seance)) {
                    filteredSchedule[day][time]!.push({
                      ...seance,
                      isRattrapage: false
                    });
                  }
                });
              }
            });
          }
        });
      }

      // Process rattrapage sessions (unchanged)
      if (this.rattrapageSchedule[day]) {
        Object.entries(this.rattrapageSchedule[day]).forEach(([time, seances]) => {
          if (!filteredSchedule[day][time]) {
            filteredSchedule[day][time] = [];
          }

          seances.forEach(seance => {
            if (this.shouldShowSeance(seance) && seance.groupe === this.selectedGroup) {
              filteredSchedule[day][time]!.push({
                ...seance,
                isRattrapage: true,
                name: `[Rattrapage] ${seance.name}`
              });
            }
          });
        });
      }
    });

    return filteredSchedule;
  }

  /**
   * Helper Methods
   * Utility functions for schedule management
   */
  private shouldShowSeance(seance: Seance): boolean {
    return (
      (this.showTD && seance.type === 'TD') ||
      (this.showTP && seance.type === 'TP') ||
      seance.type === 'COURS'
    );
  }

  private _filter(value: string | null, options: string[]): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Group Management Methods
   * Handle group filtering and display
   */
  getDisplayedGroup(): string[] {
    const groups: string[] = [];

    // Handle specific known groups with special rules
    switch (this.selectedGroup) {
      case 'ING1_INFO_TD1 || ING1_INFO_TD2':
        groups.push('ING1_INFO_TD1 || ING1_INFO_TD2');
        break;
      case 'ING1_INFO_TD1':
        groups.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
      case 'ING1_INFO_TD2':
        groups.push('ING1_INFO_TD2', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
      case 'ING1_INFO':
        groups.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
      default:
        // IMPORTANT: Always include the currently selected group
        // This ensures any group can be displayed if selected
        if (this.selectedGroup) {
          groups.push(this.selectedGroup);
        }
        break;
    }

    return groups;
  }
  getActivityColor(biWeekly: boolean | undefined): string {
    return biWeekly ? '#B0B8C7' : 'transparent';
  }

  getCourseIcon(type: string): string {
    switch (type) {
      case 'COURS': return 'book';
      case 'TD': return 'edit-3';
      case 'TP': return 'monitor';
      default: return 'circle';
    }
  }

  /**
   * Navigation Methods
   */
  navigateToView(): void {
    this.router.navigate(['/view']);
  }

  /**
   * Getters and System State Methods
   */
  get sessionName(): string {
    return this.selectedActivity?.seance?.name || '';
  }

  get sessionId(): number | undefined {
    return this.selectedActivity?.seance?.id;
  }

  getCurrentDateTime(): string {
    return this.currentDateTime; // Returns: 2025-02-24 20:44:58
  }

  getCurrentUser(): string {
    return this.currentUser; // Returns: YaacoubDouaa
  }



  /**
   * Refresh data after changes
   */
  private refreshData(): void {
    console.log('refreshData() called');
    // Refresh schedule
    this.initializeSubscriptions();
    this.showSuccessMessage('Session added successfully!');
    // Force UI update
    this.cdRef.detectChanges();

  }

  onRoomChange() {

  }
}
