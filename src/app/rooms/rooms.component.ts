import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';
import { SalleList, SalleSchedule } from '../models/Salle';
import { Seance } from '../models/Seance';
import { RoomService } from '../rooms.service';
import {Subscription} from 'rxjs';
import {RattrapageService} from '../rattrapage.service';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  // Constants for scheduling
  readonly days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly types = ['COURS', 'TD', 'TP', 'SEMINAIRE'];
  rattrapageSchedule: RattrapageSchedule = {};
  private subscriptions = new Subscription();
  // Component state
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  selectedNiveau: string = '';
  private selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  showModal: boolean = false;
  protected showAddModal: boolean = false;

  // Data structures
  salles: SalleList = {};
  salleSchedule: Schedule = this.initializeEmptySchedule();

  // Currently selected activity for modal operations
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
    niveau?: string;
  } | null = null;

  constructor(
    private router: Router,
    private salleScheduleService: ScheduleService,
    private injector: Injector,
    private roomService: RoomService,
    private rattrapageService:RattrapageService
  ) {}

  /**
   * Initialize component and fetch room data
   */
  ngOnInit(): void {
    this.initializeRoomService();
    this.loadRoomData();
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
   * Initialize empty schedule structure
   */
  private initializeEmptySchedule(): Schedule {
    return this.days.reduce((acc, day) => ({
      ...acc,
      [day]: {}
    }), {});
  }

  /**
   * Initialize room service using injector
   */
  private initializeRoomService(): void {
    this.roomService = this.injector.get(RoomService);
  }

  /**
   * Load room data from service
   */
  private loadRoomData(): void {
    this.roomService.getSalles().subscribe({
      next: (sallesList: SalleList) => {
        this.salles = sallesList;
        console.log('Rooms loaded:', this.salles);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }


  /**
   * Handle room selection
   */
  onSelectSalle(salleSchedule: Schedule): void {
    this.salleScheduleService.changeSchedule(salleSchedule);
    this.salleSchedule = salleSchedule;
    this.router.navigate(['/room-schedule']);
  }

  /**
   * Get color coding for room availability
   */
  getSalleColor(salle: string, day: string, time: string): string {
    return this.isSalleAvailable(salle, day, time)
      ? '#d4edda'  // Available - Green
      : '#f8d7da'; // Occupied - Red
  }

  /**
   * Filter rooms by type
   */
  shouldDisplaySalle(salle: any): boolean {
    if (!this.selectedType) return true;
    return salle.type === this.selectedType;
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
    this.showModal = true;
  }

  /**
   * Save new session
   */
  saveAddChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance, niveau } = this.selectedActivity;
      if (niveau) {
        this.roomService.addSeance(day, time, niveau, seance);
        this.showModal = false;
        this.selectedActivity = null;
      }
    }
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
    this.showModal = true;
  }

  /**
   * Save edited session
   */
  saveEditChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance, niveau } = this.selectedActivity;
      if (niveau) {
        this.roomService.editSeance(day, time, niveau, seance, 0);
        this.showModal = false;
        this.selectedActivity = null;
      }
    }
  }

  /**
   * Open modal for deleting session
   */
  openDeleteModal(seance: Seance, day: string, time: string, niveau: string): void {
    this.selectedActivity = { seance, day, time, niveau };
    this.showModal = true;
  }

  /**
   * Confirm session deletion
   */
  saveDeleteChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance, niveau } = this.selectedActivity;
      if (niveau) {
        this.roomService.deleteSeance(day, time, niveau, seance);
        this.showModal = false;
        this.selectedActivity = null;
      }
    }
  }

  /**
   * Close modal dialog
   */
  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showModal = false;
    this.selectedActivity = null;
  }

  /**
   * Open modal for viewing session details
   */
  openViewModal(salle: string, day: string, time: string, niveau: string): void {
    const sessions = this.salles[salle]?.schedule[day]?.[niveau]?.[time];
    if (sessions?.length) {
      console.log('Sessions for selected time slot:', sessions);
    } else {
      console.log('No sessions found for the selected time slot.');
    }
  }
  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-25 03:34:19';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Gets all sessions (regular and makeup) for a specific room, day, and time
   * @param salle - Room name
   * @param day - Day of the week
   * @param time - Time slot
   * @returns Array of sessions for the specified parameters
   */
  getSessions(salle: string, day: string, time: string): Seance[] {
    try {
      // Get regular sessions
      const regularSessionsMap = this.salles?.[salle]?.schedule?.[day]?.[time] || {};
      const regularSessions: Seance[] = Object.values(regularSessionsMap)
        .flat()
        .filter(Boolean);

      // Get makeup sessions
      const rattrapageSessions: Seance[] = this.rattrapageSchedule?.[day]?.[time]?.filter(
        (session: Seance) => session.room === salle
      ) || [];

      // Combine and return all sessions
      return [...regularSessions, ...rattrapageSessions];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }



  /**
   * Check if a room is available (including rattrapage sessions)
   */
  isSalleAvailable(salle: string, day: string, time: string): boolean {
    const regularSessions = this.salles[salle]?.schedule[day]?.[time];
    const rattrapageSessions = this.rattrapageSchedule[day]?.[time]?.some(
      session => session.room === salle
    );

    return !(regularSessions || rattrapageSessions);
  }

  // Add to existing ngOnDestroy or create it if it doesn't exist
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Validate session data
   */
  private validateSession(seance: Seance): boolean {
    return !!(seance.name && seance.room && seance.professor && seance.groupe);
  }

  protected readonly Object = Object;
}
