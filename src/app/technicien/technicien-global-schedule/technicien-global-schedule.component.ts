import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Schedule, RattrapageSchedule } from '../../models/Schedule';
import { Seance } from '../../models/Seance';
import {ScheduleService} from '../../Services/ScheduleService/schedule-service.service';
import {RattrapageService} from '../../Services/PropositionDeRattrapageService/rattrapage.service';
import {NotificationService} from '../../Admin/NotificationService/notifications.service';
import {APP_CONSTANTS} from '../../initialData/constants';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FeatherModule} from 'angular-feather';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';
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
@Component({ selector: 'app-technicien-global-schedule',
  standalone: false,

  templateUrl: './technicien-global-schedule.component.html',
  styleUrl: './technicien-global-schedule.component.css',

  // Animation for smooth transitions
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class TechnicienGlobalScheduleComponent  implements OnInit {
  schedule: Schedule | null = null;
  rattrapageSchedule: RattrapageSchedule | null = null;
  showRattrapage = false;
  idCounter = 20;
  /**
   * Autocomplete Options
   * Predefined options for form inputs
   */
  nameOptions: string[] = APP_CONSTANTS.SESSIONS;
  roomOptions: string[] = APP_CONSTANTS.ROOMS;
  typeOptions: string[] = APP_CONSTANTS.SESSION_TYPES;
  frequencyOptions: string[] = APP_CONSTANTS.FREQUENCIES;
  profOptions: string[] = APP_CONSTANTS.PROFS;
  groupOptions = APP_CONSTANTS.GROUPS;
  days = APP_CONSTANTS.DAYS;
  timeSlots = APP_CONSTANTS.TIME_SLOTS;
  currentDate = APP_CONSTANTS.CURRENT_DATE;
  currentUser = APP_CONSTANTS.CURRENT_USER;
  allRooms: string[] = [];

  isLoading = false;
  error: string | null = null;
  /**
   * UI State Management
   * Controls visibility and state of UI components
   */
  showModal = false;

  showDeleteModal = false;

  /**
   * Activity Management
   * Handles currently selected or targeted activities
   */
    // Initialize selected activity with default values
  selectedActivity: {
    seance: {
      id: number,
      name: string,
      type: "COURS" | "TD" | "TP" | string,
      professor: string,
      groupe: string,
      room: string,
      biWeekly: boolean,
      // Add any other required Seance properties with default values
    },
    day: string,
    time: string
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


  constructor(
    private scheduleService: ScheduleService,
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
  }

  /**
   * Initialize component and load data
   */
  ngOnInit(): void {
    this.loadSchedule();
    this.loadRattrapageSchedule();
    this.updateCurrentTime();
  }

  /**
   * Updates current time every second
   */
  private updateCurrentTime(): void {
    setInterval(() => {
      const now = new Date();
      this.currentDate = this.formatDateTime(now);
    }, 1000);
  }


  loadRattrapageSchedule(): void {
    this.rattrapageService.getRattrapageSchedule().subscribe({
      next: (schedule) => {
        this.rattrapageSchedule = schedule;
        this.extractUniqueRooms();
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.notificationService.showError('Failed to load makeup schedule');
      }
    });
  }

  /**
   * Extracts unique rooms from schedule data
   */
  private extractUniqueRooms(): void {
    const roomSet = new Set<string>();

    // Extract from regular schedule
    if (this.schedule) {
      Object.values(this.schedule).forEach(daySchedule => {
        Object.values(daySchedule).forEach(groupSchedule => {
          Object.values(groupSchedule).forEach(timeSlotSessions => {
            timeSlotSessions.forEach(session => {
              if (session.room) {
                roomSet.add(session.room);
              }
            });
          });
        });
      });
    }

    // Extract from rattrapage schedule
    if (this.rattrapageSchedule) {
      Object.values(this.rattrapageSchedule).forEach(daySchedule => {
        Object.values(daySchedule).forEach(sessions => {
          sessions.forEach(session => {
            if (session.room) {
              roomSet.add(session.room);
            }
          });
        });
      });
    }

    this.allRooms = Array.from(roomSet).sort();
  }

  /**
   * Gets all sessions for a specific room, day, and time slot
   */
  getSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    return this.showRattrapage
      ? this.getRattrapageSessionsForRoom(room, day, timeSlot)
      : this.getRegularSessionsForRoom(room, day, timeSlot);
  }

  private getRegularSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    if (!this.schedule?.[day]) return [];

    const sessions: Seance[] = [];
    Object.entries(this.schedule[day]).forEach(([group, groupSchedule]) => {
      if (groupSchedule[timeSlot]) {
        sessions.push(...groupSchedule[timeSlot].filter(session =>
          session.room === room
        ));
      }
    });
    return sessions;
  }

  private getRattrapageSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    if (!this.rattrapageSchedule?.[day]?.[timeSlot]) return [];
    return this.rattrapageSchedule[day][timeSlot].filter(session =>
      session.room === room
    );
  }

  // ... Continue in the next part due to length limitations ...


  /**
   * Formats date to YYYY-MM-DD HH:MM:SS
   */
  private formatDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }

  /**
   * Loads schedule data from service
   */
  loadSchedule(): void {
    this.isLoading = true;
    this.scheduleService.getSchedule().subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.extractUniqueRooms();
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load schedule';
        this.isLoading = false;
        this.notificationService.showError(error.message);
        this.cdRef.detectChanges();
      }
    });
  }


  /**
   * Gets all courses for a specific time slot
   */
  getAllCoursesForSlot(day: string, timeSlot: string): Seance[] {
    if (!this.schedule?.[day]) return [];

    const courses: Seance[] = [];
    Object.keys(this.schedule[day]).forEach(group => {
      const groupSchedule = this.schedule![day][group];
      if (groupSchedule?.[timeSlot]) {
        groupSchedule[timeSlot].forEach(course => {
          courses.push({
            ...course,
            groupe: group
          });
        });
      }
    });
    return courses;
  }


  /**
   * Returns appropriate icon for course type
   */
  getCourseIcon(type: string): string {
    switch (type) {
      case 'COURS':
        return 'book';
      case 'TD':
        return 'edit-3';
      case 'TP':
        return 'monitor';
      default:
        return 'circle';
    }
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
   * Modal Management Methods
   * Handle the opening, closing, and state management of modals
   */


  openEditModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = {
      seance: {...seance},
      day,
      time
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.selectedActivity = {
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
    this.showModal = false;

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

    const {day, time, seance} = this.selectedActivity;
    // Update session
    this.scheduleService.updateSession(day, time, seance.groupe, seance)
      .subscribe({
        next: (success) => {
          if (success) {
            // Show success message
            this.showSuccessMessage('Session updated successfully!');

            // Get latest schedule
            this.scheduleService.getSchedule().subscribe(schedule => {
              this.schedule = {...schedule};
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
   * Refresh data after changes
   */
  private refreshData(): void {
    // Refresh schedule
    this.loadSchedule();
    this.loadRattrapageSchedule();
    // Force UI update
    this.cdRef.detectChanges();
  }

}
