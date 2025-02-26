import { Component, OnInit, Inject, Injector } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Seance } from '../models/Seance';
import { Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';

@Component({
  selector: 'app-global-schedule',
  templateUrl: './global-schedule.component.html',
  styleUrls: ['./global-schedule.component.css'],
  standalone: false,
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
export class GlobalScheduleComponent implements OnInit {
  // Schedule data and configuration
  schedule: Schedule | null = null;
  days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  allRooms: string[] = []; // Stores unique room names

  // User and time information
  currentDate: string = '2025-02-26 01:16:27';
  currentUser: string = 'YaacoubDouaa';

  // UI state management
  selectedTimeSlot: { day: string; time: string } | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private scheduleService: ScheduleService,
    private injector: Injector
  ) {}

  /**
   * Initialize component and load data
   */
  ngOnInit(): void {
    this.loadSchedule();
    this.updateCurrentTime();
    this.extractUniqueRooms();
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

  /**
   * Formats date to YYYY-MM-DD HH:MM:SS
   */
  private formatDateTime(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Loads schedule data from service
   */
  loadSchedule(): void {
    this.isLoading = true;
    this.error = null;

    // Lazy injection of the service
    this.scheduleService = this.injector.get(ScheduleService);

    this.scheduleService.getSchedule().subscribe({
      next: (schedule: Schedule) => {
        this.schedule = schedule;
        this.extractUniqueRooms();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load schedule';
        this.isLoading = false;
        console.error('Schedule loading error:', error);
      }
    });
  }

  /**
   * Extracts unique rooms from schedule data
   */
  private extractUniqueRooms(): void {
    if (!this.schedule) return;

    const roomSet = new Set<string>();

    // Iterate through all schedule data to find unique rooms
    this.days.forEach(day => {
      Object.keys(this.schedule![day] || {}).forEach(group => {
        this.timeSlots.forEach(timeSlot => {
          const sessions = this.schedule![day][group]?.[timeSlot] || [];
          sessions.forEach(session => {
            if (session.room) {
              roomSet.add(session.room);
            }
          });
        });
      });
    });

    // Sort rooms alphabetically
    this.allRooms = Array.from(roomSet).sort();
  }

  /**
   * Gets all sessions for a specific room, day, and time slot
   */
  getSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    if (!this.schedule?.[day]) return [];

    const sessions: Seance[] = [];
    Object.keys(this.schedule[day]).forEach(group => {
      const groupSchedule = this.schedule![day][group];
      if (groupSchedule?.[timeSlot]) {
        sessions.push(...groupSchedule[timeSlot].filter(session =>
          session.room === room
        ));
      }
    });
    return sessions;
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
   * Toggles time slot details visibility
   */
  toggleTimeSlotDetails(day: string, timeSlot: string): void {
    if (this.isTimeSlotSelected(day, timeSlot)) {
      this.selectedTimeSlot = null;
    } else {
      this.selectedTimeSlot = { day, time: timeSlot };
    }
  }

  /**
   * Checks if a time slot is currently selected
   */
  isTimeSlotSelected(day: string, timeSlot: string): boolean {
    return this.selectedTimeSlot?.day === day && this.selectedTimeSlot?.time === timeSlot;
  }

  /**
   * Gets unique session types for a time slot
   */
  getUniqueSessionTypes(day: string, timeSlot: string): string[] {
    const sessions = this.getAllCoursesForSlot(day, timeSlot);
    return Array.from(new Set(sessions.map(session => session.type)));
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

  /**
   * Opens modal for adding new session
   */
  openAddModal(day: string, timeSlot: string): void {
    console.log('Opening add modal for:', day, timeSlot);
    // Implement add modal logic
  }

  /**
   * Opens modal for editing session
   */
  openEditModal(session: Seance, day: string, timeSlot: string): void {
    console.log('Opening edit modal for:', session, day, timeSlot);
    // Implement edit modal logic
  }

  /**
   * Opens modal for deleting session
   */
  openDeleteModal(id: number, day: string, group: string, timeSlot: string): void {
    console.log('Opening delete modal for:', id, day, group, timeSlot);
    // Implement delete modal logic
  }
}
