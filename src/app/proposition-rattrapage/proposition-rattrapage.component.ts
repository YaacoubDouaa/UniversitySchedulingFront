import { Component } from '@angular/core';
import { PropositionDeRattrapage } from '../models/Notifications';

import { Seance } from '../models/Seance';
import {RattrapageService} from '../rattrapage.service';

@Component({
  selector: 'app-proposition-rattrapage',
  standalone: false,
  templateUrl: './proposition-rattrapage.component.html',
  styleUrls: ['./proposition-rattrapage.component.css']
})
export class PropositionRattrapageComponent {
  propositions: PropositionDeRattrapage[] = [
    { id: 1, date: '2025-03-10', reason: 'Maladie', status: 'En attente', enseignantId: 101 ,type:'COURS',name:'',niveau:'ING_1'},
    { id: 2, date: '2025-03-12', reason: 'Voyage académique', status: 'En attente', enseignantId: 102,type:'COURS',name:'',niveau:'ING_1'},
  ];

  constructor(private rattrapageService: RattrapageService) {}

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
      this.rattrapageService.addRattrapageSeance(day, time, seance);
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
