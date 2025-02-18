import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PropositionDeRattrapage} from '../models/Notifications';
import {Seance} from '../models/Seance';
import {RattrapageService} from '../rattrapage.service';

import {RattrapageSchedule} from '../models/Schedule';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {NotificationService} from '../notifications.service';
import {Salle} from '../models/Salle';

@Component({
  selector: 'app-proposition-rattrapage',
  templateUrl: './proposition-rattrapage.component.html',
  styleUrls: ['./proposition-rattrapage.component.css'],
  standalone: false
})
export class PropositionRattrapageComponent implements OnInit {
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

  displayedColumns: string[] = ['id', 'date', 'reason', 'status', 'enseignantId', 'type', 'niveau', 'actions'];
  sallesList: Salle[] = [];
  private rattrapageScheduleMap = new Map<number, { day: string, time: string, seanceId: number }>();

  constructor(
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    // You can load propositions from a service here if needed
    this.propositions.forEach(prop => {
      this.notificationService.addNotification(`New make-up session proposal: ${prop.name} on ${prop.date}`, 'info');
    });
  }

  openConfirmationDialog(action: string, prop: PropositionDeRattrapage): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {action, proposition: prop}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'confirm') {
          this.confirmer(prop);
        } else if (action === 'reject') {
          this.refuser(prop.id);
        }
      }
    });
  }

  confirmer(prop: PropositionDeRattrapage) {
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
        code: prop.niveau,
        biWeekly: false
      };

      this.rattrapageService.addRattrapageSeance(day, time, seance);
    }
    this.notificationService.addNotification(`Make-up session confirmed: ${prop.name} on ${prop.date}`, 'success');

  }

  refuser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'Refusé'} : prop
    );
    const refusedProp = this.propositions.find(prop => prop.id === id);
    if (refusedProp) {
      this.notificationService.addNotification(`Make-up session rejected: ${refusedProp.name} on ${refusedProp.date}`, 'error');
    }
  }

  reinitialiser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'En attente'} : prop
    );
  }

  updateSalle(event: Event, propId: number) {
    const target = event.target as HTMLInputElement;
    const newSalle = target.value;

    // Get the stored mapping for this proposition
    const scheduleInfo = this.rattrapageScheduleMap.get(propId);

    if (!scheduleInfo) {
      this.notificationService.addNotification('Cannot update salle: session mapping not found', 'error');
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

      this.notificationService.addNotification(
        `Salle updated to ${newSalle}`,
        'success'
      );
    } else {
      this.notificationService.addNotification(
        'Failed to update salle',
        'error'
      );
    }
  }

}
