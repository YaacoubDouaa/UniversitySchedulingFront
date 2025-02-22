import { Component, Injector, OnInit } from '@angular/core';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { SeanceConflict } from '../models/Seance';
import { ScheduleService } from '../schedule-service.service';
import { ConflictService } from '../conflict.service';
import { RattrapageService } from '../rattrapage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
})
export class DashboardComponent implements OnInit {
  displayText = '';
  fullText = 'Welcome to Schedule Manager';
  isSidebarOpen = true;
  schedule: Schedule = {};
  conflicts: SeanceConflict[] = [];
  rattrapageSchedule: RattrapageSchedule = {};
  selectedNiveau: string = 'ALL';
  currentDay: string;

  timeSlots: string[] = [
    '08:30-10:00', '10:15-11:45', '12:00-13:30',
    '13:45-15:15', '15:30-17:00', '17:15-18:45'
  ];
  appJson: String = "aaaa";

  constructor(private injector: Injector) {
    this.currentDay = this.getCurrentDay();
  }

  ngOnInit(): void {
    this.loadSchedule();
    this.loadConflicts();
    this.loadRattrapageSchedule();
    this.animateText();
  }
  private animateText() {
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
  private getCurrentDay(): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date().getDay()];
  }

  private loadSchedule(): void {
    // Lazy injection of the ScheduleService
    const scheduleService = this.injector.get(ScheduleService);
    scheduleService.getGlobalSchedule().subscribe((schedule: Schedule) => {
      this.schedule = schedule;
      console.log(this.schedule); // Just to confirm it's working
    });
  }

  private loadConflicts(): void {
    // Lazy injection of the ConflictService
    const conflictService = this.injector.get(ConflictService);
    conflictService.getConflicts().subscribe(
      (data) => {
        this.conflicts = data;
        console.log(this.conflicts); // Just to confirm it's working
      }
    );
  }

  private loadRattrapageSchedule(): void {
    // Lazy injection of the RattrapageService
    const rattrapageService = this.injector.get(RattrapageService);
    rattrapageService.getRattrapageSchedule().subscribe(
      (data) => {
        this.rattrapageSchedule = data;
        console.log(this.rattrapageSchedule); // Just to confirm it's working
      }
    );
  }

  getSeanceTypeStyle(type: string): string {
    switch (type) {
      case 'COURS': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'TD': return 'bg-green-100 border-green-300 text-green-800';
      case 'TP': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  }
   getConflictSeverityStyle(conflict: SeanceConflict): string {
    if (conflict.conflictTypes.includes('ROOM')) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (conflict.conflictTypes.includes('PROFESSOR')) {
      return 'bg-amber-50 border-amber-200 text-amber-700';
    }
    return 'bg-gray-50 border-gray-200 text-gray-700';
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
