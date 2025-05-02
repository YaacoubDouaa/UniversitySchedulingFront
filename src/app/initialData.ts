import {Schedule} from './models/Schedule';
import {SalleList} from './models/Salle';

export const demoSchedule: Schedule = {
  'LUNDI': {
    'ING1_INFO': {
      '8:30-10:00': [{
        id: 1,
        name: 'Mathematics',
        type: 'COURS',
        professor: 'Dr. Smith',
        groupe: 'ING1_INFO',
        room: 'A-101',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 2,
        name: 'Physics',
        type: 'COURS',
        professor: 'Dr. Johnson',
        groupe: 'ING1_INFO',
        room: 'A-102',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD1': {
      '13:00-14:30': [{
        id: 3,
        name: 'Mathematics TD',
        type: 'TD',
        professor: 'Prof. Wilson',
        groupe: 'ING1_INFO_TD1',
        room: 'B-201',
        biWeekly: true
      }]
    }
  },
  'MARDI': {
    'ING1_INFO': {
      '8:30-10:00': [{
        id: 4,
        name: 'Computer Science',
        type: 'COURS',
        professor: 'Dr. Brown',
        groupe: 'ING1_INFO',
        room: 'A-103',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD2': {
      '10:15-11:45': [{
        id: 5,
        name: 'Physics TP',
        type: 'TP',
        professor: 'Prof. Davis',
        groupe: 'ING1_INFO_TD2',
        room: 'LAB-01',
        biWeekly: false
      }]
    }
  },
  'MERCREDI': {
    'ING1_INFO_TD1 || ING1_INFO_TD2': {
      '13:00-14:30': [{
        id: 6,
        name: 'Programming Workshop',
        type: 'TP',
        professor: 'Dr. Miller',
        groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
        room: 'LAB-02',
        biWeekly: true
      }]
    }
  }
};
export const demoSalles: SalleList = {
  'A-8': {
    id: 1,
    name: 'A-8',
    type: 'COURS',
    capacite: 50,
    schedule: {
      LUNDI: {
        'ING1_INFO': {
          '8:30-10:00': [{
            name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
            id: 1,
            groupe: 'ING1_INFO',
            room: 'A-8',
            type: 'COURS',
            professor: 'Sara MTIW',
            biWeekly: false
          }]
        }
      },

    }
  }
  ,'A-9': {
    id: 1,
    name: 'A-9',
    type: 'COURS',
    capacite: 50,
    schedule: {
      LUNDI: {
        'ING1_INFO': {
          '8:30-10:00': [{
            name: 'Ch-Ingénierie et interprétabilité des systèmes informatiques',
            id: 1,
            groupe: 'ING1_INFO',
            room: 'A-9',
            type: 'COURS',
            professor: 'Sara MTIW',
            biWeekly: false
          }]
        }}}}};
