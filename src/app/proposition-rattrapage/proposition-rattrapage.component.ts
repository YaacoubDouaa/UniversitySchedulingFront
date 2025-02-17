import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropositionDeRattrapage } from '../models/Notifications';
import { Seance } from '../models/Seance';
import { RattrapageService } from '../rattrapage.service';

import { RattrapageSchedule } from '../models/Schedule';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-proposition-rattrapage',
  templateUrl: './proposition-rattrapage.component.html',
  styleUrls: ['./proposition-rattrapage.component.css'],
  standalone:false
})
export class PropositionRattrapageComponent implements OnInit {
  propositions: PropositionDeRattrapage[] = [
    { id: 1, date: '2025-03-10', reason: 'Maladie', status: 'En attente', enseignantId: 101, type: 'COURS', name: 'Mathématiques', niveau: 'ING_1' },
    { id: 2, date: '2025-03-12', reason: 'Voyage académique', status: 'En attente', enseignantId: 102, type: 'COURS', name: 'Physique', niveau: 'ING_1' },
  ];

  displayedColumns: string[] = ['id', 'date', 'reason', 'status', 'enseignantId', 'type', 'niveau', 'actions'];

  rattrapageSchedule: RattrapageSchedule = {};

  constructor(
    private rattrapageService: RattrapageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // You can load propositions from a service here if needed
  }

  openConfirmationDialog(action: string, prop: PropositionDeRattrapage): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { action, proposition: prop }
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
      const day = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
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

      this.rattrapageService.addRattrapageSeance(this.rattrapageSchedule, day, time, seance);
    }
  }

  refuser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? { ...prop, status: 'Refusé' } : prop
    );
  }

  reinitialiser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? { ...prop, status: 'En attente' } : prop
    );
  }
}
