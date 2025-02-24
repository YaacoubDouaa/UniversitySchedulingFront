import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';
import { SalleList, SalleSchedule } from '../models/Salle';
import { Seance } from '../models/Seance';
import { RoomService } from '../rooms.service';

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
    private roomService: RoomService
  ) {}

  /**
   * Initialize component and fetch room data
   */
  ngOnInit(): void {
    this.initializeRoomService();
    this.loadRoomData();
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
   * Check if a room is available at a specific time
   */
  isSalleAvailable(salle: string, day: string, time: string, niveau: string): boolean {
    const salleData = this.salles[salle];
    if (!salleData?.schedule) return true;

    return !(salleData.schedule[day]?.[niveau]?.[time]?.length > 0);
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
  getSalleColor(salle: string, day: string, time: string, niveau: string): string {
    return this.isSalleAvailable(salle, day, time, niveau)
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
   * Get sessions for a specific time slot
   */
  getSessions(salle: string, day: string, time: string, niveau: string): Seance[] {
    return this.salles[salle]?.schedule[day]?.[niveau]?.[time] || [];
  }

  /**
   * Validate session data
   */
  private validateSession(seance: Seance): boolean {
    return !!(seance.name && seance.room && seance.professor && seance.groupe);
  }

  protected readonly Object = Object;
}
