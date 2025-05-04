import { Component, OnInit } from '@angular/core';
import { Prof } from '../../models/Professors';
import { ProfessorsService } from '../../Services/ProfessorSevice/professors.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  standalone: false,
  animations: [
    trigger('fadeSlide', [
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
export class ProfessorDashboardComponent implements OnInit {
  professorData: Prof | null = null;
  currentDate: string;
  loading = true;
  error: string | null = null;

  days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  selectedView: 'schedule' | 'stats' | 'settings' = 'schedule';

  constructor(private professorsService: ProfessorsService) {
    this.currentDate = this.professorsService.getCurrentDateTime();
    this.updateDateTime();
  }

  ngOnInit(): void {
    this.loadProfessorData();
  }

  private updateDateTime(): void {
    setInterval(() => {
      this.currentDate = this.professorsService.getCurrentDateTime();
    }, 1000);
  }

  private loadProfessorData(): void {
    this.loading = true;
    this.error = null;

    this.professorsService.getProfessorData(this.professorsService.getCurrentUser())
      .subscribe({
        next: (data) => {
          this.professorData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading professor data:', error);
          this.error = 'Failed to load professor data. Please try again later.';
          this.loading = false;
        }
      });
  }

  getSessionsForSlot(day: string, timeSlot: string): any[] {
    if (!this.professorData?.schedule?.[day]?.[timeSlot]) {
      return [];
    }
    return Object.entries(this.professorData.schedule[day][timeSlot]).map(([niveau, session]) => ({
      ...session,
      niveau
    }));
  }

  getSessionTypeClass(type: string): string {
    switch (type) {
      case 'COURS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'TD':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'TP':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  }

  getTotalHours(): number {
    if (!this.professorData) return 0;
    return this.professorData.heures;
  }

  getCurrentWeekSessions(): number {
    if (!this.professorData?.schedule) return 0;
    let count = 0;
    Object.values(this.professorData.schedule).forEach(daySchedule => {
      Object.values(daySchedule).forEach(timeSlots => {
        count += Object.keys(timeSlots).length;
      });
    });
    return count;
  }

  refreshData(): void {
    this.loadProfessorData();
  }
}
