import {Component, Input} from '@angular/core';
import {SalleList, SalleSchedule} from '../models/Salle';
import {Seance} from '../models/Seance';
import {ScheduleService} from '../schedule-service.service';


@Component({
  selector: 'app-room-schedule',
  standalone: false,

  templateUrl: './room-schedule.component.html',
  styleUrl: './room-schedule.component.css'
})
export class RoomScheduleComponent {
  salleSchedule: SalleSchedule | null = null;
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
  constructor(private salleScheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.salleScheduleService.currentDisponibilite.subscribe(schedule => {
      this.salleSchedule = schedule;
    });
  }
  getClassDetails(day: string, time: string): any {
    return this.salleSchedule || null;
  }

  getNiveaux(day: string, time: string): string[] {
    return this.salleSchedule?.[day]?.[time]
      ? Object.keys(this.salleSchedule[day][time])
      : [];
  }

  viewSeance(day: string, time: string): Seance | null {
    if (this.salleSchedule && this.salleSchedule[day] && this.salleSchedule[day][time]) {
      const niveaux = Object.keys(this.salleSchedule[day][time]);
      if (niveaux.length > 0) {
        return this.salleSchedule[day][time][niveaux[0]];
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
    if (this.selectedActivity && this.salleSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (!this.salleSchedule[day]) this.salleSchedule[day] = {};
      if (!this.salleSchedule[day][time]) this.salleSchedule[day][time] = {};

      const niveau = seance.code || 'Default';
      this.salleSchedule[day][time][niveau] = seance;
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
    if (this.selectedActivity && this.salleSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (this.salleSchedule[day] && this.salleSchedule[day][time]) {
        const niveau = seance.code || 'Default';
        this.salleSchedule[day][time][niveau] = seance;
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
    if (this.seanceToDelete && this.salleSchedule) {
      const { day, time, group, id } = this.seanceToDelete;
      if (this.salleSchedule[day]?.[time]?.[group]?.id === id) {
        delete this.salleSchedule[day][time][group];
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



