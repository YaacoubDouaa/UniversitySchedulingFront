import { Component } from '@angular/core';
import {SalleSchedule} from '../models/Salle';
import {Seance} from '../models/Seance';
import {ScheduleService} from '../schedule-service.service';

@Component({
  selector: 'app-prof-schedule',
  standalone: false,

  templateUrl: './prof-schedule.component.html',
  styleUrl: './prof-schedule.component.css'
})
export class ProfScheduleComponent {
  profSchedule: SalleSchedule | null = null;
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;
  seanceToDelete: {
    id: number;
    day: string;
    group: string;
    time: string;
  } | null = null;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  private selectedFrequency: string ="weekly";
  protected showAddModal: boolean=false;
  constructor(private profScheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.profScheduleService.currentDisponibilite.subscribe(schedule => {
      this.profSchedule = schedule;
    });
  }
  getClassDetails(day: string, time: string): any {
    return this.profSchedule || null;
  }

  getNiveaux(day: string, time: string): string[] {
    return this.profSchedule?.[day]?.[time]
      ? Object.keys(this.profSchedule[day][time])
      : [];
  }

  viewSeance(day: string, time: string): Seance | null {
    if (this.profSchedule && this.profSchedule[day] && this.profSchedule[day][time]) {
      const niveaux = Object.keys(this.profSchedule[day][time]);
      if (niveaux.length > 0) {
        return this.profSchedule[day][time][niveaux[0]];
      }
    }
    return null;
  }
  getTypeColor(type: string | undefined): string {
    switch (type) {
      case 'TD' :
        return "#7209b7";
      case 'TP':
        return '#2b9348';
      case 'COURS':
        return '#FF331F'
      default:
        return 'transparent';
    }}

  getActivityColor(biweekly: boolean | undefined): string {
    switch (biweekly) {
      case true:
        return "#B0B8C7";
      case false:
        return 'transparent';
      default:
        return 'transparent';
    }}


// 1️⃣ Open Add Modal
  openAddModal(day: string, time: string): void {
    this.selectedActivity = {
      seance: { name: '', id: 0, room: '', type: 'COURS', professor: '', code: '', biWeekly: this.selectedFrequency === 'biweekly' },
      day,
      time
    };
    this.showAddModal = true;
  }

  // 2️⃣ Save Added Session
  saveAddChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (!this.profSchedule[day]) this.profSchedule[day] = {};
      if (!this.profSchedule[day][time]) this.profSchedule[day][time] = {};

      const niveau = seance.code || 'Default';
      this.profSchedule[day][time][niveau] = seance;
    }
    this.showAddModal = false; // Close the modal
    this.closeModal();
  }

  // 3️⃣ Open Edit Modal
  openEditModal(seance: Seance | null, day: string, time: string): void {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '', id: 0, room: '', type: 'COURS', professor: '', code: '', biWeekly: this.selectedFrequency === 'biweekly' },
      day,
      time
    };
    this.showEditModal = true;
  }

  // 4️⃣ Save Edited Changes
  saveEditChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (this.profSchedule[day] && this.profSchedule[day][time]) {
        const niveau = seance.code || 'Default';
        this.profSchedule[day][time][niveau] = seance;
      }
    }
    this.showEditModal = false;
    this.closeModal();// Close the modal
  }
  openDeleteModal(day: string, time: string, group: string, seanceId: number): void {
    this.seanceToDelete = { id: seanceId, day, group, time };
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.seanceToDelete && this.profSchedule) {
      const { day, time, group, id } = this.seanceToDelete;
      if (this.profSchedule[day]?.[time]?.[group]?.id === id) {
        delete this.profSchedule[day][time][group];
      }
    }
    this.showDeleteModal = false;
    this.seanceToDelete = null;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedActivity = null;
  }
}
