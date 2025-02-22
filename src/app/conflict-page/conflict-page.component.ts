import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SeanceConflict} from '../models/Seance';
import {RoomService} from '../rooms.service';
import {SalleList, SallesDispo} from '../models/Salle';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith, Subject, takeUntil} from 'rxjs';
import {ConflictService} from '../conflict.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-conflict-page',
  standalone: false,
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './conflict-page.component.html',
  styleUrl: './conflict-page.component.css'
})
export class ConflictPageComponent implements OnInit{
  // FormControls for autocomplete
  roomControl1 = new FormControl('');
  roomControl2 = new FormControl('');
  availableRooms: { [key: number]: string[] } = {};
  rooms: string[] = [];
  filteredRooms1: Observable<string[]>;
  filteredRooms2: Observable<string[]>;
  // Optional: Save changes to backend
  displayText="Conflicts";
  conflicts: SeanceConflict[] = []
  salles:SalleList={}
  fullText='';

  // Add these new properties
  filteredConflicts: SeanceConflict[] = [];
  originalConflicts: SeanceConflict[] = [];
  isFilterOpen = false;

  filters = {
    room: false,
    professor: false,
    time: false,
    dateFrom: null,
    dateTo: null,
    search: ''
  };

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    document.body.style.overflow = this.isFilterOpen ? 'hidden' : '';
  }



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
// Modified applyFilters method to work with your interface
  applyFilters(): void {
    // Start with all conflicts
    let filtered = [...this.originalConflicts];

    // Filter by conflict types
    if (this.filters.room || this.filters.professor || this.filters.time) {
      filtered = filtered.filter(conflict => {
        return conflict.conflictTypes.some(type => {
          if (this.filters.room && type.includes('ROOM')) return true;
          if (this.filters.professor && type.includes('PROFESSOR')) return true;
          if (this.filters.time && type.includes('TIME')) return true;
          return false;
        });
      });
    }

    // Filter by date range
    if (this.filters.dateFrom || this.filters.dateTo) {
      filtered = filtered.filter(conflict => {
        const conflictDate = new Date(conflict.day);
        const fromDate = this.filters.dateFrom ? new Date(this.filters.dateFrom) : null;
        const toDate = this.filters.dateTo ? new Date(this.filters.dateTo) : null;

        if (fromDate && toDate) {
          return conflictDate >= fromDate && conflictDate <= toDate;
        } else if (fromDate) {
          return conflictDate >= fromDate;
        } else if (toDate) {
          return conflictDate <= toDate;
        }
        return true;
      });
    }

    // Filter by search text
    if (this.filters.search.trim()) {
      const searchTerm = this.filters.search.toLowerCase().trim();
      filtered = filtered.filter(conflict =>
        // Search in seance1
        conflict.seance1.name?.toLowerCase().includes(searchTerm) ||
        conflict.seance1.professor?.toLowerCase().includes(searchTerm) ||
        conflict.seance1.room?.toLowerCase().includes(searchTerm) ||
        conflict.seance1.groupe?.toLowerCase().includes(searchTerm) ||
        // Search in seance2
        conflict.seance2.name?.toLowerCase().includes(searchTerm) ||
        conflict.seance2.professor?.toLowerCase().includes(searchTerm) ||
        conflict.seance2.room?.toLowerCase().includes(searchTerm) ||
        conflict.seance2.groupe?.toLowerCase().includes(searchTerm) ||
        // Search in day and time
        conflict.day?.toLowerCase().includes(searchTerm) ||
        conflict.time?.toLowerCase().includes(searchTerm)
      );
    }

    // Update the conflicts list
    this.conflicts = filtered;

    // Show feedback to user
    this.showFilterFeedback(filtered.length);

    // Close the filter sidebar
    this.toggleFilter();
  }


  // Add method to show feedback
  private showFilterFeedback(filteredCount: number): void {
    const message = filteredCount === 0
      ? 'No conflicts match the selected filters'
      : `Showing ${filteredCount} filtered conflicts`;

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  // Modify resetFilters to reset to original state
  resetFilters(): void {
    this.filters = {
      room: false,
      professor: false,
      time: false,
      dateFrom: null,
      dateTo: null,
      search: ''
    };

    // Reset to original conflicts
    this.conflicts = [...this.originalConflicts];

    // Show feedback
    this.snackBar.open('Filters have been reset', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  // Add method to check if any filters are active
  hasActiveFilters(): boolean {
    return this.filters.room ||
      this.filters.professor ||
      this.filters.time ||
      !!this.filters.dateFrom ||
      !!this.filters.dateTo ||
      !!this.filters.search.trim();
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
    this.animateText()
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

