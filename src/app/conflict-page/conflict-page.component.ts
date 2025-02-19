import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {SeanceConflict} from '../models/Seance';
import {RoomService} from '../rooms.service';
import {SalleList, SallesDispo} from '../models/Salle';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-conflict-page',
  standalone: false,

  templateUrl: './conflict-page.component.html',
  styleUrl: './conflict-page.component.css'
})
export class ConflictPageComponent {
  // FormControls for autocomplete
  roomControl1 = new FormControl('');
  roomControl2 = new FormControl('');
  availableRooms: { [key: number]: string[] } = {};
  rooms: string[] = [];
  filteredRooms1: Observable<string[]>;
  filteredRooms2: Observable<string[]>;

  conflicts: SeanceConflict[] = [
    {
      seance1: {
        name: 'Mathematics 101',
        id: 1,
        room: 'A101',
        type: 'COURS',
        professor: 'Dr. Smith',
        groupe: 'MATH101'
      },
      seance2: {
        name: 'Physics 201',
        id: 2,
        room: 'A101',
        type: 'TD',
        professor: 'Dr. Johnson',
        groupe: 'PHYS201'
      },
      day:'LUNDI',
      time:'8:30-10:00',
      conflictTypes: ['Room Conflict', 'Time Conflict']
    },
    {
      seance1: {
        name: 'Chemistry 301',
        id: 3,
        room: 'B201',
        type: 'TP',
        professor: 'Dr. Brown',
        groupe: 'CHEM301'
      },
      seance2: {
        name: 'Biology 202',
        id: 4,
        room: 'B202',
        type: 'COURS',
        professor: 'Dr. Brown',
        groupe: 'BIO202'
      },
      day:'MARDI',
      time:'8:30-10:00',
      conflictTypes: ['Professor Conflict']
    }
  ];
  salles:SalleList={}

  constructor(private roomService: RoomService,private injector: Injector) {
    // Initialize the filtered rooms observables
    this.filteredRooms1 = this.roomControl1.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRooms(value || ''))
    );

    this.filteredRooms2 = this.roomControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRooms(value || ''))
    );
  }
  private destroy$ = new Subject<void>();
  private _filterRooms(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.rooms.filter(room => room.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
// Lazy injection of the service
    this.roomService = this.injector.get(RoomService);
    // Subscribe to get the latest schedule data
    this.roomService.getSalles().subscribe((sallesList:SalleList) => {
      this.salles = sallesList;
      console.log(this.salles); // Just to confirm it's working
    });
    // After getting salles data, load available rooms for each conflict
    this.conflicts.forEach((conflict, index) => {
      this.loadAvailableRoomsForConflict(conflict.day, conflict.time, index);
    });
  }
  loadAvailableRoomsForConflict(day: string, time: string, conflictIndex: number): void {
    this.roomService.getAvailableRooms(day, time)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (rooms: string[]) => {
          this.availableRooms[conflictIndex] = rooms;
          console.log(`Available Rooms for Conflict #${conflictIndex + 1}:`, rooms);
        },
        error => {
          console.error(`Error loading available rooms for conflict #${conflictIndex + 1}:`, error);
        }
      );
  }

  // Function to refresh available rooms when day or time changes
  onTimeOrDayChange(conflict: SeanceConflict, index: number): void {
    this.loadAvailableRoomsForConflict(conflict.day, conflict.time, index);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getConflictIcon(conflictType: string): string {
    switch (conflictType) {
      case 'Room Conflict':
        return 'room';
      case 'Time Conflict':
        return 'schedule';
      case 'Professor Conflict':
        return 'person';
      default:
        return 'warning';
    }
  }

}

