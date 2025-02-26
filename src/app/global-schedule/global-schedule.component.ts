import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Schedule, RattrapageSchedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import {ScheduleService} from '../schedule-service.service';
import {RattrapageService} from '../rattrapage.service';
import {NotificationService} from '../notifications.service';
import {APP_CONSTANTS} from '../constants';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FeatherModule} from 'angular-feather';
import {ReactiveFormsModule} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-global-schedule',
  templateUrl: './global-schedule.component.html',
  standalone:false,
  styleUrls: ['./global-schedule.component.css'],
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
  schedule: Schedule | null = null;
  rattrapageSchedule: RattrapageSchedule | null = null;
  showRattrapage = false;

  days = APP_CONSTANTS.DAYS;
  timeSlots = APP_CONSTANTS.TIME_SLOTS;
  currentDate = APP_CONSTANTS.CURRENT_DATE;
  currentUser = APP_CONSTANTS.CURRENT_USER;
  allRooms: string[] = [];

  isLoading = false;
  error: string | null = null;

  constructor(
    private scheduleService: ScheduleService,
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initialize component and load data
   */
  ngOnInit(): void {
    this.loadSchedule();
    this.loadRattrapageSchedule();
    this.updateCurrentTime();
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





  loadRattrapageSchedule(): void {
    this.rattrapageService.getRattrapageSchedule().subscribe({
      next: (schedule) => {
        this.rattrapageSchedule = schedule;
        this.extractUniqueRooms();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.showError('Failed to load makeup schedule');
      }
    });
  }

  /**
   * Extracts unique rooms from schedule data
   */
  private extractUniqueRooms(): void {
    const roomSet = new Set<string>();

    // Extract from regular schedule
    if (this.schedule) {
      Object.values(this.schedule).forEach(daySchedule => {
        Object.values(daySchedule).forEach(groupSchedule => {
          Object.values(groupSchedule).forEach(timeSlotSessions => {
            timeSlotSessions.forEach(session => {
              if (session.room) {
                roomSet.add(session.room);
              }
            });
          });
        });
      });
    }

    // Extract from rattrapage schedule
    if (this.rattrapageSchedule) {
      Object.values(this.rattrapageSchedule).forEach(daySchedule => {
        Object.values(daySchedule).forEach(sessions => {
          sessions.forEach(session => {
            if (session.room) {
              roomSet.add(session.room);
            }
          });
        });
      });
    }

    this.allRooms = Array.from(roomSet).sort();
  }

  /**
   * Gets all sessions for a specific room, day, and time slot
   */
  getSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    return this.showRattrapage
      ? this.getRattrapageSessionsForRoom(room, day, timeSlot)
      : this.getRegularSessionsForRoom(room, day, timeSlot);
  }

  private getRegularSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    if (!this.schedule?.[day]) return [];

    const sessions: Seance[] = [];
    Object.entries(this.schedule[day]).forEach(([group, groupSchedule]) => {
      if (groupSchedule[timeSlot]) {
        sessions.push(...groupSchedule[timeSlot].filter(session =>
          session.room === room
        ));
      }
    });
    return sessions;
  }

  private getRattrapageSessionsForRoom(room: string, day: string, timeSlot: string): Seance[] {
    if (!this.rattrapageSchedule?.[day]?.[timeSlot]) return [];
    return this.rattrapageSchedule[day][timeSlot].filter(session =>
      session.room === room
    );
  }

  // ... Continue in the next part due to length limitations ...



  /**
   * Formats date to YYYY-MM-DD HH:MM:SS
   */
  private formatDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }

  /**
   * Loads schedule data from service
   */
  loadSchedule(): void {
    this.isLoading = true;
    this.scheduleService.getSchedule().subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.extractUniqueRooms();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load schedule';
        this.isLoading = false;
        this.notificationService.showError(error.message);
        this.cdr.detectChanges();
      }
    });
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
