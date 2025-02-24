import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import { ScheduleService } from '../schedule-service.service';

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
  styleUrls: ['./room-schedule.component.css']
})
export class RoomScheduleComponent implements OnInit, OnDestroy {
  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-24 21:01:30';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Constants
   */
  readonly days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly niveaux: string[] = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];

  /**
   * Component State
   */
  salleSchedule: Schedule | null = null;
  selectedNiveau: string = 'ING1_INFO';
  private selectedFrequency: 'weekly' | 'biweekly' = 'weekly';

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

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  ngOnDestroy(): void {
    this.scheduleSubscription?.unsubscribe();
  }

  /**
   * Load schedule data from service
   */
  private loadSchedule(): void {
    this.scheduleSubscription = this.scheduleService.currentDisponibilite
      .subscribe({
        next: (schedule: Schedule) => {
          this.salleSchedule = schedule;
        },
        error: (error: Error) => {
          console.error('Error loading schedule:', error);
          this.showError = true;
          this.errorMessage = 'Failed to load schedule';
        }
      });
  }

  /**
   * Get sessions for a specific time slot
   */
  getSessions(day: string, time: string, niveau: string): Seance[] {
    return this.scheduleService.getSessionsForTimeSlot(day, time, niveau);
  }

  /**
   * Check if a session can be added to a time slot
   */
  canAddSession(day: string, time: string, niveau: string, isBiweekly: boolean): boolean {
    return this.scheduleService.canAddSession(day, time, niveau, isBiweekly);
  }

  /**
   * Open modal for adding new session
   */
  openAddModal(day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: {
        id: Math.random(),
        name: '',
        room: '',
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

  /**
   * Save new session
   */
  saveAddChanges(): void {
    if (!this.selectedActivity) return;

    const { day, time, niveau, seance } = this.selectedActivity;

    this.scheduleService.addSession(day, time, niveau, seance)
      .subscribe({
        next: () => {
          this.closeAddModal();
          this.loadSchedule(); // Refresh data
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to add session';
        }
      });
  }

  /**
   * Open modal for editing session
   */
  openEditModal(seance: Seance, day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time,
      niveau
    };
    this.showEditModal = true;
    this.showError = false;
  }

  /**
   * Save edited session
   */
  saveEditChanges(): void {
    if (!this.selectedActivity) return;

    const { day, time, niveau, seance } = this.selectedActivity;

    this.scheduleService.updateSession(day, time, niveau, seance)
      .subscribe({
        next: () => {
          this.closeEditModal();
          this.loadSchedule(); // Refresh data
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to update session';
        }
      });
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(id: number, day: string, niveau: string, time: string): void {
    this.seanceToDelete = { id, day, niveau, time };
    this.showDeleteModal = true;
  }

  /**
   * Confirm and process deletion
   */
  confirmDelete(): void {
    if (!this.seanceToDelete) return;

    const { id, day, niveau, time } = this.seanceToDelete;

    this.scheduleService.deleteSession(day, time, niveau, id)
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadSchedule(); // Refresh data
        },
        error: (error: Error) => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to delete session';
        }
      });
  }

  /**
   * Modal close handlers
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

  /**
   * System state getters
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }



}
