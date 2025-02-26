import {ChangeDetectorRef, Component} from '@angular/core';
import {Seance} from '../models/Seance';
import {RattrapageSchedule, Schedule} from '../models/Schedule';
import {Subscription} from 'rxjs';
import {ScheduleService} from '../schedule-service.service';
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
  selector: 'app-prof-schedule',
  standalone: false,
  templateUrl: './prof-schedule.component.html',
  styleUrl: './prof-schedule.component.css'
})
export class ProfScheduleComponent {
  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-24 22:30:32';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Constants
   */
  readonly days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly niveaux: string[] = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];
  readonly rooms: string[] = ['A101', 'A102', 'A103', 'B101', 'B102', 'B103'];

  /**
   * Component State
   */
  profSchedule: Schedule | null = null;
  selectedRoom: string = 'A101';
  selectedNiveau: string = 'ING1_INFO';
  selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  isLoading: boolean = false;

  /**
   * Modal States
   */
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  /**
   * Error Handling
   */
  errorMessage = '';
  showError = false;

  /**
   * Selected Items
   */
  selectedActivity: ActivitySelection | null = null;
  seanceToDelete: DeleteSelection | null = null;

  /**
   * Subscription Management
   */
  private scheduleSubscription?: Subscription;
  rattrapageSchedule: RattrapageSchedule = {};
  constructor(private scheduleService: ScheduleService,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  ngOnDestroy(): void {
    this.scheduleSubscription?.unsubscribe();
  }

  /**
   * Schedule Loading and Management
   */
  private loadSchedule(): void {
    this.isLoading = true;
    this.scheduleSubscription = this.scheduleService.getRoomSchedule(this.selectedRoom)
      .subscribe({
        next: (schedule: Schedule) => {
          this.profSchedule = schedule;
          this.cdRef.detectChanges(); // Manually trigger view update
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading schedule:', error);
          this.showError = true;
          this.errorMessage = 'Failed to load schedule';
          this.isLoading = false;
        }
      });
  }

  onRoomChange(): void {
    this.loadSchedule();
  }

  /**
   * Session Management
   */
  getSessions(day: string, time: string, niveau: string): Seance[] {
    if (!this.profSchedule?.[day]?.[time]?.[niveau]) {
      return [];
    }
    return this.profSchedule[day][time][niveau];
  }


  /**
   * Modal Management
   */
  openAddModal(day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: {
        id: Math.floor(Math.random() * 1000000),
        name: '',
        room: this.selectedRoom,
        type: 'COURS',
        professor: '',
        groupe: niveau,
        biWeekly: this.selectedFrequency === 'biweekly'
      },
      day,
      time,
      niveau
    };
    this.showAddModal = true;
    this.showError = false;
  }

  openEditModal(seance: Seance, day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time,
      niveau
    };
    this.selectedFrequency = seance.biWeekly ? 'biweekly' : 'weekly';
    this.showEditModal = true;
    this.showError = false;
  }

  openDeleteModal(id: number, day: string, niveau: string, time: string): void {
    this.seanceToDelete = { id, day, niveau, time };
    this.showDeleteModal = true;
    this.showError = false;
  }

  /**
   * Save Operations
   */
  saveAddChanges(): void {
    if (!this.selectedActivity) return;

    const { day, time, niveau, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    this.isLoading = true;
    this.scheduleService.addSession(day, time, niveau, seance)
      .subscribe({
        next: () => {
          this.closeAddModal();
          this.loadSchedule();
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to add session';
          this.isLoading = false;
        }
      });
  }

  saveEditChanges(): void {
    if (!this.selectedActivity) return;

    const { day, time, niveau, seance } = this.selectedActivity;
    seance.biWeekly = this.selectedFrequency === 'biweekly';

    this.isLoading = true;
    this.scheduleService.updateSession(day, time, niveau, seance)
      .subscribe({
        next: () => {
          this.closeEditModal();
          this.loadSchedule();
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to update session';
          this.isLoading = false;
        }
      });
  }

  confirmDelete(): void {
    if (!this.seanceToDelete) return;

    const { id, day, niveau, time } = this.seanceToDelete;

    this.isLoading = true;
    this.scheduleService.deleteSession(day, time, niveau, id)
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadSchedule();
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to delete session';
          this.isLoading = false;
        }
      });
  }

  /**
   * Modal Close Handlers
   */
  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedActivity = null;
    this.showError = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedActivity = null;
    this.showError = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.seanceToDelete = null;
    this.showError = false;
  }

  closeModal(): void {
    this.closeAddModal();
    this.closeEditModal();
    this.closeDeleteModal();
  }

  /**
   * System State Getters
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }
}
