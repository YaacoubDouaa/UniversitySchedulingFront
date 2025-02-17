import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {SeanceConflict} from '../models/Seance';

@Component({
  selector: 'app-conflict-page',
  standalone: false,

  templateUrl: './conflict-page.component.html',
  styleUrl: './conflict-page.component.css'
})
export class ConflictPageComponent {
  conflicts: SeanceConflict[] = [
    {
      seance1: {
        name: 'Mathematics 101',
        id: 1,
        room: 'A101',
        type: 'COURS',
        professor: 'Dr. Smith',
        code: 'MATH101'
      },
      seance2: {
        name: 'Physics 201',
        id: 2,
        room: 'A101',
        type: 'TD',
        professor: 'Dr. Johnson',
        code: 'PHYS201'
      },
      conflictTypes: ['Room Conflict', 'Time Conflict']
    },
    {
      seance1: {
        name: 'Chemistry 301',
        id: 3,
        room: 'B201',
        type: 'TP',
        professor: 'Dr. Brown',
        code: 'CHEM301'
      },
      seance2: {
        name: 'Biology 202',
        id: 4,
        room: 'B202',
        type: 'COURS',
        professor: 'Dr. Brown',
        code: 'BIO202'
      },
      conflictTypes: ['Professor Conflict']
    }
  ];

  constructor() { }

  ngOnInit(): void { }

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

}

