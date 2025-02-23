import { Component } from '@angular/core';
import { Seance } from '../models/Seance';
import { Schedule } from '../models/Schedule';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import {ScheduleService} from '../schedule-service.service';

@Component({
  selector: 'app-global-schedule',
  standalone: false,
  templateUrl: './global-schedule.component.html',
  styleUrls: ['./global-schedule.component.css']
})
export class GlobalScheduleComponent {
  schedule: Schedule | null = null;
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  editingCell: any = null;
  currentDate = '2025-02-23 18:32:55';

  constructor(private scheduleService: ScheduleService) {
  }

  ngOnInit() {
    this.scheduleService.currentGlobalSchedule.subscribe(schedule => {
      this.schedule = schedule;
    });
  }

  getClassForCourse(course: any): string {
    const baseClasses = 'p-2 rounded-lg shadow-sm text-sm mb-2';

    switch (course?.type) {
      case 'COURS':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200`;
      case 'TD':
        return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200`;
      case 'TP':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200`;
    }
  }

  getAllCoursesForSlot(day: string, timeSlot: string): any[] {
    if (!this.schedule || !this.schedule[day]) return [];

    const courses: any[] = [];
    Object.keys(this.schedule[day]).forEach(group => {
      const groupSchedule = this.schedule![day][group];
      if (groupSchedule && groupSchedule[timeSlot]) {
        groupSchedule[timeSlot].forEach(course => {
          courses.push({
            ...course,
            group: group // Add group information to the course
          });
        });
      }
    });
    return courses;
  }
  // schedule-display.component.ts
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
}
