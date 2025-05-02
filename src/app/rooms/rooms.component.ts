import {ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RattrapageSchedule, Schedule } from '../models/Schedule';
import { ScheduleService } from '../schedule-service.service';
import { SalleList, SalleSchedule } from '../models/Salle';
import { Seance } from '../models/Seance';
import { RoomService } from '../rooms.service';
import {map, Subscription} from 'rxjs';
import {RattrapageService} from '../rattrapage.service';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  // Constants for scheduling
  readonly days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
  readonly types = ['COURS', 'TD', 'TP', 'SEMINAIRE'];
  rattrapageSchedule: RattrapageSchedule = {};
  private subscriptions = new Subscription();
  // Component state
  selectedDay: string = '';
  selectedTime: string = '';
  selectedType: string = '';
  selectedNiveau: string = '';
  protected selectedFrequency: 'weekly' | 'biweekly' = 'weekly';
  showModal: boolean = false;
  protected showAddModal: boolean = false;
  // Constants

  readonly niveaux: string[] = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];

  // Data structures
  salles: SalleList = {};
  salleSchedule: Schedule = this.initializeEmptySchedule();

  // Currently selected activity for modal operations
  selectedActivity: {
    seance: Seance;
    day: string;
    time: string;
    niveau?: string;
  } | null = null;

  constructor(private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router,
    private salleScheduleService: ScheduleService,
    private injector: Injector,
    private roomService: RoomService,
    private rattrapageService:RattrapageService
  ) {}

  /**
   * Initialize component and fetch room data
   */
  ngOnInit(): void {
    this.initializeRoomService();
    this.loadRoomData();
    this.loadRattrapageSchedule();
    this.loadSchedule();
  }
  /**
   * Load schedule
   */
  private loadSchedule(): void {
    this.salleScheduleService=this.injector.get(ScheduleService);
    this.subscriptions.add(
      this.salleScheduleService.getSchedule().subscribe({
        next: (schedule) => {
          this.salleSchedule = schedule;
          this.cdRef.detectChanges(); // Manually trigger view update

        },
        error: (error) => {
          console.error('Error loading rattrapage schedule:', error);
        }
      })
    );
  }
  /**
   * Load rattrapage schedule
   */
  private loadRattrapageSchedule(): void {
    this.rattrapageService=this.injector.get(RattrapageService);
    this.subscriptions.add(
      this.rattrapageService.getRattrapageSchedule().subscribe({
        next: (schedule) => {
          this.rattrapageSchedule = schedule;
          this.cdRef.detectChanges(); // Manually trigger view update

        },
        error: (error) => {
          console.error('Error loading rattrapage schedule:', error);
        }
      })
    );
  }
  /**
   * Initialize empty schedule structure
   */
  private initializeEmptySchedule(): Schedule {
    return this.days.reduce((acc, day) => ({
      ...acc,
      [day]: {}
    }), {});
  }

  /**
   * Initialize room service using injector
   */
  private initializeRoomService(): void {
    this.roomService = this.injector.get(RoomService);
  }

  /**
   * Load room data from service
   */
  private loadRoomData(): void {
    this.roomService=this.injector.get(RoomService);
    this.roomService.getSalles().subscribe({
      next: (sallesList: SalleList) => {
        this.salles = sallesList;
        console.log('Rooms loaded:', this.salles);
        this.cdRef.detectChanges(); // Manually trigger view update
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

changeSalle(name:string): void {
  this.salleScheduleService.changeSalleName(name);

}
  /**
   * Handle room selection
   */
  onSelectSalle(selectedSalle:string,salleSchedule: Schedule): void {
    this.salleScheduleService.changeSchedule(salleSchedule);
    this.changeSalle(selectedSalle);
    this.salleSchedule = salleSchedule;
    this.router.navigate(['/room-schedule']);
  }

  /**
   * Get color coding for room availability
   */
  getSalleColor(salle: string, day: string, time: string): string {
    return this.isSalleAvailable(salle, day, time)
      ? '#d4edda'  // Available - Green
      : '#f8d7da'; // Occupied - Red
  }

  /**
   * Filter rooms by type
   */
  shouldDisplaySalle(salle: any): boolean {
    if (!this.selectedType) return true;
    return salle.type === this.selectedType;
  }

  /**
   * Open modal for adding new session with a properly initialized new session
   * @param day Selected day
   * @param time Selected time slot
   * @param niveau Academic level/group
   */
  openAddModal(day: string, time: string, niveau: string): void {
    console.log('Opening add modal for day:', day, 'time:', time);

    // If niveau is not provided or empty, use the selectedNiveau from the component
    if (!niveau || niveau.trim() === '') {
      niveau = this.selectedNiveau || this.niveaux[0];
    }

    // Get the selected room - either the room being viewed or the first room
    const selectedRoom = Object.keys(this.salles)[0];

    // Explicitly create a completely new session object
    // IMPORTANT: set id to 0 for new sessions
    this.selectedActivity = {
      seance: {
        id: 0, // Use 0 instead of Math.random() for new sessions
        name: '',
        room: selectedRoom,
        type: 'COURS',
        professor: '',
        groupe: niveau,
        biWeekly: false // Default to weekly
      },
      day,
      time,
      niveau
    };

    // Reset the frequency selector to weekly by default
    this.selectedFrequency = 'weekly';

    // Show the modal
    this.showModal = true;

    // Force change detection
    this.cdRef.detectChanges();

    console.log('Add modal opened with:', {
      id: this.selectedActivity.seance.id,
      isZero: this.selectedActivity.seance.id === 0,
      room: selectedRoom
    });
  }

  /**
   * Save new session with real-time updates
   */
  saveAddChanges(): void {
    console.group('Add Session Debug Information');
    console.log('Date/Time:', '2025-05-02 19:31:41');
    console.log('User:', 'YaacoubDouaa');

    // Validate required fields
    if (!this.selectedActivity || !this.selectedActivity.niveau) {
      console.error('🛑 VALIDATION FAILED: Missing activity or niveau data');
      console.groupEnd();
      alert('Cannot add session: Missing required data');
      return;
    }

    const { day, time, seance, niveau } = this.selectedActivity;

    // Update the biWeekly property based on selected frequency
    seance.biWeekly = this.selectedFrequency === 'biweekly';
    console.log('Session frequency set to biWeekly:', seance.biWeekly);

    // Validate room selection
    if (!seance.room) {
      console.error('🛑 VALIDATION FAILED: Room is not selected');
      console.groupEnd();
      alert('Please select a room before adding the session');
      return;
    }

    // Validate other required fields
    if (!seance.name || !seance.professor || !seance.type || !seance.groupe) {
      console.error('🛑 VALIDATION FAILED: Missing required fields', {
        name: seance.name,
        professor: seance.professor,
        type: seance.type,
        groupe: seance.groupe
      });
      console.groupEnd();
      alert('Please fill in all required fields');
      return;
    }

    console.log('✅ VALIDATION PASSED: All required fields are present');
    console.log('Session details to be added:', {
      day,
      niveau,
      time,
      room: seance.room,
      name: seance.name,
      professor: seance.professor,
      type: seance.type,
      biWeekly: seance.biWeekly
    });

    this.salleScheduleService = this.injector.get(ScheduleService);

    // WORKAROUND: Pre-clean the schedule data to remove ghost sessions
    try {
      // Get the current schedule
      const currentSchedule = this.salleScheduleService.getScheduleSnapshot();
      console.log('Current schedule before workaround:', currentSchedule);

      // Ensure the structure exists
      if (!currentSchedule[day]) {
        currentSchedule[day] = {};
      }
      if (!currentSchedule[day][niveau]) {
        currentSchedule[day][niveau] = {};
      }

      // Force delete any existing sessions at this time slot
      if (currentSchedule[day][niveau][time]) {
        console.log('Applying workaround: Clearing old session data at this time slot');
        delete currentSchedule[day][niveau][time];
      }

      // Update the schedule
      console.log('Updating schedule with cleaned data');
      this.salleScheduleService.updateSchedule(currentSchedule);
    } catch (error) {
      console.error('Workaround failed:', error);
      // Continue anyway - the workaround failing shouldn't stop us from attempting to add
    }

    // Now try to add the session with cleaned data
    console.log('🔄 CALLING SERVICE: addSession with params', day, niveau, time, seance);

    // Fix parameter order: day, niveau, time, seance
    this.salleScheduleService.addSession(day, niveau, time, seance).subscribe({
      next: (success) => {
        console.log('✅ SERVICE RESPONSE: Success =', success);

        if (success) {
          console.log('Session added successfully to schedule service');

          // Update local state
          const currentSchedule = this.salleScheduleService.getScheduleSnapshot();
          this.salleSchedule = { ...currentSchedule };
          console.log('Updated local schedule state');

          // Also update the room's schedule in RoomService
          this.roomService.addSeance(day, time, niveau, seance);
          console.log('Session added to room service');

          // Refresh room data
          console.log('Refreshing room data...');
          this.refreshRoomData();

          // Close modal
          this.showModal = false;
          this.selectedActivity = null;
          console.log('Modal closed and selected activity reset');

          // Show confirmation to user
          console.log('Showing confirmation message to user');
          console.groupEnd();

          alert(`Success! Session "${seance.name}" has been added for ${day} at ${time}.`);
        }
      },
      error: (error) => {
        console.error('🛑 SERVICE ERROR:', error);
        console.log('Error details:', {
          message: error.message,
          stack: error.stack
        });
        console.groupEnd();

        // Show error to user
        alert('Failed to add session: ' + (error.message || 'Unknown error'));
      }
    });
  }
  /**
   * Close modal dialog
   */
  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showModal = false;
    this.selectedActivity = null;
  }

  /**
   * System Configuration
   */
  private readonly currentDateTime = '2025-02-25 03:34:19';
  private readonly currentUser = 'YaacoubDouaa';

  /**
   * Gets all sessions (regular and makeup) for a specific room, day, and time
   * @param salle - Room name
   * @param day - Day of the week
   * @param time - Time slot
   * @returns Array of sessions for the specified parameters
   */
  getSessions(salle: string, day: string, time: string): Seance[] {
    console.log(`Checking sessions for Room=${salle}, Day=${day}, Time=${time}`);

    try {
      // Get the room data
      const roomData = this.salles?.[salle];

      if (!roomData || !roomData.schedule || !roomData.schedule[day]) {
        // No schedule exists for this room/day
        return [];
      }

      // We need to check ALL niveaux for this day and time
      let allSessions: Seance[] = [];

      // Loop through each niveau in the day's schedule
      Object.keys(roomData.schedule[day]).forEach(niveau => {
        // Get sessions for this niveau at the specified time
        const sessionsForNiveau = roomData.schedule[day][niveau]?.[time] || [];

        if (sessionsForNiveau.length > 0) {
          console.log(`Found ${sessionsForNiveau.length} sessions in room ${salle} for ${niveau} on ${day} at ${time}`);
          allSessions = [...allSessions, ...sessionsForNiveau];
        }
      });

      // Also check for rattrapage sessions
      const rattrapageSessions = this.rattrapageSchedule?.[day]?.[time]?.filter(
        session => session.room === salle
      ) || [];

      if (rattrapageSessions.length > 0) {
        console.log(`Found ${rattrapageSessions.length} rattrapage sessions in room ${salle} on ${day} at ${time}`);
        allSessions = [...allSessions, ...rattrapageSessions];
      }

      console.log(`Total sessions for room ${salle} on ${day} at ${time}: ${allSessions.length}`);

      return allSessions;
    } catch (error) {
      console.error('Error in getSessions:', error);
      return [];
    }
  }


  /**
   * Check if a room is available (including rattrapage sessions)
   */


  // Add to existing ngOnDestroy or create it if it doesn't exist
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Validate session data
   */
  private validateSession(seance: Seance): boolean {
    return !!(seance.name && seance.room && seance.professor && seance.groupe);
  }

  protected readonly Object = Object;


  /**
   * Check if a room is available (including rattrapage sessions)
   */
  isSalleAvailable(salle: string, day: string, time: string): boolean {
    try {
      // Get all sessions for the room at the specified time
      const sessions = this.getSessions(salle, day, time);

      // Room is available if there are no sessions
      const isAvailable = sessions.length === 0;
      console.log(`Room ${salle} on ${day} at ${time} is ${isAvailable ? 'available' : 'occupied'}`);

      return isAvailable;
    } catch (error) {
      console.error('Error checking room availability:', error);
      return false; // Return false on error as a safety measure
    }
  }

  /**
   * Refresh room data
   */
  private refreshRoomData(): void {
    this.loadRoomData();
    this.loadRattrapageSchedule();
    this.loadSchedule();
    this.cdRef.detectChanges();
  }

  /**
   * Save edited session with real-time updates
   */
  /**
   * Save edited session with real-time updates and enhanced error handling
   */
  saveEditChanges(): void {
    console.group('Edit Session Debug Information');
    console.log('Date/Time:', '2025-05-02 19:01:09');
    console.log('User:', 'YaacoubDouaa');
    console.log('Selected activity:', this.selectedActivity);

    // Validate required fields
    if (!this.selectedActivity || !this.selectedActivity.niveau) {
      console.error('🛑 VALIDATION FAILED: Missing activity or niveau data');
      console.groupEnd();
      alert('Cannot update session: Missing required data');
      return;
    }

    const { day, time, seance, niveau } = this.selectedActivity;

    // Update the biWeekly property based on selected frequency
    seance.biWeekly = this.selectedFrequency === 'biweekly';
    console.log('Session frequency set to biWeekly:', seance.biWeekly);

    // Validate all required fields
    if (!seance.name || !seance.professor || !seance.type || !seance.groupe || !seance.room) {
      console.error('🛑 VALIDATION FAILED: Missing required fields', {
        name: seance.name,
        professor: seance.professor,
        type: seance.type,
        groupe: seance.groupe,
        room: seance.room
      });
      console.groupEnd();
      alert('Please fill in all required fields');
      return;
    }

    console.log('✅ VALIDATION PASSED: All required fields are present');

    this.salleScheduleService = this.injector.get(ScheduleService);

    console.log('🔄 CALLING SERVICE: updateSession with params', day, time, niveau, seance);

    // Call the service
    this.salleScheduleService.updateSession(day, time, niveau, seance).subscribe({
      next: (success) => {
        console.log('✅ SERVICE RESPONSE: Success =', success);

        if (success) {
          console.log('Session updated successfully');

          // Update local state
          const currentSchedule = this.salleScheduleService.getScheduleSnapshot();
          this.salleSchedule = { ...currentSchedule };

          // Also update the room's schedule in RoomService
          // First find the previous room data if it exists
          this.roomService.editSeance(day, time, niveau, seance, 0); // Assuming index 0, might need to find real index

          // Refresh room data
          console.log('Refreshing room data...');
          this.refreshRoomData();

          // Close modal
          this.showModal = false;
          this.selectedActivity = null;
          console.log('Modal closed and selected activity reset');

          // Force UI update
          this.cdRef.detectChanges();

          // Show confirmation to user
          alert(`Session "${seance.name}" has been updated successfully.`);
        } else {
          console.error('🛑 Service returned false');
          alert('Failed to update session. Please try again.');
        }
      },
      error: (error) => {
        console.error('🛑 SERVICE ERROR:', error);
        console.log('Error details:', {
          message: error.message,
          stack: error.stack
        });
        alert('Failed to update session: ' + (error.message || 'Unknown error'));
      },
      complete: () => {
        console.log('✅ Update operation completed');
        console.groupEnd();
      }
    });
  }

  /**
   * Save delete changes with real-time updates
   */
  saveDeleteChanges(): void {
    if (this.selectedActivity && this.selectedActivity.niveau) {
      const { day, time, seance, niveau } = this.selectedActivity;

      this.salleScheduleService.deleteSession(day, time, niveau, seance.id).subscribe({
        next: (success) => {
          if (success) {
            // Update local state
            const currentSchedule = this.salleScheduleService.getScheduleSnapshot();
            this.salleSchedule = { ...currentSchedule };

            // Update room service state
            this.roomService.getSalles().subscribe(sallesList => {
              this.salles = sallesList;

              // Force UI update
              this.refreshRoomData();
            });

            // Close modal
            this.showModal = false;
            this.selectedActivity = null;
          }
        },
        error: (error) => {
          console.error('Error deleting session:', error);
          // Handle error (show message to user)
        }
      });
    }
  }

  /**
   * Refresh data after changes
   */
  private refreshData(): void {
    // Refresh schedule
    this.loadSchedule();

    // Refresh room data
    this.loadRoomData();

    // Refresh rattrapage schedule
    this.loadRattrapageSchedule();

    // Force UI update
    this.cdRef.detectChanges();
}

  /**
   * Session being viewed in the view modal
   */
  viewingSessions: Seance[] = [];
  showViewModal: boolean = false;
  viewModalTitle: string = '';

  /**
   * Open modal for viewing session details
   */
  openViewModal(salle: string, day: string, time: string, niveau: string): void {
    console.log(`Opening view modal for ${salle} on ${day} at ${time}`);

    // Get sessions for this room, day, and time
    const sessions = this.getSessions(salle, day, time);

    if (sessions && sessions.length > 0) {
      // Set up view modal data
      this.viewingSessions = sessions;
      this.viewModalTitle = `Sessions in ${salle} on ${day} at ${time}`;
      this.showViewModal = true;

      console.log('Found sessions:', sessions);
      this.cdRef.detectChanges();
    } else {
      console.log('No sessions found');
      alert('No sessions found for this time slot.');
    }
  }

  /**
   * Close the view modal
   */
  closeViewModal(): void {
    this.showViewModal = false;
    this.viewingSessions = [];
    this.viewModalTitle = '';
    this.cdRef.detectChanges();
  }
}
