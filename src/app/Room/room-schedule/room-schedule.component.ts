import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { RattrapageSchedule, Schedule } from '../../models/Schedule';
import { Seance } from '../../models/Seance';
import { ScheduleService } from '../../Services/ScheduleService/schedule-service.service';
import { APP_CONSTANTS } from '../../initialData/constants';
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
  private readonly currentDateTime = '2025-05-02 18:07:41';
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
  rooms = APP_CONSTANTS.ROOMS;
  typeOptions = ['COURS', 'TD', 'TP'];
  roomOptions = APP_CONSTANTS.ROOMS;

  /**
   * Component State
   */
  @Input() schedule: Schedule = {}; // Initialize as empty object instead of null
  selectedRoom: string = '101';
  selectedNiveau: string = 'ING1_INFO';
  selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  isLoading: boolean = false;
  showTP: boolean = true;
  showTD: boolean = true;

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
    console.log('Component initializing...');
    this.selectedRoom = this.scheduleService.getCurrentSalleName();
    console.log('Initial selected room:', this.selectedRoom);
    this.loadSchedule();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.scheduleSubscription) {
      this.scheduleSubscription.unsubscribe();
    }
  }

  /**
   * Opens the add session modal with a properly initialized new session
   * @param day Selected day
   * @param time Selected time slot
   */
  openAddModal(day: string, time: string): void {
    console.log('Opening add modal for day:', day, 'time:', time);

    // Explicitly create a brand new session object with ID=0
    this.selectedActivity = {
      seance: {
        id: 0, // Ensure this is explicitly 0 for new sessions
        name: '',
        type: 'COURS',
        professor: '',
        groupe: this.selectedNiveau,
        room: this.selectedRoom,
        biWeekly: false // Default to weekly
      },
      day,
      time
    };

    // Reset the frequency selector
    this.selectedFrequency = 'weekly';

    this.showModal = true;
    this.cdRef.detectChanges();
    console.log('Add modal opened with:', this.selectedActivity);
  }

  /**
   * Opens the edit session modal
   * @param seance Session to edit
   * @param day Day of the session
   * @param time Time slot of the session
   */
  openEditModal(seance: Seance, day: string, time: string): void {
    console.log('Opening edit modal for session:', seance);

    // Create a deep copy to avoid direct reference modification
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time
    };

    // Set the frequency based on the session's biWeekly property
    this.selectedFrequency = seance.biWeekly ? 'biweekly' : 'weekly';

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
    console.log('Opening delete modal for session ID:', id);
    this.seanceToDelete = { id, day, group, time };
    this.showDeleteModal = true;
    this.cdRef.detectChanges();
  }

  /**
   * Closes the add/edit modal
   */
  closeModal(): void {
    this.showModal = false;
    this.showDeleteModal = false;
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
   * Loads the room schedule with proper subscription management
   * and filtering for the selected room
   */
  private loadSchedule(): void {
    // Clear any existing subscription first to prevent memory leaks
    if (this.scheduleSubscription) {
      this.scheduleSubscription.unsubscribe();
    }

    this.isLoading = true;
    console.log('Loading schedule for room:', this.selectedRoom);

    // Get the full schedule from the service
    this.scheduleSubscription = this.scheduleService.getSchedule()
      .subscribe({
        next: (completeSchedule: Schedule) => {
          console.log('Complete schedule received:', completeSchedule);

          // If the complete schedule is empty, show error and exit
          if (!completeSchedule || Object.keys(completeSchedule).length === 0) {
            console.error('Received empty schedule from service');
            this.showError = true;
            this.errorMessage = 'No schedule data available';
            this.isLoading = false;
            this.schedule = {};
            this.cdRef.detectChanges();
            return;
          }

          // Filter the schedule for the selected room
          const roomSchedule: Schedule = {};

          // Process each day in the schedule
          Object.keys(completeSchedule).forEach(day => {
            // Process each group in that day
            Object.keys(completeSchedule[day] || {}).forEach(group => {
              // Process each time slot
              Object.keys(completeSchedule[day][group] || {}).forEach(timeSlot => {
                const sessions = completeSchedule[day][group][timeSlot] || [];

                // Filter for sessions in this room
                const roomSessions = sessions.filter(seance =>
                  seance.room === this.selectedRoom);

                console.log(`Day: ${day}, Group: ${group}, Time: ${timeSlot}, Sessions: ${sessions.length}, Room sessions: ${roomSessions.length}`);

                if (roomSessions.length > 0) {
                  if (!roomSchedule[day]) {
                    roomSchedule[day] = {};
                  }

                  if (!roomSchedule[day][group]) {
                    roomSchedule[day][group] = {};
                  }

                  roomSchedule[day][group][timeSlot] = roomSessions;
                }
              });
            });
          });

          console.log('Filtered room schedule:', roomSchedule);

          // Update the component's schedule data with the filtered schedule
          this.schedule = roomSchedule;
          this.isLoading = false;

          // Force UI update
          this.cdRef.detectChanges();
          console.log('Schedule loaded successfully for room:', this.selectedRoom);
        },
        error: (error: Error) => {
          console.error('Error loading schedule:', error);
          this.showError = true;
          this.errorMessage = 'Failed to load schedule: ' + (error.message || 'Unknown error');
          this.isLoading = false;
          this.schedule = {}; // Initialize with empty object instead of leaving as undefined
          this.showSnackBar('Failed to load schedule', 'error');
          this.cdRef.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
  }

  /**
   * Gets filtered schedule based on selected options
   */
  getFilteredSchedule(): Schedule {
    return this.schedule || {};
  }

  /**
   * Handles room selection change and syncs with service
   */
  onRoomChange(): void {
    console.log('Room changed to:', this.selectedRoom);

    // Update the service's salle name
    this.scheduleService.changeSalleName(this.selectedRoom);

    // Update the room in any currently selected activity
    if (this.selectedActivity && this.showModal) {
      this.selectedActivity.seance.room = this.selectedRoom;
    }

    this.loadSchedule();
  }

  /**
   * Gets the current salle name from the service
   * @returns The current salle name
   */
  getCurrentSalleName(): string {
    return this.scheduleService.getCurrentSalleName();
  }

  /**
   * Gets sessions for a specific time slot with improved error handling
   * @param day Day of the week
   * @param time Time slot
   * @param niveau Academic level/group
   * @returns Array of sessions for the specified parameters
   */
  getSessions(day: string, time: string, niveau: string): Seance[] {
    // Comment out some of the verbose logging to reduce console noise
    // console.log('getSessions called with:', { day, time, niveau });

    if (!this.schedule) {
      console.log('Schedule is null or undefined');
      return [];
    }

    if (!this.schedule[day]) {
      console.log(`Day "${day}" not found in schedule. Available days:`, Object.keys(this.schedule));
      return [];
    }

    if (!this.schedule[day][niveau]) {
      console.log(`Niveau "${niveau}" not found for day "${day}". Available niveaux:`,
        Object.keys(this.schedule[day]));
      return [];
    }

    const sessions = this.schedule[day][niveau][time] || [];
    // console.log(`Found ${sessions.length} sessions for ${day}, ${time}, ${niveau}`);
    return sessions;
  }

  /**
   * Saves a new session with improved error handling and refresh
   */
  saveAddChanges(): void {
    if (!this.validateSession()) return;

    const { day, time, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    // Always ensure room is set correctly
    seance.room = this.selectedRoom;

    this.isLoading = true;
    this.scheduleService.addSession(day, seance.groupe, time, seance)
      .subscribe({
        next: (success) => {
          if (success) {
            this.showSnackBar('Session added successfully', 'success');
            this.closeModal();
            this.refreshData();
          } else {
            // Handle case where operation returned false
            this.showError = true;
            this.errorMessage = 'Failed to add session - operation unsuccessful';
            this.isLoading = false;
            this.showSnackBar('Failed to add session', 'error');
          }
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to add session';
          this.isLoading = false;
          this.showSnackBar('Failed to add session: ' + this.errorMessage, 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Saves changes to an existing session with improved error handling
   */
  saveEditChanges(): void {
    if (!this.validateSession()) return;

    const { day, time, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    // Always ensure room is set correctly
    seance.room = this.selectedRoom;

    this.isLoading = true;
    this.scheduleService.updateSession(day, time, seance.groupe, seance)
      .subscribe({
        next: (success) => {
          if (success) {
            this.showSnackBar('Session updated successfully', 'success');
            this.closeModal();
            this.refreshData();
          } else {
            // Handle case where operation returned false
            this.showError = true;
            this.errorMessage = 'Failed to update session - operation unsuccessful';
            this.isLoading = false;
            this.showSnackBar('Failed to update session', 'error');
          }
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to update session';
          this.isLoading = false;
          this.showSnackBar('Failed to update session: ' + this.errorMessage, 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Confirms and executes session deletion with improved error handling
   */
  confirmDelete(): void {
    if (!this.seanceToDelete) {
      this.showSnackBar('No session selected for deletion', 'error');
      return;
    }

    const { id, day, group, time } = this.seanceToDelete;

    this.isLoading = true;
    this.scheduleService.deleteSession(day, time, group, id)
      .subscribe({
        next: (success) => {
          if (success) {
            this.showSnackBar('Session deleted successfully', 'success');
            this.closeModal();
            this.refreshData();
          } else {
            this.showError = true;
            this.errorMessage = 'Failed to delete session - operation unsuccessful';
            this.isLoading = false;
            this.showSnackBar('Failed to delete session', 'error');
          }
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to delete session';
          this.isLoading = false;
          this.showSnackBar('Failed to delete session: ' + this.errorMessage, 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Validates session data before saving
   * @returns boolean indicating if validation passed
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

    if (!seance.groupe) {
      this.showSnackBar('Group is required', 'error');
      return false;
    }

    if (!seance.room) {
      seance.room = this.selectedRoom; // Set default room if missing
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
   * @returns Formatted date time string
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Gets current user
   * @returns Current user's login
   */
  getCurrentUser(): string {
    return this.currentUser;
  }

  /**
   * Improved refresh data method with proper timing
   */
  private refreshData(): void {
    console.log('Refreshing data...');

    // Clear any stale errors
    this.showError = false;
    this.errorMessage = '';

    // Use setTimeout to ensure service has time to update internal state
    setTimeout(() => {
      this.loadSchedule();
    }, 100);
  }

  /**
   * Gets the icon for a course type
   * @param type Course type (COURS, TD, TP)
   * @returns Icon name for the specified course type
   */
  getCourseIcon(type: string): string {
    switch (type) {
      case 'COURS': return 'book';
      case 'TD': return 'edit-3';
      case 'TP': return 'monitor';
      default: return 'circle';
    }
  }

  /**
   * Navigate to view page
   */
  navigateToView(): void {
    console.log('Navigating to view page...');
    // Implement navigation logic here
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
   * Determine if a button should display or not
   */
  displayText = 'Room Schedule Manager';
}
