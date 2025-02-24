import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { Seance } from '../models/Seance';
import { RattrapageService } from '../rattrapage.service';
import {ScheduleService} from '../schedule-service.service';


@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css'],
  standalone:false,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ViewScheduleComponent implements OnInit, OnDestroy {
  // System Configuration
  private readonly currentDateTime = '2025-02-24 20:26:26';
  private readonly currentUser = 'YaacoubDouaa';

  // Component Configuration
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  timeSlots = ['08:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  groupOptions = ['ING1_INFO', 'ING1_INFO_TD1', 'ING1_INFO_TD2', 'ING1_INFO_TD1 || ING1_INFO_TD2'];

  // UI State
  fullText = 'Schedule Manager';
  displayText = '';
  showTD = true;
  showTP = true;
  selectedWeek = 'all';
  selectedGroup = '';
  isDarkMode = false;

  // Schedule State
  private normalSchedule: Schedule = {};
  private rattrapageSchedule: RattrapageSchedule = {};
  private subscriptions: Subscription[] = [];

  // Form Controls
  filterGroup = new FormControl('');
  filterWeek = new FormControl('all');
  searchControl = new FormControl('');

  constructor(
    private router: Router,
    private rattrapageService: RattrapageService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.animateText();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeSubscriptions(): void {
    // Subscribe to schedule services
    this.subscriptions.push(
      this.scheduleService.currentSchedule.subscribe(schedule => {
        this.normalSchedule = schedule;
        this.updateFilteredSchedule();
      }),

      this.rattrapageService.getRattrapageSchedule().subscribe(schedule => {
        this.rattrapageSchedule = schedule;
        this.updateFilteredSchedule();
      }),

      // Subscribe to filter changes
      this.filterGroup.valueChanges.subscribe(() => this.updateFilteredSchedule()),
      this.filterWeek.valueChanges.subscribe(() => this.updateFilteredSchedule()),
      this.searchControl.valueChanges.subscribe(() => this.updateFilteredSchedule())
    );
  }

  private animateText(): void {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayText = this.fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  getFilteredSchedule(): { [day: string]: { [time: string]: Seance[] | null } } {
    const filteredSchedule: { [day: string]: { [time: string]: Seance[] | null } } = {};

    this.days.forEach(day => {
      filteredSchedule[day] = {};

      // Process normal sessions
      Object.keys(this.normalSchedule[day] || {}).forEach(group => {
        if (this.getDisplayedGroup().includes(group)) {
          Object.keys(this.normalSchedule[day]?.[group] || {}).forEach(time => {
            const seances = this.normalSchedule[day]?.[group]?.[time];
            if (seances) {
              if (!filteredSchedule[day][time]) {
                filteredSchedule[day][time] = [];
              }
              seances.forEach(seance => {
                if (this.shouldShowSeance(seance)) {
                  filteredSchedule[day][time]!.push({
                    ...seance,
                    isRattrapage: false
                  });
                }
              });
            }
          });
        }
      });

      // Process rattrapage sessions
      if (this.rattrapageSchedule[day]) {
        Object.entries(this.rattrapageSchedule[day]).forEach(([time, seances]) => {
          if (!filteredSchedule[day][time]) {
            filteredSchedule[day][time] = [];
          }

          seances.forEach(seance => {
            if (this.shouldShowSeance(seance)) {
              filteredSchedule[day][time]!.push({
                ...seance,
                isRattrapage: true,
                name: `[Rattrapage] ${seance.name}`
              });
            }
          });
        });
      }
    });

    return filteredSchedule;
  }

  private shouldShowSeance(seance: Seance): boolean {
    const typeCondition = (
      (this.showTD && seance.type === 'TD') ||
      (this.showTP && seance.type === 'TP') ||
      seance.type === 'COURS'
    );

    const weekCondition = this.selectedWeek === 'all' ||
      (this.selectedWeek === 'even' && seance.biWeekly) ||
      (this.selectedWeek === 'odd' && !seance.biWeekly);

    return typeCondition && weekCondition;
  }

  getDisplayedGroup(): string[] {
    const groups: string[] = [];

    switch (this.selectedGroup) {
      case 'ING1_INFO_TD1 || ING1_INFO_TD2':
        groups.push('ING1_INFO_TD1 || ING1_INFO_TD2');
        break;
      case 'ING1_INFO_TD1':
        groups.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
      case 'ING1_INFO_TD2':
        groups.push('ING1_INFO_TD2', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
      case 'ING1_INFO':
        groups.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2', 'ING1_INFO');
        break;
    }

    return groups;
  }

  getActivityColor(biweekly: boolean | undefined): string {
    return biweekly ? '#B0B8C7' : 'transparent';
  }

  getTypeColor(type: string | undefined): string {
    switch (type) {
      case 'TD': return '#5603ad';
      case 'TP': return '#2a9d8f';
      case 'COURS': return '#ee4266';
      default: return 'transparent';
    }
  }

  getSessionStyle(seance: Seance): { [key: string]: string } {
    return {
      backgroundColor: this.getActivityColor(seance.biWeekly),
      borderColor: this.getTypeColor(seance.type),
      borderWidth: '2px',
      borderStyle: 'solid',
      borderLeftWidth: seance.isRattrapage ? '8px' : '2px',
      opacity: seance.isRattrapage ? '0.9' : '1'
    };
  }

  getSessionTextStyle(seance: Seance): { [key: string]: string } {
    return {
      color: seance.isRattrapage ? '#E63946' : 'inherit',
      fontWeight: seance.isRattrapage ? 'bold' : 'normal'
    };
  }

  toggleTD(): void {
    this.showTD = !this.showTD;
    this.updateFilteredSchedule();
  }

  toggleTP(): void {
    this.showTP = !this.showTP;
    this.updateFilteredSchedule();
  }

  setSelectedWeek(week: string): void {
    this.selectedWeek = week;
    this.updateFilteredSchedule();
  }

  setSelectedGroup(group: string): void {
    this.selectedGroup = group;
    this.updateFilteredSchedule();
  }

  private updateFilteredSchedule(): void {
    // Trigger change detection by reassigning the filtered schedule
    const filtered = this.getFilteredSchedule();
    // You might want to emit this to a BehaviorSubject if needed
  }

  navigateToSchedule(): void {
    this.router.navigate(['schedule']);
  }

  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }



  /**
   * Scroll methods for mobile navigation
   */
  scrollLeft(): void {
    const container = document.querySelector('.schedule-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = document.querySelector('.schedule-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}
