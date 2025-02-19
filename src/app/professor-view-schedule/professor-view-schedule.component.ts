import { Component, OnInit } from '@angular/core';
import {ProfSchedule} from '../models/Professors';
import {Seance} from '../models/Seance';
import {SalleSchedule} from '../models/Salle';


@Component({
  selector: 'app-professor-view-schedule',
  templateUrl: './professor-view-schedule.component.html',
  styleUrls: ['./professor-view-schedule.component.css'],standalone:false
})
export class ProfessorViewScheduleComponent implements OnInit {
  days: string[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  timeSlots: string[] = [
    '08:00-09:30', '09:45-11:15', '11:30-13:00',
    '14:00-15:30', '15:45-17:15', '17:30-19:00'
  ];

  schedule: SalleSchedule = {
    MONDAY: {
      '08:00-09:30': {
        'ING_1': {
          name: 'Mathematics 101',
          id:12,
          room: 'A-101',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      },
      '11:30-13:00': {
        'ING_2': {
          name: 'Physics 202',
          id:16,
          room: 'B-203',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      }
    },
    TUESDAY: {
      '09:45-11:15': {
        'ING_3': {
          name: 'Chemistry 301',
          id:17,
          room: 'C-105',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      }
    },
    WEDNESDAY: {
      '14:00-15:30': {
        'ING_4': {
          name: 'Biology 102',
          id:18,
          room: 'D-201',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      }
    },
    THURSDAY: {
      '15:45-17:15': {
        'ING_5': {
          name: 'Computer Science 201',
          id:19,
          room: 'E-302',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      }
    },
    FRIDAY: {
      '11:30-13:00': {
        'ING_6': {
          name: 'Statistics 301',
          id:20,
          room: 'F-105',
          type: 'COURS',
          professor: 'Dr. Smith',
          groupe: 'ING_1',
          biWeekly: false
        }
      }
    }
  };

  constructor() { }

  ngOnInit(): void { }

  getSession(day: string, time: string): Seance | null {
    const daySchedule = this.schedule[day];
    if (daySchedule && daySchedule[time]) {
      // For simplicity, we're just returning the first class in the time slot
      // You might want to handle multiple classes in a single time slot differently
      return Object.values(daySchedule[time])[0];
    }
    return null;
  }
}
