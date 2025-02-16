import { Component } from '@angular/core';
import {PropositionDeRattrapage} from '../models/Notifications';

@Component({
  selector: 'app-proposition-rattrapage',
  standalone: false,

  templateUrl: './proposition-rattrapage.component.html',
  styleUrl: './proposition-rattrapage.component.css'
})
export class PropositionRattrapageComponent {
  propositions: PropositionDeRattrapage[] = [
    { id: 1, date: '2025-03-10', reason: 'Maladie', status: 'En attente', enseignantId: 101 },
    { id: 2, date: '2025-03-12', reason: 'Voyage académique', status: 'En attente', enseignantId: 102 },
  ];

  confirmer(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? { ...prop, status: 'Confirmé' } : prop
    );
  }

  refuser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? { ...prop, status: 'Refusé' } : prop
    );
  }
}
