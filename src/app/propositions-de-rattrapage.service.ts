import { Injectable } from '@angular/core';
import {PropositionDeRattrapage} from './models/Notifications';
import {Seance} from './models/Seance';
import {RattrapageService} from './rattrapage.service';
import {NotificationService} from './notifications.service';
import {BehaviorSubject, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropositionsDeRattrapageService {
  private propositionsSubject = new BehaviorSubject<any[]>([]);
  private propositionsByIdSubject = new BehaviorSubject<any[]>([]);

  propositions$ = this.propositionsSubject.asObservable();

  propositions: PropositionDeRattrapage[] = [
    {
      id: 1,
      date: '2025-03-10',
      reason: 'Maladie',
      status: 'En attente',
      enseignantId: 101,
      type: 'COURS',
      name: 'Mathématiques',
      niveau: 'ING_1'
    },
    {
      id: 2,
      date: '2025-03-12',
      reason: 'Voyage académique',
      status: 'En attente',
      enseignantId: 102,
      type: 'COURS',
      name: 'Physique',
      niveau: 'ING_1'
    },
  ];

propositionsById$ = this.propositionsSubject.asObservable();
  constructor(private rattrapageService: RattrapageService, private notificationService: NotificationService) {
    // Initialize with empty array
    this.propositionsSubject.next(this.propositions);
  }
  addProposition(proposition: any) {
    const current = this.propositionsSubject.value;
    this.propositionsSubject.next([proposition, ...current]);
  }

  updateProposition(id: number, updates: any) {
    const current = this.propositionsSubject.value;
    const updated = current.map(prop =>
      prop.id === id ? { ...prop, ...updates } : prop
    );
    this.propositionsSubject.next(updated);
  }
  confirmRattrapage(prop: PropositionDeRattrapage) {
    if (prop && prop.status === 'En attente') {
      prop.status = 'Confirmé';
      const dateObj = new Date(prop.date);
      const day = dateObj.toLocaleDateString('fr-FR', {weekday: 'long'}).toUpperCase();
      const time = '10:15-11:45';

      const seance: Seance = {
        name: prop.name,
        id: Math.floor(Math.random() * 1000),
        room: '',
        type: prop.type,
        professor: `Enseignant ${prop.enseignantId}`,
        groupe: prop.niveau,
        biWeekly: false
      };
      prop.status = 'Confirmé'
      this.rattrapageService.addRattrapageSeance(day, time, seance);
    }
    this.notificationService.addNotification(`Make-up session confirmed: ${prop.name} on ${prop.date}`, 'success', prop.enseignantId, 0);

  }
  changeRoom(proposition: any) {
    proposition.salle = null;
    // Add your room change logic here
  }
  rejectRattrapage(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'Refusé'} : prop
    );
    const refusedProp = this.propositions.find(prop => prop.id === id);
    if (refusedProp) {
      refusedProp.status = 'Refusé'
      this.notificationService.addNotification(`Make-up session rejected: ${refusedProp.name} on ${refusedProp.date}`, 'error', refusedProp.enseignantId, 0);
    }
  }

  reinitialiser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'En attente'} : prop
    );
  }
  private rattrapageScheduleMap = new Map<number, { day: string, time: string, seanceId: number }>();

  assignRoom(event: Event, propId: number) {
    const target = event.target as HTMLInputElement;
    const newSalle = target.value;

    // Get the stored mapping for this proposition
    const scheduleInfo = this.rattrapageScheduleMap.get(propId);

    if (!scheduleInfo) {
      this.notificationService.addNotification('Cannot update salle: session mapping not found', 'error', 0, 0);
      return;
    }

    const { day, time, seanceId } = scheduleInfo;

    // Update the salle
    const success = this.rattrapageService.updateSeanceSalle(
      day,
      time,
      seanceId,
      newSalle
    );

    if (success) {
      // Update the proposition's salle in the local array
      this.propositions = this.propositions.map(prop =>
        prop.id === propId ? { ...prop, salle: newSalle } : prop
      );

      this.notificationService.addNotification(`Salle updated to ${newSalle}`, 'success', 0, 0);

    } else {
      this.notificationService.addNotification('Failed to update salle', 'error', 0, 0);
    }
  }


  getPropositionById(id:string): Observable<PropositionDeRattrapage | undefined> {
    return this.propositions$.pipe(
      map(propositions => propositions.find(prop => prop.prof.codeEnseignet === id))
    );
  }

}
