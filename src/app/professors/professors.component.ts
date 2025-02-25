import {Component, OnInit, OnDestroy, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfList } from '../models/Professors';
import {RattrapageSchedule, Schedule} from '../models/Schedule';
import { Seance } from '../models/Seance';
import { ProfessorsService } from '../professors.service';
import {RattrapageService} from '../rattrapage.service';

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
  rattrapageSchedule: RattrapageSchedule = {};
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
  selectedNiveau: string='';
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
    private professorsService: ProfessorsService,
    private rattrapageService: RattrapageService,private injector:Injector
  ) {}

  ngOnInit(): void {
    this.professorsService=this.injector.get(ProfessorsService);
    this.rattrapageService=this.injector.get(RattrapageService);
    this.loadProfessors();
    this.loadRattrapageSchedule();
  }

  /**
   * Load rattrapage schedule
   */
  private loadRattrapageSchedule(): void {
    this.subscriptions.add(
      this.rattrapageService.getRattrapageSchedule().subscribe({
        next: (schedule) => {
          this.rattrapageSchedule = schedule;
        },
        error: (error) => {
          console.error('Error loading rattrapage schedule:', error);
        }
      })
    );
  }
  /**
   * Check professor availability (updated to include rattrapage sessions)
   */
  isProfAvailable(profCode: string, day: string, time: string): boolean {
    const regularAvailability = this.professorsService.isTimeSlotAvailable(
      this.profs[profCode]?.schedule || {},
      day,
      time
    );

    // Check rattrapage sessions
    const hasRattrapageSession = this.rattrapageSchedule[day]?.[time]?.some(
      session => session.professor === profCode
    );

    return regularAvailability && !hasRattrapageSession;
  }


  /**
   * View session details (corrected to properly handle schedule structure)
   */
  viewSessionDetails(profCode: string, day: string, time: string): Seance[] {
    // Get regular sessions from all niveau time slots
    const regularSessions: Seance[] = [];
    const profSchedule = this.profs[profCode]?.schedule[day] || {};

    // Iterate over each niveau in the schedule
    Object.values(profSchedule).forEach(niveauSchedule => {
      if (niveauSchedule[time]) {
        regularSessions.push(...niveauSchedule[time]);
      }
    });

    // Get rattrapage sessions
    const rattrapageSessions = this.rattrapageSchedule[day]?.[time]?.filter(
      session => session.professor === profCode ||
        session.professor === this.profs[profCode]?.name
    ) || [];

    const allSessions = [...regularSessions, ...rattrapageSessions];

    if (allSessions.length > 0) {
      console.log('All sessions:', allSessions);
      // You can also return or process the sessions here
      return allSessions;
    } else {
      console.log('No sessions found for this time slot.');
      return [];
    }
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
   * Get system state
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }

  protected readonly Object = Object;

  saveEditChanges() {

  }
  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'cours': return 'session-type-cours';
      case 'td': return 'session-type-td';
      case 'tp': return 'session-type-tp';
      default: return 'bg-gray-100 text-gray-800';
    }
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
