import {Component, Injector} from '@angular/core';
import {ProfList, ProfSchedule} from '../models/Professors';
import {Router} from '@angular/router';
import {SalleList, SalleSchedule} from '../models/Salle';
import {ScheduleService} from '../schedule-service.service';
import {Seance} from '../models/Seance';
import {RoomService} from '../rooms.service';
import {ProfessorsService} from '../professors.service';

@Component({
  selector: 'app-professors',
  standalone: false,

  templateUrl: './professors.component.html',
  styleUrl: './professors.component.css'
})
export class ProfessorsComponent {
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  types=['COURS','TD'];
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  showModal: boolean = false;
  private selectedFrequency: string = "weekly";
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;
  profs: ProfList = {};
  profSchedule: SalleSchedule = {
    LUNDI: {},
    MARDI: {},
    MERCREDI: {},
    JEUDI: {},
    VENDREDI: {},
    SAMEDI: {},
    DIMANCHE: {}
  };


constructor(private router: Router, private profScheduleService: ScheduleService,private profService: ProfessorsService, private injector:Injector) {}
  ngOnInit(): void {
// Lazy injection of the service
    this.profService = this.injector.get(ProfessorsService);
    // Subscribe to get the latest schedule data
    this.profService.getProfs().subscribe((profList:ProfList) => {
      this.profs = profList;
      console.log(this.profs); // Just to confirm it's working
    });
  }
  isProfAvailable(name: string, day: string, time: string): boolean {
    const disponibilite = this.profs[name].schedule;

    return !(disponibilite[day] && disponibilite[day][time] );}

  getSalleColor(salle: string, day: string, time: string,type:string): string {
    return this.isProfAvailable(salle, day, time) ? '#d4edda' : '#f8d7da';
  }
  onSelectProf(profSchedule:  ProfSchedule) {
    this.profScheduleService.changeSchedule(profSchedule);
    this.router.navigate(['/room-schedule']);
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
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (!this.profSchedule[day]) this.profSchedule[day] = {};
      if (!this.profSchedule[day][time]) this.profSchedule[day][time] = {};

      const niveau = seance.groupe || 'Default';
      this.profSchedule[day][time][niveau] = seance;
    }
    this.showModal = false;
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
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      if (this.profSchedule[day] && this.profSchedule[day][time]) {
        const niveau = seance.groupe|| 'Default';
        this.profSchedule[day][time][niveau] = seance;
      }
    }
    this.showModal = false;
  }

  openDeleteModal(seance: Seance, day: string, time: string): void {
    this.selectedActivity = { seance, day, time };
    this.showModal = true;
  }

  saveDeleteChanges(): void {
    if (this.selectedActivity && this.profSchedule) {
      const { day, time, seance } = this.selectedActivity;

      const niveaux = Object.keys(this.profSchedule[day]?.[time] || {});
      niveaux.forEach(niveau => {
        if (this.profSchedule![day][time][niveau]?.id === seance.id) {
          delete this.profSchedule![day][time][niveau];
        }
      });
    }
    this.showModal = false;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedActivity = null;
  }

  openViewModal(prof: string, day: string, time: string) {
    if (this.profs[prof]?.schedule[day]?.[time]) {
      console.log('Opening view modal:', this.profs[prof].schedule[day][time]);
    } else {
      console.log('No session found for the selected time slot.');
    }
  }

  protected readonly Object = Object;
}
