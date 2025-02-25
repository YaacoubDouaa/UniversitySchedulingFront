import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PropositionDeRattrapage } from './models/Notifications';
import { Seance } from './models/Seance';
import { RattrapageService } from './rattrapage.service';
import { NotificationService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class PropositionsDeRattrapageService {
  /**
   * System state
   */
  private readonly currentDateTime = '2025-02-24 19:54:21';
  private readonly currentUser = 'YaacoubDouaa';
  private readonly currentUserId = '3';

  /**
   * Initial propositions data
   */
  private readonly initialPropositions: PropositionDeRattrapage[] = [
    {
      id: 1,
      date: '2025-03-10',
      reason: 'Maladie',
      status: 'En attente',
      enseignantId: 101,
      type: 'COURS',
      name: 'Mathématiques',
      niveau: 'ING1_INFO'
    },
    {
      id: 2,
      date: '2025-03-12',
      reason: 'Voyage académique',
      status: 'En attente',
      enseignantId: 102,
      type: 'TD',
      name: 'Physique',
      niveau: 'ING2_INFO'
    }
  ];

  /**
   * State management
   */
  private propositionsSubject = new BehaviorSubject<PropositionDeRattrapage[]>(this.initialPropositions);
  propositions$ = this.propositionsSubject.asObservable();

  private propositionsByIdSubject = new BehaviorSubject<PropositionDeRattrapage[]>([]);
  propositionsById$ = this.propositionsByIdSubject.asObservable();

  /**
   * Schedule mapping
   */
  private rattrapageScheduleMap = new Map<number, {
    day: string;
    time: string;
    seanceId: number;
  }>();

  constructor(
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService
  ) {  // Initialize propositionsById when service is created
    this.initializePropositionsById();}
  /**
   * Initialize propositionsById from initial propositions
   */
  private initializePropositionsById(): void {
    const currentUserId = this.getCurrentUserId();
    const filteredPropositions = this.initialPropositions.filter(
      prop => prop.enseignantId.toString() === currentUserId
    );
    this.propositionsByIdSubject.next(filteredPropositions);
  }
  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    // This should be replaced with actual user authentication
    return '3'; // Example ID
  }
  /**
   * Add new proposition
   */
  addProposition(proposition: PropositionDeRattrapage): void {
    const current = this.propositionsSubject.value;
    const newProposition = {
      ...proposition,
      id: Math.max(...current.map(p => p.id), 0) + 1,
      status: 'En attente'
    };
    this.propositionsSubject.next([newProposition, ...current]);

    // Update propositionsById if it belongs to current user
    if (newProposition.enseignantId.toString() === this.getCurrentUserId()) {
      const currentById = this.propositionsByIdSubject.value;
      this.propositionsByIdSubject.next([newProposition, ...currentById]);
    }
  }

  /**
   * Update proposition
   */
  updateProposition(id: number, updates: Partial<PropositionDeRattrapage>): void {
    const current = this.propositionsSubject.value;
    this.propositionsSubject.next(
      current.map(prop => prop.id === id ? { ...prop, ...updates } : prop)
    );
    // Update propositionsById if it exists there
    const currentById = this.propositionsByIdSubject.value;
    if (currentById.some(prop => prop.id === id)) {
      const updatedPropositionsById = currentById.map(prop =>
        prop.id === id ? { ...prop, ...updates } : prop
      );
      this.propositionsByIdSubject.next(updatedPropositionsById);
    }
  }
  /**
   * Get propositions by enseignant ID
   */
  getPropositionsById(enseignantId: string): Observable<PropositionDeRattrapage[]> {
    return this.propositions$.pipe(
      map(propositions => propositions.filter(p => p.enseignantId.toString() === enseignantId))
    );
  }
  /**
   * Confirm makeup session
   */
  confirmRattrapage(proposition: PropositionDeRattrapage): void {
    if (!proposition || proposition.status !== 'En attente') {
      this.notificationService.addNotification(
        'Invalid proposition or status',
        'error',
        proposition?.enseignantId || 0,
        0
      );
      return;
    }

    const seance: Seance = {
      id: this.generateSeanceId(),
      name: proposition.name,
      room: proposition.salle || '',
      type: proposition.type,
      professor: `Enseignant ${proposition.enseignantId}`,
      groupe: proposition.niveau,
      biWeekly: false,
      isRattrapage:false
    };

    const dateObj = new Date(proposition.date);
    const day = this.getDayName(dateObj);
    const time = this.getDefaultTimeSlot(dateObj);

    this.rattrapageService.addRattrapageSeance(day, time, seance).subscribe({
      next: () => {
        this.updateProposition(proposition.id, { status: 'Confirmé' });

        this.rattrapageScheduleMap.set(proposition.id, {
          day,
          time,
          seanceId: seance.id
        });

        this.notificationService.addNotification(
          `Make-up session confirmed: ${proposition.name} on ${proposition.date}`,
          'success',
          proposition.enseignantId,
          0
        );
      },
      error: (error) => {
        this.notificationService.addNotification(
          `Failed to create makeup session: ${error.message}`,
          'error',
          proposition.enseignantId,
          0
        );
      }
    });
  }

  /**
   * Reject makeup session
   */
  rejectRattrapage(id: number): void {
    const proposition = this.propositionsSubject.value.find(p => p.id === id);
    if (proposition) {
      this.updateProposition(id, { status: 'Refusé' });

      this.notificationService.addNotification(
        `Make-up session rejected: ${proposition.name} on ${proposition.date}`,
        'error',
        proposition.enseignantId,
        0
      );
    }
  }

  /**
   * Reset proposition status
   */
  reinitialiser(id: number): void {
    this.updateProposition(id, { status: 'En attente' });
  }

  /**
   * Assign room to session
   */
  assignRoom(propositionId: number, newRoom: string): void {
    const scheduleInfo = this.rattrapageScheduleMap.get(propositionId);
    if (!scheduleInfo) {
      this.notificationService.addNotification(
        'Cannot update room: session mapping not found',
        'error',
        0,
        0
      );
      return;
    }

    const { day, time, seanceId } = scheduleInfo;

    this.rattrapageService.updateSeanceSalle(day, time, seanceId, newRoom).subscribe({
      next: () => {
        this.updateProposition(propositionId, { salle: newRoom });
        this.notificationService.addNotification(
          `Room updated to ${newRoom}`,
          'success',
          0,
          0
        );
      },
      error: (error) => {
        this.notificationService.addNotification(
          `Failed to update room: ${error.message}`,
          'error',
          0,
          0
        );
      }
    });
  }

  /**
   * Get proposition by ID
   */
  getPropositionById(id: string): Observable<PropositionDeRattrapage | undefined> {
    return this.propositions$.pipe(
      map(propositions => propositions.find(p => p.enseignantId.toString() === id))
    );
  }

  /**
   * Generate unique seance ID
   */
  private generateSeanceId(): number {
    return Math.floor(Math.random() * 10000) + 1;
  }

  /**
   * Get day name in French
   */
  private getDayName(date: Date): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return days[date.getDay()];
  }

  /**
   * Get default time slot based on date
   */
  private getDefaultTimeSlot(date: Date): string {
    const hour = date.getHours();
    if (hour < 10) return '08:30-10:00';
    if (hour < 12) return '10:15-11:45';
    if (hour < 14) return '13:00-14:30';
    if (hour < 16) return '14:45-16:15';
    return '16:30-18:00';
  }

  /**
   * Get current date and time
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  /**
   * Get current user
   */
  getCurrentUser(): string {
    return this.currentUser;
  }
}
