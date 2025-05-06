import { Component, OnInit } from '@angular/core';
import { Prof } from '../../models/Professors';
import { ProfessorsService } from '../../Services/ProfessorSevice/professors.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Seance } from '../../models/Seance';

// Extended session type with metadata
interface SessionWithMetadata extends Seance {
  day?: string;
  timeSlot?: string;
  niveau?: string;
}

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
  currentDate: string = '';
  loading = true;
  error: string | null = null;

  days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  selectedView: 'schedule' | 'stats' | 'settings' = 'schedule';

  // UI state variables
  upcomingSessions: SessionWithMetadata[] = [];
  todaySessions: SessionWithMetadata[] = [];
  statsData = {
    totalHours: 0,
    weeklyHours: 0,
    courseTypes: { COURS: 0, TD: 0, TP: 0, OTHER: 0 }
  };

  constructor(private professorsService: ProfessorsService) {
    this.currentDate = this.professorsService.getCurrentDateTime();
    this.updateDateTime();
  }

  ngOnInit(): void {
    // Always set up demo data first to ensure something is displayed
    this.setupDemoData();

    // Then try to load actual data
    this.loadProfessorData();
  }

  /**
   * Sets up demo data for testing
   */
  private setupDemoData(): void {
    console.log('Setting up demo data');

    this.professorData = {
      name: 'YaacoubDouaa',
      codeEnseignant: '3',
      heures: 18,
      schedule: {
        'LUNDI': {
          'ING3_TIC': {
            '8:30-10:00': [{
              id: 301,
              name: 'Intelligence Artificielle',
              groupe: 'ING3_TIC',
              room: 'A-15',
              type: 'COURS',
              professor: 'YaacoubDouaa',
              biWeekly: false
            }],
            '10:15-11:45': [{
              id: 302,
              name: 'TP Intelligence Artificielle',
              groupe: 'ING3_TIC_G1',
              room: 'LAB-2',
              type: 'TP',
              professor: 'YaacoubDouaa',
              biWeekly: false
            }]
          }
        },
        'MERCREDI': {
          'ING2_TIC': {
            '13:00-14:30': [{
              id: 303,
              name: 'Deep Learning',
              groupe: 'ING2_TIC',
              room: 'B-14',
              type: 'COURS',
              professor: 'YaacoubDouaa',
              biWeekly: false
            }],
            '14:45-16:15': [{
              id: 304,
              name: 'TP Deep Learning',
              groupe: 'ING2_TIC_G1',
              room: 'LAB-1',
              type: 'TP',
              professor: 'YaacoubDouaa',
              biWeekly: false
            }]
          }
        },
        'VENDREDI': {
          'ING1_TIC': {
            '8:30-10:00': [{
              id: 305,
              name: 'Introduction au Machine Learning',
              groupe: 'ING1_TIC',
              room: 'C-12',
              type: 'COURS',
              professor: 'YaacoubDouaa',
              biWeekly: false
            }]
          }
        }
      }
    };

    this.calculateStats();
    this.setupUpcomingSessions();
    this.setupTodaySessions();
    this.loading = false;
    this.error = null;
  }

  private updateDateTime(): void {
    setInterval(() => {
      this.currentDate = this.professorsService.getCurrentDateTime();
    }, 1000);
  }

  private loadProfessorData(): void {
    this.loading = true;

    try {
      const currentUser = this.professorsService.getCurrentUser();
      console.log('Current user:', currentUser);

      if (!currentUser) {
        console.warn('No current user found, using demo data');
        // We already set up demo data in ngOnInit
        this.loading = false;
        return;
      }

      this.professorsService.getProfessorData(currentUser).subscribe({
        next: (data) => {
          console.log('Professor data received:', data);

          if (data) {
            this.professorData = data;
            this.calculateStats();
            this.setupUpcomingSessions();
            this.setupTodaySessions();
          } else {
            console.warn('Received null or empty professor data, keeping demo data');
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading professor data:', error);
          // We already have demo data set up, just log the error
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Exception in loadProfessorData:', err);
      this.loading = false;
    }
  }

  /**
   * Get all sessions for a specific day
   */
  getSessionsForDay(day: string): SessionWithMetadata[] {
    if (!this.professorData || !this.professorData.schedule || !this.professorData.schedule[day]) {
      return [];
    }

    const allSessions: SessionWithMetadata[] = [];

    // Get the day's schedule
    const daySchedule = this.professorData.schedule[day];
    if (!daySchedule) return [];

    // Iterate through all groups for this day
    for (const groupe of Object.keys(daySchedule)) {
      const groupSchedule = daySchedule[groupe];
      if (!groupSchedule) continue;

      // Iterate through all time slots for this group
      for (const timeSlot of Object.keys(groupSchedule)) {
        const sessions = groupSchedule[timeSlot] || [];

        // Add all sessions from this time slot
        for (const session of sessions) {
          allSessions.push({
            ...session,
            timeSlot: timeSlot,
            niveau: groupe
          });
        }
      }
    }

    return allSessions;
  }

  /**
   * Get sessions for a specific day and time slot
   */
  getSessionsForSlot(day: string, timeSlot: string): SessionWithMetadata[] {
    if (!this.professorData || !this.professorData.schedule || !this.professorData.schedule[day]) {
      return [];
    }

    const sessions: SessionWithMetadata[] = [];

    // Get the day's schedule
    const daySchedule = this.professorData.schedule[day];
    if (!daySchedule) return [];

    // Iterate through all groups for this day
    for (const groupe of Object.keys(daySchedule)) {
      const groupSchedule = daySchedule[groupe];
      if (!groupSchedule) continue;

      // Check if this group has sessions at the specified time slot
      const timeSlotSessions = groupSchedule[timeSlot] || [];

      // Add all sessions from this time slot with additional metadata
      for (const session of timeSlotSessions) {
        sessions.push({
          ...session,
          niveau: groupe,
          timeSlot: timeSlot
        });
      }
    }

    return sessions;
  }

  /**
   * Set up upcoming sessions for display
   */
  private setupUpcomingSessions(): void {
    if (!this.professorData || !this.professorData.schedule) return;

    this.upcomingSessions = [];

    // Get the current day index (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    const daysMap: {[key: string]: number} = {
      'LUNDI': 1, 'MARDI': 2, 'MERCREDI': 3, 'JEUDI': 4, 'VENDREDI': 5, 'SAMEDI': 6
    };

    // Sort days based on proximity to today
    const sortedDays = [...this.days].sort((a, b) => {
      const daysUntilA = (daysMap[a] - today + 7) % 7;
      const daysUntilB = (daysMap[b] - today + 7) % 7;
      return daysUntilA - daysUntilB;
    });

    // Skip today as we handle it separately
    const futureDays = sortedDays.filter(day => daysMap[day] !== today);

    // Get the next 3 sessions
    for (const day of futureDays) {
      const sessions = this.getSessionsForDay(day);
      if (sessions.length > 0) {
        sessions.forEach(session => {
          if (this.upcomingSessions.length < 3) {
            this.upcomingSessions.push({
              ...session,
              day: day
            });
          }
        });
      }

      if (this.upcomingSessions.length >= 3) break;
    }
  }

  /**
   * Set up today's sessions for display
   */
  private setupTodaySessions(): void {
    if (!this.professorData || !this.professorData.schedule) return;

    this.todaySessions = [];

    // Map JavaScript day number to our day names
    const dayMap = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const today = dayMap[new Date().getDay()];

    if (this.days.includes(today)) {
      const sessions = this.getSessionsForDay(today);
      this.todaySessions = sessions.map(session => ({
        ...session,
        day: today
      }));
    }
  }

  /**
   * Calculate teaching statistics
   */
  private calculateStats(): void {
    if (!this.professorData || !this.professorData.schedule) return;

    let totalSessions = 0;
    const courseTypes = { COURS: 0, TD: 0, TP: 0, OTHER: 0 };

    // Iterate through all days
    for (const day of Object.keys(this.professorData.schedule)) {
      const daySchedule = this.professorData.schedule[day];
      if (!daySchedule) continue;

      // Iterate through all groups
      for (const groupe of Object.keys(daySchedule)) {
        const groupSchedule = daySchedule[groupe];
        if (!groupSchedule) continue;

        // Iterate through all time slots
        for (const timeSlot of Object.keys(groupSchedule)) {
          const sessions = groupSchedule[timeSlot] || [];

          // Count and classify each session
          sessions.forEach(session => {
            totalSessions++;

            // Count by type
            if (session.type === 'COURS') courseTypes.COURS++;
            else if (session.type === 'TD') courseTypes.TD++;
            else if (session.type === 'TP') courseTypes.TP++;
            else courseTypes.OTHER++;
          });
        }
      }
    }

    // Calculate weekly hours (assuming each session is 1.5 hours)
    const weeklyHours = totalSessions * 1.5;

    this.statsData = {
      totalHours: this.professorData.heures || 0,
      weeklyHours: weeklyHours,
      courseTypes: courseTypes
    };
  }

  /**
   * Get CSS class for session type
   */
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

  /**
   * Get total teaching hours
   */
  getTotalHours(): number {
    if (!this.professorData) return 0;
    return this.professorData.heures || 0;
  }

  /**
   * Get total number of sessions in the current week
   */
  getCurrentWeekSessions(): number {
    if (!this.professorData || !this.professorData.schedule) return 0;

    let count = 0;

    // Iterate through all days
    for (const day of Object.keys(this.professorData.schedule)) {
      const daySchedule = this.professorData.schedule[day];
      if (!daySchedule) continue;

      // Iterate through all groups
      for (const groupe of Object.keys(daySchedule)) {
        const groupSchedule = daySchedule[groupe];
        if (!groupSchedule) continue;

        // Iterate through all time slots
        for (const timeSlot of Object.keys(groupSchedule)) {
          const sessions = groupSchedule[timeSlot] || [];
          count += sessions.length;
        }
      }
    }

    return count;
  }

  /**
   * Switch between views: schedule, stats, settings
   */
  changeView(view: 'schedule' | 'stats' | 'settings'): void {
    this.selectedView = view;
  }

  /**
   * Refresh the professor data
   */
  refreshData(): void {
    this.loadProfessorData();
  }
}
