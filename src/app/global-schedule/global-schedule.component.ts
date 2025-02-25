import {Component, Inject, Injector, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Seance } from '../models/Seance';
import { Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';

@Component({
  selector: 'app-global-schedule',
  templateUrl: './global-schedule.component.html',
  styleUrls: ['./global-schedule.component.css'],
  standalone:false,
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
  days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  currentDate: string = '2025-02-23 21:14:04';
  currentUser: string = 'YaacoubDouaa';
  selectedTimeSlot: { day: string; time: string } | null = null;

  constructor(private scheduleService: ScheduleService,private injector:Injector) {}

  ngOnInit(): void {
    this.loadSchedule();
    this.updateCurrentTime();
  }

  private updateCurrentTime(): void {
    setInterval(() => {
      const now = new Date();
      this.currentDate = this.formatDateTime(now);
    }, 1000);
  }

  private formatDateTime(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  loadSchedule(): void {
    // Lazy injection of the service
    this.scheduleService = this.injector.get(ScheduleService);
    // Subscribe to get the latest schedule data
    this.scheduleService.getSchedule().subscribe((schedule: Schedule) => {
      this.schedule = schedule;
    });
  }

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

  toggleTimeSlotDetails(day: string, timeSlot: string): void {
    if (this.isTimeSlotSelected(day, timeSlot)) {
      this.selectedTimeSlot = null;
    } else {
      this.selectedTimeSlot = { day, time: timeSlot };
    }
  }

  isTimeSlotSelected(day: string, timeSlot: string): boolean {
    return this.selectedTimeSlot?.day === day && this.selectedTimeSlot?.time === timeSlot;
  }

  getUniqueSessionTypes(day: string, timeSlot: string): string[] {
    const sessions = this.getAllCoursesForSlot(day, timeSlot);
    return Array.from(new Set(sessions.map(session => session.type)));
  }

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

  openAddModal(day: string, timeSlot: string): void {
    // Implement your add modal logic
    console.log('Opening add modal for:', day, timeSlot);
  }

  openEditModal(session: Seance, day: string, timeSlot: string): void {
    // Implement your edit modal logic
    console.log('Opening edit modal for:', session, day, timeSlot);
  }

  openDeleteModal(id: number, day: string, group: string, timeSlot: string): void {
    // Implement your delete modal logic
    console.log('Opening delete modal for:', id, day, group, timeSlot);
  }
}
