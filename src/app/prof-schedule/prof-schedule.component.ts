import {Component, Injector, OnInit} from '@angular/core';
import { ProfessorsService } from '../professors.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Prof } from '../models/Professors';
import { Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';

@Component({
  selector: 'app-prof-schedule',
  templateUrl: './prof-schedule.component.html',
  styleUrls: ['./prof-schedule.component.css'],
  standalone: false
})
export class ProfScheduleComponent implements OnInit {
  currentDateTime: string;
  currentUser: string;
  profSchedule$: Observable<Schedule | null>;
  schedule: Schedule | null = null;
  private destroy$ = new Subject<void>();

  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  constructor(private professorsService: ProfessorsService, private injector: Injector) {
    this.professorsService = this.injector.get(ProfessorsService);
    this.currentDateTime = this.professorsService.getCurrentDateTime();
    this.currentUser = this.professorsService.getCurrentUser();
    this.profSchedule$ = this.professorsService.getProfessorSchedule(this.currentUser);
  }

  ngOnInit() {
    this.loadSchedule();

    setInterval(() => {
      this.currentDateTime = this.professorsService.getCurrentDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSchedule() {
    this.profSchedule$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (schedule) => {
          if (schedule) {
            this.schedule = schedule;
            console.log('Schedule loaded successfully:', schedule);
          } else {
            console.log('No schedule found for user:', this.currentUser);
          }
        },
        error: (error) => {
          console.error('Error loading schedule:', error);
        }
      });
  }

  getSessionsForSlot(schedule: Schedule | null, day: string, timeSlot: string): Seance[] {
    if (!schedule || !schedule[day]) return [];

    const sessions: Seance[] = [];
    if (schedule[day]) {
      Object.values(schedule[day]).forEach(niveauSchedule => {
        if (niveauSchedule[timeSlot]) {
          sessions.push(...niveauSchedule[timeSlot]);
        }
      });
    }
    return sessions;
  }

  getCurrentTimeSlot(): string {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    if (hour >= 8 && (hour < 10 || (hour === 10 && minutes <= 0))) return '8:30-10:00';
    if (hour >= 10 && (hour < 11 || (hour === 11 && minutes <= 45))) return '10:15-11:45';
    if (hour >= 13 && (hour < 14 || (hour === 14 && minutes <= 30))) return '13:00-14:30';
    if (hour >= 14 && (hour < 16 || (hour === 16 && minutes <= 15))) return '14:45-16:15';
    if (hour >= 16 && hour < 18) return '16:30-18:00';
    return '';
  }

  isCurrentTimeSlot(timeSlot: string): boolean {
    return timeSlot === this.getCurrentTimeSlot();
  }

  refreshSchedule() {
    this.loadSchedule();
  }
}
