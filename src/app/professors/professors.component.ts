import { Component, OnInit, OnDestroy, Injector, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfList } from '../models/Professors';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import { ProfessorsService } from '../professors.service';
import { RattrapageService } from '../rattrapage.service';
import { ScheduleService } from '../schedule-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  standalone: false,
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit, OnDestroy {
  // Schedule Management
  private profScheduleSubscription?: Subscription;
  profSchedule: Schedule = {};
  selectedSessions: Seance[] = [];
  showSessionDetails = false;

  // System Configuration
  private readonly currentDateTime = '2025-02-26 14:14:47';
  private readonly currentUser = 'YaacoubDouaa';
  rattrapageSchedule: RattrapageSchedule = {};

  // Constants
  readonly days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly times: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly types: string[] = ['COURS', 'TD', 'TP'];
  readonly niveaux: string[] = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];

  // Component State
  profs: ProfList = {};
  selectedProf: string = '';
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  selectedNiveau: string = '';
  selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  isLoading: boolean = false;

  // Modal State
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
    niveau: string;
  } | null = null;

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private professorsService: ProfessorsService,
    private rattrapageService: RattrapageService,
    private scheduleService: ScheduleService,
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
    private snackBar:MatSnackBar
  ) {}

  /**
   * Initialize component and load required data
   */
  ngOnInit(): void {
    this.professorsService = this.injector.get(ProfessorsService);
    this.rattrapageService = this.injector.get(RattrapageService);
    this.scheduleService = this.injector.get(ScheduleService);
    this.loadProfessors();
    this.initializeSubscriptions();
    this.loadRattrapageSchedule();
  }

  /**
   * Initialize service subscriptions
   */
  private initializeSubscriptions(): void {
    this.profScheduleSubscription = this.scheduleService.currentSchedule
      .subscribe(schedule => {
        this.profSchedule = schedule;
        this.refreshView();
      });
  }

  /**
   * Load rattrapage schedule data
   */
  private loadRattrapageSchedule(): void {
    this.subscriptions.add(
      this.rattrapageService.getRattrapageSchedule().subscribe({
        next: (schedule) => {
          this.rattrapageSchedule = schedule;
          this.refreshView();
        },
        error: (error) => {
          console.error('Error loading rattrapage schedule:', error);
        }
      })
    );
  }

  /**
   * Check if professor is available for a given time slot
   */
  isProfAvailable(profCode: string, day: string, time: string): boolean {
    // Check regular schedule
    const regularSchedule = this.profs[profCode]?.schedule || {};
    const hasRegularSession = Object.values(regularSchedule[day] || {}).some(
      niveauSchedule => niveauSchedule[time]?.length > 0
    );

    // Check rattrapage schedule
    const hasRattrapageSession = this.rattrapageSchedule[day]?.[time]?.some(
      session => session.professor === profCode
    );

    return !hasRegularSession && !hasRattrapageSession;
  }
  /**
   * Handle prof selection
   */
  onSelectProf(profSchedule: Schedule): void {
    this.scheduleService.changeSchedule(profSchedule);
    this.profSchedule = profSchedule;
    this.router.navigate(['/room-schedule']);
  }
  /**
   * View session details for a specific time slot
   */
  viewSessionDetails(profCode: string, day: string, time: string): void {
    this.selectedSessions = [];

    // Get regular sessions
    const regularSessions: Seance[] = [];
    const profSchedule = this.profs[profCode]?.schedule[day] || {};

    Object.entries(profSchedule).forEach(([niveau, timeSlots]) => {
      if (timeSlots[time]) {
        regularSessions.push(...timeSlots[time].map(session => ({
          ...session,
          niveau,
          isRegular: true
        })));
      }
    });

    // Get rattrapage sessions
    const rattrapageSessions = (this.rattrapageSchedule[day]?.[time] || [])
      .filter(session => session.professor === profCode)
      .map(session => ({
        ...session,
        isRattrapage: true
      }));

    this.selectedSessions = [...regularSessions, ...rattrapageSessions];
    this.showSessionDetails = true;
    this.refreshView();
  }

  /**
   * Open modal for adding new session
   */
  openAddModal(day: string, time: string, niveau: string): void {
    if (!this.selectedProf) {
      console.error('No professor selected');
      return;
    }

    this.selectedActivity = {
      seance: {
        id: Math.floor(Math.random() * 1000000),
        name: '',
        room: '',
        type: 'COURS',
        professor: this.selectedProf,
        groupe: niveau,
        biWeekly: this.selectedFrequency === 'biweekly'
      },
      day,
      time,
      niveau
    };
    this.showModal = true;
    this.refreshView();
  }

  /**
   * Save new session
   */
  /**
   * Save new session with error handling and user feedback
   */
  saveAddChanges(): void {
    // Form validation
    if (!this.selectedActivity || !this.selectedProf) {
      this.snackBar.open('Please select a professor and fill in all required fields', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top'
      });
      return;
    }

    const { day, time, niveau, seance } = this.selectedActivity;

    // Validate required fields
    if (!seance.name || !seance.room || !seance.type || !seance.groupe) {
      this.snackBar.open('Please fill in all required fields (Name, Room, Type, and Niveau)', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top'
      });
      return;
    }

    // Update seance with current values
    seance.biWeekly = this.selectedFrequency === 'biweekly';
    seance.professor = this.selectedProf;

    // Loading state
    this.isLoading = true;

    // Add session to professor's schedule
    this.subscriptions.add(
      this.professorsService.addSession(
        this.selectedProf,
        day,
        niveau,
        time,
        seance
      ).subscribe({
        next: () => {
          // Success handling
          this.snackBar.open('Session added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          this.loadProfessors(); // Reload professors data
          this.viewSessionDetails(this.selectedProf, day, time); // Refresh view
          this.refreshView();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          // Error handling
          this.isLoading = false;
          let errorMessage = 'An error occurred while adding the session';

          // Handle specific error cases
          if (error.status === 409) {
            errorMessage = 'This time slot is already occupied';
          } else if (error.status === 400) {
            errorMessage = 'Invalid session data provided';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to add sessions';
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          console.error('Error adding session:', error);
          this.refreshView();
        }
      })
    );
  }

  /**
   * Close modal and reset state
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedActivity = null;
    this.showSessionDetails = false;
    this.refreshView();
  }

  /**
   * Get CSS class for session type
   */
  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'td':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'tp':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  /**
   * Get icon for session type
   */
  getCourseIcon(type: string): string {
    switch (type.toUpperCase()) {
      case 'COURS': return 'book';
      case 'TD': return 'edit-3';
      case 'TP': return 'monitor';
      default: return 'circle';
    }
  }

  /**
   * Get current date and time
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Get current user
   */
  getCurrentUser(): string {
    return this.currentUser;
  }

  /**
   * Load professors data
   */
  private loadProfessors(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.professorsService.getProfs().subscribe({
        next: (profList: ProfList) => {
          this.profs = profList;
          this.isLoading = false;
          this.refreshView();
        },
        error: (error) => {
          console.error('Error loading professors:', error);
          this.isLoading = false;
          this.refreshView();
        }
      })
    );
  }



  /**
   * Refresh view using ChangeDetectorRef
   */
  private refreshView(): void {  // Refresh schedule
    this.initializeSubscriptions();
    // Force UI update
    this.cdRef.detectChanges();
  }

  /**
   * Cleanup subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.profScheduleSubscription) {
      this.profScheduleSubscription.unsubscribe();
    }
  }

  protected readonly Object = Object;
}
