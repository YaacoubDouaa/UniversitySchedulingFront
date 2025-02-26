import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import { ScheduleService } from '../schedule-service.service';
import { APP_CONSTANTS } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ActivitySelection {
  seance: Seance;
  day: string;
  time: string;
  niveau: string;
}

interface DeleteSelection {
  id: number;
  day: string;
  niveau: string;
  time: string;
}

@Component({
  selector: 'app-room-schedule',
  standalone: false,
  templateUrl: './room-schedule.component.html',
  styleUrls: ['./room-schedule.component.scss']
})
export class RoomScheduleComponent implements OnInit, OnDestroy {
  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-26 15:00:03';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Activity Management
   */
  selectedActivity: {
    seance: {
      id: number;
      name: string;
      type: "COURS" | "TD" | "TP" | string;
      professor: string;
      groupe: string;
      room: string;
      biWeekly: boolean;
    };
    day: string;
    time: string;
  } = {
    seance: {
      id: 0,
      name: '',
      type: '',
      professor: '',
      groupe: '',
      room: '',
      biWeekly: false,
    },
    day: '',
    time: ''
  };

  seanceToDelete: {
    id: number;
    day: string;
    group: string;
    time: string;
  } | null = null;

  /**
   * Constants
   */
  days = APP_CONSTANTS.DAYS;
  timeSlots = APP_CONSTANTS.TIME_SLOTS;
  niveaux = APP_CONSTANTS.GROUPS;
  readonly rooms: string[] = ['A101', 'A102', 'A103', 'B101', 'B102', 'B103'];

  /**
   * Component State
   */
  @Input() schedule: Schedule | null = null;
  selectedRoom: string = 'A101';
  selectedNiveau: string = 'ING1_INFO';
  selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  isLoading: boolean = false;

  /**
   * Modal States
   */
  showModal = false;
  showDeleteModal = false;

  /**
   * Error Handling
   */
  errorMessage = '';
  showError = false;

  /**
   * Subscription Management
   */
  private scheduleSubscription?: Subscription;
  rattrapageSchedule: RattrapageSchedule = {};

  constructor(
    private scheduleService: ScheduleService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  ngOnDestroy(): void {
    this.scheduleSubscription?.unsubscribe();
  }

  /**
   * Opens the add session modal
   * @param day Selected day
   * @param time Selected time slot
   */
  openAddModal(day: string, time: string): void {
    this.selectedActivity = {
      seance: {
        id:0,
        name: '',
        type: 'COURS',
        professor: '',
        groupe: this.selectedNiveau,
        room: this.selectedRoom,
        biWeekly: this.selectedFrequency === 'biweekly'
      },
      day,
      time
    };
    this.showModal = true;
    this.cdRef.detectChanges();
  }

  /**
   * Opens the edit session modal
   * @param seance Session to edit
   * @param day Day of the session
   * @param time Time slot of the session
   */
  openEditModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time
    };
    this.showModal = true;
    this.cdRef.detectChanges();
  }

  /**
   * Opens the delete confirmation modal
   * @param id Session ID
   * @param day Day of the session
   * @param group Group/Niveau
   * @param time Time slot
   */
  openDeleteModal(id: number, day: string, group: string, time: string): void {
    this.seanceToDelete = { id, day, group, time };
    this.showDeleteModal = true;
    this.cdRef.detectChanges();
  }

  /**
   * Closes the add/edit modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedActivity = {
      seance: {
        id: 0,
        name: '',
        type: '',
        professor: '',
        groupe: '',
        room: '',
        biWeekly: false,
      },
      day: '',
      time: ''
    };
    this.cdRef.detectChanges();
  }

  /**
   * Closes the delete confirmation modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.seanceToDelete = null;
    this.cdRef.detectChanges();
  }

  /**
   * Loads the room schedule
   */
  private loadSchedule(): void {
    this.isLoading = true;
    this.scheduleSubscription = this.scheduleService.getRoomSchedule(this.selectedRoom)
      .subscribe({
        next: (schedule: Schedule) => {
          this.schedule = schedule;
          this.cdRef.detectChanges();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading schedule:', error);
          this.showError = true;
          this.errorMessage = 'Failed to load schedule';
          this.isLoading = false;
          this.showSnackBar('Failed to load schedule', 'error');
        }
      });
  }

  /**
   * Handles room selection change
   */
  onRoomChange(): void {
    this.loadSchedule();
  }

  /**
   * Gets sessions for a specific time slot
   */
  getSessions(day: string, time: string, niveau: string): Seance[] {
    return this.schedule?.[day]?.[time]?.[niveau] || [];
  }

  /**
   * Saves a new session
   */
  saveAddChanges(): void {
    if (!this.validateSession()) return;

    const { day, time, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    this.isLoading = true;
    this.scheduleService.addSession(day, time, seance.groupe, seance)
      .subscribe({
        next: () => {
          this.showSnackBar('Session added successfully', 'success');
          this.closeModal();

          this.refreshData();
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to add session';
          this.isLoading = false;
          this.showSnackBar('Failed to add session: ' + this.errorMessage, 'error');
        }
      });
  }

  /**
   * Saves changes to an existing session
   */
  saveEditChanges(): void {
    if (!this.validateSession()) return;

    const { day, time, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    this.isLoading = true;
    this.scheduleService.updateSession(day, time, seance.groupe, seance)
      .subscribe({
        next: () => {
          this.showSnackBar('Session updated successfully', 'success');
          this.closeModal();
         this.refreshData();        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to update session';
          this.isLoading = false;
          this.showSnackBar('Failed to update session: ' + this.errorMessage, 'error');
        }
      });
  }

  /**
   * Confirms and executes session deletion
   */
  confirmDelete(): void {
    if (!this.seanceToDelete) {
      this.showSnackBar('No session selected for deletion', 'error');
      return;
    }

    const { id, day, time } = this.seanceToDelete;

    this.isLoading = true;
    this.scheduleService.deleteSession(day, time, this.seanceToDelete.group, id)
      .subscribe({
        next: () => {
          this.showSnackBar('Session deleted successfully', 'success');
          this.closeDeleteModal();
          this.refreshData();
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to delete session';
          this.isLoading = false;
          this.showSnackBar('Failed to delete session: ' + this.errorMessage, 'error');
        }
      });
  }

  /**
   * Validates session data before saving
   */
  private validateSession(): boolean {
    if (!this.selectedActivity) {
      this.showSnackBar('No session data provided', 'error');
      return false;
    }

    const { seance } = this.selectedActivity;

    if (!seance.name) {
      this.showSnackBar('Session name is required', 'error');
      return false;
    }

    if (!seance.professor) {
      this.showSnackBar('Professor name is required', 'error');
      return false;
    }

    if (!seance.type) {
      this.showSnackBar('Session type is required', 'error');
      return false;
    }

    if (!seance.room) {
      this.showSnackBar('Room is required', 'error');
      return false;
    }

    return true;
  }

  /**
   * Shows a snackbar message
   * @param message Message to display
   * @param type Type of message (success/error)
   */
  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [`${type}-snackbar`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Gets current date and time
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Gets current user
   */
  getCurrentUser(): string {
    return this.currentUser;
  }
  /**
   * Refresh data after changes
   */
  private refreshData(): void {
    // Refresh schedule
    this.loadSchedule();

    // Force UI update
    this.cdRef.detectChanges();
  }


  getCourseIcon(type: string): string {
    switch (type) {
      case 'COURS': return 'book';
      case 'TD': return 'edit-3';
      case 'TP': return 'monitor';
      default: return 'circle';
    }
  }
}
