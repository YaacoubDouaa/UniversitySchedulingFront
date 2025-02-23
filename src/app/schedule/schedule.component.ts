import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {Seance} from '../models/Seance';
import {RattrapageSchedule, Schedule} from '../models/Schedule';
import {RattrapageService} from '../rattrapage.service';
import { Injector } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]

})
export class ScheduleComponent implements OnInit {

  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  showModal = true;
  timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
  } | null = null;
  showTD = true;
  showTP = true;
  showAdd:boolean=false;
  showDeleteModal=false
  seanceToDelete: {
    id: number;
    day: string;
    group: string;
    time: string;
  } | null = null;
  schedule: Schedule = {
    LUNDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
          id: 1,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Sara MTIW',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '10:15-11:45': [{
          name: 'TD-Algèbre certification 2',
          id: 2,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Soumaya BEN AICHA',
          biWeekly: false
        }],
        '13:00-14:30': [{
          name: 'TD-HDIG-Ingénierie et interprétabilité des systèmes informatiques',
          id: 3,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MTIW',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'TD-HDIG-Preuve de programmes',
          id: 4,
          groupe: 'ING1_INFO_TD1',
          room: 'A-32',
          type: 'TD',
          professor: 'Lassâad HAMEL',
          biWeekly: false
        }]
      }
    },
    MARDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Optimisation combinatoire',
          id: 5,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'COURS',
          professor: 'Abir BEN DHIHA',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '14:45-16:15': [{
          name: 'TD-Français - certification 2',
          id: 6,
          groupe: 'ING1_INFO_TD1',
          room: 'C-13',
          type: 'TD',
          professor: 'Hadda SMIDA',
          biWeekly: false
        }]
      }
    },
    MERCREDI: {
      ING1_INFO: {
        '14:45-16:15': [{
          name: 'Ch-Conception et analyse dalgorithmes',
          id: 7,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Abir GHNIMI',
          biWeekly: false
        }]
      },
      ING1_INFO_TD1: {
        '8:30-10:00': [{
          name: 'TD-Optimisation combinatoire',
          id: 8,
          groupe: 'ING1_INFO_TD1',
          room: 'A-13',
          type: 'TD',
          professor: 'Abir BEN DHIHA',
          biWeekly: false
        }],
        '10:15-11:45': [{
          name: 'TD-Conception et analyse dalgorithmes',
          id: 9,
          groupe: 'ING1_INFO_TD1',
          room: 'A-34',
          type: 'TD',
          professor: 'Mariem GUIS',
          biWeekly: false
        }]
      }
    },
    JEUDI: {
      ING1_INFO: {
        '13:00-14:30': [{
          name: 'Ch-Intelligence Artificielle',
          id: 10,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Abir GHNIMI',
          biWeekly: false
        }],
        '14:45-16:15': [{
          name: 'Ch-Types de données et preuve de programmes',
          id: 11,
          groupe: 'ING1_INFO',
          room: 'A-8',
          type: 'COURS',
          professor: 'Ali KANOUN',
          biWeekly: false
        }],
        '16:30-18:00': [{
          name: 'CB-Preuve de programmes',
          id: 12,
          groupe: 'ING1_INFO',
          room: 'A-32',
          type: 'COURS',
          professor: 'Ali KANOUN'
        }]
      },
      ING1_INFO_TD1: {
        '10:15-11:45': [{
          name: 'TP-Techniques dapprentissage automatique',
          id: 13,
          groupe: 'ING1_INFO_TD1',
          room: 'A-13',
          type: 'TP',
          professor: 'Mariem GARA',
          biWeekly: false
        }]
      }
    },
    VENDREDI: {
      'ING1_INFO_TD1 || ING1_INFO_TD2': {
        '10:15-11:45': [{
          name: 'TD-Techniques de communication',
          id: 14,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }, {
          name: 'TD-Techniques de communication',
          id: 15,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'C-15',
          type: 'TD',
          professor: 'Abir BERIDA',
          biWeekly: true
        }],
        '14:45-16:15': [{
          name: 'TP-3H00-3.15-Fondements de lintelligence Artificielle',
          id: 16,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TP',
          professor: 'Manel MEJ',
          biWeekly: true
        }],
        '16:30-18:00': [{
          name: 'TP-3H00-3.15-frama-C et la preuve de programmes',
          id: 17,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TP',
          professor: 'Sara MEJ',
          biWeekly: true
        }]
      }
    },
    SAMEDI: {
      ING1_INFO: {
        '8:30-10:00': [{
          name: 'Ch-Processus stochastique',
          id: 18,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'COURS',
          professor: 'Sara MTIW'
        }]
      },
      ING1_INFO_TD1: {
        '14:45-16:15': [{
          name: 'TD-3H00-3.15-Processus stochastique',
          id: 19,
          groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
          room: 'A-32',
          type: 'TD',
          professor: 'Sara MEJ'
        }],
        '8:30-10:00': [{
          name: 'Ch-Processus stochastique',
          id: 20,
          groupe: 'ING1_INFO',
          room: 'C-61',
          type: 'TP',
          professor: 'Sara MTIW'
        }]
      }
    }
  };
  idCounter: number = 20;



  // FormControl for autocomplete
  nameControl = new FormControl('');
  roomControl = new FormControl('');
  typeControl = new FormControl('');
  professorControl = new FormControl('');
  frequencyControl= new FormControl('');

  filteredNames: Observable<string[]>;
  filteredRooms: Observable<string[]>;
  filteredTypes: Observable<string[]>;
  filteredFrequency: Observable<string[]>;
  filteredProf: Observable<string[]>;

  // Dummy options for autocomplete
  nameOptions: string[] = ['Math Class', 'History Class', 'Physics Class', 'Chemistry Class'];
  roomOptions: string[] = ['A-101', 'A-102', 'A-201', 'B-101'];
  typeOptions: string[] = ['COURS', 'TD', 'TP'];
  frequencyOptions: string[] = ['biweekly', 'weekly'];
  profOptions: string[] = ['prof1', 'prof2', 'prof3'];
  selectedFrequency:string='';
  // Initialize rattrapageSchedule as an empty object instead of null
  rattrapageSchedule: RattrapageSchedule = {};
  private fullText='Schedule Manager';
  protected displayText='';


  constructor(private router: Router,private rattrapageService: RattrapageService, private injector:Injector) {

    // Setup filtering for the autocomplete inputs
    this.filteredNames = this.nameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.nameOptions))
    );
    this.filteredRooms = this.roomControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.roomOptions))
    );
    this.filteredTypes = this.typeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.typeOptions))
    );
    this.filteredFrequency = this.typeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.frequencyOptions))
    );
    this.filteredProf = this.typeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.profOptions))
    );

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

  ngOnInit(): void {
// Lazy injection of the service
    this.rattrapageService = this.injector.get(RattrapageService);
    // Subscribe to get the latest schedule data
    this.rattrapageService.getRattrapageSchedule().subscribe((schedule: RattrapageSchedule) => {
      this.rattrapageSchedule = schedule;
      console.log(this.rattrapageSchedule); // Just to confirm it's working
    });
    this.animateText();
  }

  private _filter(value: string | null, options: string[]): string[] {
    const filterValue = value ? value.toLowerCase() : ''; // Handle null or undefined values
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  openAddModal(day: string, time: string) {
    this.selectedActivity = null;
    this.selectedActivity = {
      seance: { name: '', id:0 , room: '', type: 'COURS', professor: '', groupe: '', biWeekly: true},
      day,
      time
    };
    this.showModal = false;
  }

  saveAddChanges() {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      let group = Object.keys(this.schedule[day]).find(grp => this.schedule[day][grp][time]);

      seance.biWeekly = this.selectedFrequency === 'biweekly';
      seance.id=this.idCounter++;
      if (!group) {
        group = this.selectedGroup;

        if (!this.schedule[day][group]) {
          this.schedule[day][group] = {};
        }

        if (!this.schedule[day][group][time]) {
          this.schedule[day][group][time] = [];
        }
      }

      const timeSlotSeances = this.schedule[day][group][time];

      // Count the number of biweekly and weekly seances in the current time slot
      const biWeeklyCount = timeSlotSeances.filter((s: any) => s.biWeekly).length;
      const weeklyCount = timeSlotSeances.filter((s: any) => !s.biWeekly).length;
      if (biWeeklyCount==2)
      {  alert("Cannot add seance: This time slot already contains the maximum allowed seances.");}
      // Check if the seance already exists
      const existingSeance = timeSlotSeances.find((s: any) => s.id === seance.id);

      // Validation Rules
      if (existingSeance) {
        // Update existing seance if needed
        Object.assign(existingSeance, seance);
      } else if (
        (biWeeklyCount === 1 && seance.biWeekly) ||
        (biWeeklyCount === 0 && weeklyCount === 0)
      ) {
        // Add if only one biweekly exists and new is biweekly, or if it's an empty slot
        timeSlotSeances.push(seance);
      } else {
        // Show warning if adding is not allowed
        alert("Cannot add seance: This time slot already contains the maximum allowed seances.");
      }
    }
    this.closeModal();
  }

  openEditModal(seance: Seance | null, day: string, time: string) {
    this.selectedActivity = {
      seance: seance ? { ...seance } : { name: '',id:0, room: '', type: 'COURS', professor: '', groupe: '',biWeekly: this.selectedFrequency==='biweekly' },
      day,
      time,

    };
    this.showModal = true;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevent closing when clicking inside the modal
    }
    this.selectedActivity = null;
  }

  saveChanges() {
    if (this.selectedActivity) {
      const { day, time, seance } = this.selectedActivity;
      seance.biWeekly = this.selectedFrequency==='biweekly';
      const group = Object.keys(this.schedule[day]).find(grp => this.schedule[day][grp][time]);
      if (group) {
        const seanceIndex = this.schedule[day][group][time].findIndex(s => s.id === seance.id);
        if (seanceIndex !== -1) {
          // Update the existing seance with the new one
          this.schedule[day][group][time][seanceIndex] = seance;
        } else {
          // If the seance does not exist, add it to the list
          this.schedule[day][group][time].push(seance);
        }
      }
    }
    this.closeModal();
  }
  openDeleteModal(id: number, day: string, group: string, time: string) {
    this.showDeleteModal = true;
    this.seanceToDelete = { id, day, group, time };

  }

  confirmDelete() {
    if (this.seanceToDelete) {
      const { id, day, group, time } = this.seanceToDelete;
      this.deleteSeance(id, day, group, time);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.seanceToDelete = null;
  }

  deleteSeance(seanceId: number, day: string, group: string, time: string) {
    const seances = this.schedule[day][group][time];
    const seanceIndex = seances.findIndex(s => s.id === seanceId);

    if (seanceIndex !== -1) {
      seances.splice(seanceIndex, 1);
    }

  }


  navigateToView() {
    this.router.navigate(['/view']);
  }


  selectedGroup: string = '';
  displayedGroup: string[] = [];
  getDisplayedGroup(): string[] {
    this.displayedGroup = [];
    if (this.selectedGroup === 'ING1_INFO_TD1 || ING1_INFO_TD2') {
      this.displayedGroup.push('ING1_INFO_TD1 || ING1_INFO_TD2');
    } else if (this.selectedGroup === 'ING1_INFO_TD1') {
      this.displayedGroup.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');
    } else if (this.selectedGroup === 'ING1_INFO_TD2') {
      this.displayedGroup.push('ING1_INFO_TD2', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');
    }
    if(this.selectedGroup === 'ING1_INFO') {this.displayedGroup.push('ING1_INFO_TD1', 'ING1_INFO_TD1 || ING1_INFO_TD2','ING1_INFO');}
    return this.displayedGroup;
  }
  onBlur(): void {
    // Optionally, set a timeout to allow the list to close after a small delay
    setTimeout(() => {
      // Logic to close the list (if your autocomplete dropdown is handled by a component)
      // For instance, in case of mat-autocomplete, you could manually trigger its close action
    }, 100);
  }


  groupOptions: string[] = ['ING1_INFO','ING1_INFO_TD1', 'ING1_INFO_TD2','ING1_INFO_TD1 || ING1_INFO_TD2'];



  getFilteredSchedule(): { [day: string]: { [time: string]: Seance[] | null } } {
    const filteredSchedule: { [day: string]: { [time: string]: Seance[] | null } } = {};

    this.days.forEach(day => {
      filteredSchedule[day] = {};
      Object.keys(this.schedule[day] || {}).forEach(group => {
        if (this.getDisplayedGroup().includes(group)) {
          Object.keys(this.schedule[day]?.[group] || {}).forEach(time => {
            const seances = this.schedule[day]?.[group]?.[time];
            if (seances) {
              if (!filteredSchedule[day][time]) {
                filteredSchedule[day][time] = [];
              }
              seances.forEach(seance => {
                if (
                  seance && (
                    (this.showTD && seance.type === 'TD') ||
                    (this.showTP && seance.type === 'TP') ||
                    seance.type === 'COURS'
                  )
                ) {
                  filteredSchedule[day][time]!.push(seance);
                }
              });
            }
          });
        }
      });

      // Add rattrapage seances with more robust checks
      if (this.rattrapageSchedule?.[day]) {
        Object.keys(this.rattrapageSchedule[day]).forEach(time => {
          if (!filteredSchedule[day][time]) {
            filteredSchedule[day][time] = [];
          }

          // Only add rattrapage seances if they're valid
          const rattrapageSeances = this.rattrapageSchedule[day]?.[time];
          if (Array.isArray(rattrapageSeances) && rattrapageSeances.length > 0) {
            rattrapageSeances.forEach(seance => {
              filteredSchedule[day][time]!.push({
                ...seance,
                 //isRattrapage: true
              });
            });
          }
        });
      }
    });

    return filteredSchedule;
  }
  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'cours':
        return 'session-type-cours';
      case 'td':
        return 'session-type-td';
      case 'tp':
        return 'session-type-tp';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  get sessionName(): string {
    return this.selectedActivity?.seance?.name || '';
  }
  get sessionId(): number | undefined {
    return this.selectedActivity?.seance?.id;
  }
  getSelectedActivityName(): string {
    return this.selectedActivity && this.selectedActivity.seance ? this.selectedActivity.seance.name : '';
  }

  setSelectedActivityName(name: string): void {
    if (this.selectedActivity && this.selectedActivity.seance) {
      this.selectedActivity.seance.name = name;
    }
  }
  getActivityColor(biWeekly: boolean|undefined): string {
    return biWeekly
      ? 'rgba(219, 234, 254, 0.8)' // Light blue for bi-weekly
      : 'rgba(243, 244, 246, 0.8)'; // Light gray for regular
  }

  getCourseIcon(type: string): string {
    switch (type) {
      case 'COURS':
        return 'book';
      case 'TD':
        return 'edit-3';
      case 'TP':
        return 'monitor';
      default:
        return 'circle';
    }
  }
  saveEditChanges() {

  }
}




