import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, Subscription} from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Salle, SalleList, SallesDispo } from './models/Salle';
import { Seance } from './models/Seance';
import { Schedule } from './models/Schedule';
import{demoSalles} from './initialData';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private loaded = false;
  // Example of restructured data with the new Schedule interface
  private salles: SalleList = demoSalles;
  private sallesSubject = new BehaviorSubject<SalleList>({});
  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    this.sallesSubject.next(this.salles);
  }

  /**
   * Get all rooms
   */
  getSalles(): Observable<SalleList> {
    if (!this.loaded) {
      return of(this.salles).pipe(
        delay(1000),
        tap(salles => {
          this.loaded = true;
          this.sallesSubject.next(salles);
        })
      );
    }
    return this.sallesSubject.asObservable();
  }

  /**
   * Get room by ID
   */
  getSalleById(id: string): Observable<Salle | undefined> {
    return this.getSalles().pipe(
      map(salles => salles[id])
    );
  }

  /**
   * Check if room is available
   */
  isSalleAvailable(salle: string, day: string, time: string): Observable<boolean> {
    return this.getSalles().pipe(
      map(salles => {
        const salleData = salles[salle];
        if (!salleData) return true;
        const daySchedule = salleData.schedule[day];
        if (!daySchedule) return true;
        return  !(daySchedule[time]);
      })
    );
  }

  /**
   * Create availability map for rooms
   */
  createSallesDispo(): Observable<SallesDispo> {
    return this.getSalles().pipe(
      map(salleList => {
        const sallesDispo: SallesDispo = {};

        Object.values(salleList).forEach(salle => {
          Object.entries(salle.schedule).forEach(([day, niveaux]) => {
            if (!sallesDispo[day]) {
              sallesDispo[day] = {};
            }

            Object.entries(niveaux).forEach(([niveau, times]) => {
              Object.entries(times).forEach(([time, seances]) => {
                if (!sallesDispo[day][time]) {
                  sallesDispo[day][time] = [];
                }
                if (seances.length === 0) {
                  sallesDispo[day][time].push(salle);
                }
              });
            });
          });
        });

        return sallesDispo;
      })
    );
  }

  /**
   * Add a new session to a room
   */
  addSeance(day: string, time: string, niveau: string, seance: Seance): void {
    const currentSalles = this.sallesSubject.getValue();
    const salle = currentSalles[seance.room];

    if (salle) {
      if (!salle.schedule[day]) {
        salle.schedule[day] = {};
      }
      if (!salle.schedule[day][niveau]) {
        salle.schedule[day][niveau] = {};
      }
      if (!salle.schedule[day][niveau][time]) {
        salle.schedule[day][niveau][time] = [];
      }

      salle.schedule[day][niveau][time].push(seance);
      this.sallesSubject.next({...currentSalles});
    }
  }


  /**
   * Get available rooms by type
   */
  getAvailableRoomsByType(day: string, time: string, niveau: string, type: string): Observable<string[]> {
    return this.getAvailableRooms(day, time).pipe(
      map(rooms => rooms.filter(roomName => {
        const salle = this.salles[roomName];
        return salle && salle.type === type;
      }))
    );
  }

  /**
   * Get all available rooms with their details
   */
  getAvailableRoomsWithDetails(day: string, time: string, niveau: string): Observable<Salle[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            const daySchedule = salle.schedule[day];
            if (!daySchedule) return true;

            const niveauSchedule = daySchedule[niveau];
            if (!niveauSchedule) return true;

            return !niveauSchedule[time] || niveauSchedule[time].length === 0;
          });
      })
    );
  }

  /**
   * Edit an existing session
   */
  editSeance(day: string, time: string, niveau: string, seance: Seance, index: number): void {
    const currentSalles = this.sallesSubject.getValue();
    const salle = currentSalles[seance.room];

    if (salle?.schedule[day]?.[niveau]?.[time]) {
      salle.schedule[day][niveau][time][index] = seance;
      this.sallesSubject.next({...currentSalles});
    }
  }

  /**
   * Delete a session
   */
  deleteSeance(day: string, time: string, niveau: string, seance: Seance): void {
    const currentSalles = this.sallesSubject.getValue();
    const salle = currentSalles[seance.room];

    if (salle?.schedule[day]?.[niveau]?.[time]) {
      salle.schedule[day][niveau][time] = salle.schedule[day][niveau][time]
        .filter(s => s.id !== seance.id);

      // Clean up empty arrays
      if (salle.schedule[day][niveau][time].length === 0) {
        delete salle.schedule[day][niveau][time];
      }
      if (Object.keys(salle.schedule[day][niveau]).length === 0) {
        delete salle.schedule[day][niveau];
      }
      if (Object.keys(salle.schedule[day]).length === 0) {
        delete salle.schedule[day];
      }

      this.sallesSubject.next({...currentSalles});
    }
  }

  /**
   * Get available time slots for a specific day and room
   */
  getAvailableTimeSlots(day: string, salle: string, niveau: string): string[] {
    const timeSlots = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];
    const salleData = this.salles[salle];

    if (!salleData) return timeSlots;

    return timeSlots.filter(time => {
      const niveauSchedule = salleData.schedule[day]?.[niveau];
      return !niveauSchedule?.[time] || niveauSchedule[time].length === 0;
    });
  }


  /**
   * Get available rooms for a specific time slot
   * @param day - The day to check
   * @param time - The time slot to check
   * @returns Observable<string[]> - List of available room names
   */
  getAvailableRooms(day: string, time: string): Observable<string[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            // Get the day's schedule
            const daySchedule = salle.schedule[day];
            if (!daySchedule) return true; // Room is available if no schedule exists for the day

            // Check all niveaux for the time slot
            return !Object.values(daySchedule).some(niveauSchedule => {
              // Check if the time slot is occupied
              return niveauSchedule[time]?.length > 0;
            });
          })
          .map(salle => salle.name);
      }),

    );
  }

  /**
   * Get available rooms for a specific time slot and niveau
   * @param day - The day to check
   * @param time - The time slot to check
   * @param niveau - The academic level to check
   * @returns Observable<string[]> - List of available room names
   */
  getAvailableRoomsForNiveau(day: string, time: string, niveau: string): Observable<string[]> {
    return this.getSalles().pipe(
      map(salles => {
        return Object.values(salles)
          .filter(salle => {
            // Check specific niveau schedule
            const niveauSchedule = salle.schedule[day]?.[niveau];
            if (!niveauSchedule) return true;

            // Check if time slot is available
            return !niveauSchedule[time] || niveauSchedule[time].length === 0;
          })
          .map(salle => salle.name);
      }),

    );
  }

  /**
   * Helper method to get room capacity
   * @param roomName - Name of the room
   * @returns Observable<number> - Room capacity
   */
  getRoomCapacity(roomName: string): Observable<number> {
    return this.getSalles().pipe(
      map(salles => {
        const room = Object.values(salles).find(salle => salle.name === roomName);
        if (!room) {
          throw new Error('Room not found');
        }
        return room.capacite;
      }),

    );
  }

// Class-level properties
  private readonly currentDateTime = '2025-02-25 01:08:11';
  private readonly currentUser = 'YaacoubDouaa';
}
