import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfList } from '../models/Professors';
import { Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import { ProfessorsService } from '../professors.service';

@Component({
  selector: 'app-professors',
  standalone: false,
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit, OnDestroy {
  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-24 23:11:43';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Constants
   */
  readonly days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly times: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly types: string[] = ['COURS', 'TD', 'TP'];
  readonly niveaux: string[] = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];

  /**
   * Component State
   */
  profs: ProfList = {};
  selectedProf: string = '';
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  isLoading: boolean = false;

  /**
   * Modal State
   */
  showModal: boolean = false;
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
    niveau: string;
  } | null = null;

  /**
   * Subscriptions
   */
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private professorsService: ProfessorsService
  ) {}

  ngOnInit(): void {
    this.loadProfessors();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
        },
        error: (error) => {
          console.error('Error loading professors:', error);
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Check professor availability
   */
  isProfAvailable(profCode: string, day: string, time: string): boolean {
    return this.professorsService.isTimeSlotAvailable(
      this.profs[profCode]?.schedule || {},
      day,
      time
    );
  }

  /**
   * Get cell color based on availability
   */
  getProfColor(profCode: string, day: string, time: string, niveau: string): string {
    return this.isProfAvailable(profCode, day, time) ?
      'bg-green-100 dark:bg-green-900/30' :
      'bg-red-100 dark:bg-red-900/30';
  }

  /**
   * Navigate to professor schedule
   */
  viewProfSchedule(profCode: string): void {
    this.subscriptions.add(
      this.professorsService.getProfessorSchedule(profCode).subscribe(schedule => {
        if (schedule) {
          this.router.navigate(['/prof-schedule', profCode]);
        }
      })
    );
  }

  /**
   * Modal Management - Add
   */
  openAddModal(day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: {
        id: Math.floor(Math.random() * 1000000),
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
    this.showModal = true;
  }

  /**
   * Save new session
   */
  saveAddChanges(): void {
    if (!this.selectedActivity || !this.selectedProf) return;

    const { day, time, niveau, seance } = this.selectedActivity;

    this.subscriptions.add(
      this.professorsService.addSession(
        this.selectedProf,
        day,
        niveau,
        time,
        seance
      ).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProfessors();
        },
        error: (error) => {
          console.error('Error adding session:', error);
        }
      })
    );
  }

  /**
   * Modal Management - Edit
   */
  openEditModal(seance: Seance, day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance: { ...seance },
      day,
      time,
      niveau
    };
    this.showModal = true;
  }

  /**
   * Modal Management - Delete
   */
  openDeleteModal(seance: Seance, day: string, time: string, niveau: string): void {
    this.selectedActivity = {
      seance,
      day,
      time,
      niveau
    };
    this.showModal = true;
  }

  /**
   * Delete session
   */
  saveDeleteChanges(): void {
    if (!this.selectedActivity || !this.selectedProf) return;

    const { day, time, niveau, seance } = this.selectedActivity;

    this.subscriptions.add(
      this.professorsService.removeSession(
        this.selectedProf,
        day,
        niveau,
        time,
        seance.id
      ).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProfessors();
        },
        error: (error) => {
          console.error('Error deleting session:', error);
        }
      })
    );
  }

  /**
   * Modal Management - Close
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedActivity = null;
  }

  /**
   * View session details
   */
  viewSessionDetails(profCode: string, day: string, time: string, niveau: string): void {
    const prof = this.profs[profCode];
    if (prof?.schedule[day]?.[niveau]?.[time]) {
      // Handle viewing session details
      console.log('Session details:', prof.schedule[day][niveau][time]);
    }
  }

  /**
   * Get system state
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }

  protected readonly Object = Object;
}
