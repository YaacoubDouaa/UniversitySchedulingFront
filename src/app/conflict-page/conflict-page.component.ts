import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {SeanceConflict} from '../models/Seance';
import {RoomService} from '../rooms.service';
import {SalleList, SallesDispo} from '../models/Salle';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith, Subject, takeUntil} from 'rxjs';
import {ConflictService} from '../conflict.service';
import {MatSnackBar} from '@angular/material/snack-bar';


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

  conflicts: SeanceConflict[] = []
  salles:SalleList={}

  constructor(private roomService: RoomService,private conflictService:ConflictService,private injector: Injector,private snackBar: MatSnackBar) {
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
    // Lazy injection of ConflictDetectionService
    this.conflictService = this.injector.get(ConflictService);
    // Subscribe to get the latest conflicts  data
    this.conflictService.getConflicts().subscribe((conflictList:SeanceConflict[]) => {
      this.conflicts = conflictList;
      console.log(this.conflicts); // Just to confirm it's working
    });
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

  // Handler for any attribute change
  onSeanceAttributeChange(): void {
    // Create a new reference to trigger change detection
    this.conflicts = [...this.conflicts];
    console.log('Conflicts updated:', this.conflicts);
    this.saveChanges(); // Optional: Save changes to backend
  }


  // Optional: Save changes to backend
  private saveChanges(): void {
    // Implement your save logic here
    // For example:
    // this.conflictService.updateConflicts(this.conflicts).subscribe(
    //   response => console.log('Changes saved successfully'),
    //   error => console.error('Error saving changes:', error)
    // );
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


  resolveConflict(index: number): void {
    if (this.conflictService.isConflictResolved(this.conflicts[index])) {
      this.conflictService.removeConflict(index);
      this.snackBar.open('Conflict resolved successfully!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Conflict not resolved! Please make necessary changes.', 'Close', { duration: 3000 });
    }
}}

