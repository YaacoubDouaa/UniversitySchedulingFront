import {Component, Injector} from '@angular/core';
import { Router } from '@angular/router';

import {RattrapageSchedule, Schedule} from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';
import { SalleList, SalleSchedule } from '../models/Salle';
import { Seance } from '../models/Seance';
import {RattrapageService} from '../rattrapage.service';
import {RoomService} from '../rooms.service';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  types = ['COURS', 'TD'];
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  showModal: boolean = false;
  private selectedFrequency: string = "weekly";
  salleSchedule: SalleSchedule = {
    LUNDI: {},
    MARDI: {},
    MERCREDI: {},
    JEUDI: {},
    VENDREDI: {},
    SAMEDI: {},
    DIMANCHE: {}
  };
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;

  protected showAddModal: boolean = false;
salles:SalleList={}


  constructor(private router: Router, private salleScheduleService: ScheduleService, private injector:Injector,private roomService:RoomService) { }
  ngOnInit(): void {
// Lazy injection of the service
    this.roomService = this.injector.get(RoomService);
    // Subscribe to get the latest schedule data
    this.roomService.getSalles().subscribe((sallesList:SalleList) => {
      this.salles = sallesList;
      console.log(this.salles); // Just to confirm it's working
    });
  }
  isSalleAvailable(salle: string, day: string, time: string): boolean {
    const disponibilite = this.salles[salle].schedule;
    return !(disponibilite[day] && disponibilite[day][time]);
  }

  onSelectSalle(salleSchedule: SalleSchedule) {
    this.salleScheduleService.changeSchedule(salleSchedule);
    this.salleSchedule = salleSchedule;
    this.router.navigate(['/room-schedule']);
  }

  getSalleColor(salle: string, day: string, time: string, type: string): string {
    return this.isSalleAvailable(salle, day, time) ? '#d4edda' : '#f8d7da';
  }

  shouldDisplaySalle(salle: any): boolean {
    if (!this.selectedType || this.selectedType === '') {
      return true;
    }
    return salle.type === this.selectedType;
  }

  openAddModal(day: string, time: string): void {
    this.selectedActivity = {
      seance: { name: '', id: 0, room: '', type: 'COURS', professor: '', groupe: '', biWeekly: this.selectedFrequency === 'biweekly' },
      day,
      time
    };
    this.showModal = true;
  }

  saveAddChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      this.roomService.addSeance(day, time, seance);
      this.showModal = false;
    }
  }

  openEditModal(seance: Seance | null, day: string, time: string) {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '',id:0, room: '', type: 'COURS', professor: '', groupe: '',biWeekly: this.selectedFrequency==='biweekly' },
      day,
      time,

    };
    this.showModal = true;
  }


  saveEditChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      this.roomService.editSeance(day, time, seance);
      this.showModal = false;
    }
  }

  openDeleteModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = { seance, day, time };
    this.showModal = true;
  }

  saveDeleteChanges(): void {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      this.roomService.deleteSeance(day, time, seance);
      this.showModal = false;
    }
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedActivity = null;
  }

  openViewModal(salle: string, day: string, time: string) {
    if (this.salles[salle]?.schedule[day]?.[time]) {
      console.log('Opening view modal:', this.salles[salle].schedule[day][time]);
    } else {
      console.log('No session found for the selected time slot.');
    }
  }

  protected readonly Object = Object;
}
