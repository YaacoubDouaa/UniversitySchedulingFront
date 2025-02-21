import { Component, OnInit } from '@angular/core';
import {RattrapageSchedule, Schedule} from '../models/Schedule';
import {SeanceConflict} from '../models/Seance';
import {ScheduleService} from '../schedule-service.service';
import {ConflictService} from '../conflict.service';
import {RattrapageService} from '../rattrapage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,

})
export class DashboardComponent implements OnInit {
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
  appJson: String="aaaa";

  constructor(private scheduleService: ScheduleService,private conflictService :ConflictService,private rattrapageService: RattrapageService) {
    this.currentDay = this.getCurrentDay();
  }

  ngOnInit(): void {
    this.loadSchedule();
    this.loadConflicts();
    this.loadRattrapageSchedule();
  }

  private getCurrentDay(): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date().getDay()];
  }

  private loadSchedule(): void {
    this.scheduleService.getGlobalSchedule().subscribe(
      (data) => this.schedule = data
    );
  }

  private loadConflicts(): void {
    this.conflictService.getConflicts().subscribe(
      (data) => this.conflicts = data
    );
  }

  private loadRattrapageSchedule(): void {
    this.rattrapageService.getRattrapageSchedule().subscribe(
      (data) => this.rattrapageSchedule = data
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
