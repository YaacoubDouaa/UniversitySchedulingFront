import { ProfList } from './models/Professors';
import { Seance } from './models/Seance';

export const INITIAL_PROFS_LIST: ProfList = {
  'YaacoubDouaa': {
    name: 'YaacoubDouaa',
    codeEnseignant: '3',
    heures: 18,
    schedule: {
      LUNDI: {
        'ING3_TIC': {
          '8:30-10:00': [{
            id: 301,
            name: 'Intelligence Artificielle',
            groupe: 'ING3_TIC',
            room: 'A-15',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }],
          '10:15-11:45': [{
            id: 302,
            name: 'TP Intelligence Artificielle',
            groupe: 'ING3_TIC_G1',
            room: 'LAB-2',
            type: 'TP',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }]
        }
      },
      MERCREDI: {
        'ING2_TIC': {
          '13:00-14:30': [{
            id: 303,
            name: 'Deep Learning',
            groupe: 'ING2_TIC',
            room: 'B-14',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }],
          '14:45-16:15': [{
            id: 304,
            name: 'TP Deep Learning',
            groupe: 'ING2_TIC_G1',
            room: 'LAB-1',
            type: 'TP',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }]
        }
      },
      VENDREDI: {
        'ING1_TIC': {
          '8:30-10:00': [{
            id: 305,
            name: 'Introduction au Machine Learning',
            groupe: 'ING1_TIC',
            room: 'C-12',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }]
        }
      }
    }
  },
  'Omar NASRI': {
    name: 'Omar NASRI',
    codeEnseignant: '1',
    heures: 15,
    schedule: {
      LUNDI: {
        'ING3_TIC': {
          '13:00-14:30': [{
            id: 101,
            name: 'Réseaux avancés',
            groupe: 'ING3_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Omar NASRI',
            biWeekly: false
          }]
        }
      },
      MARDI: {
        'ING2_TIC': {
          '8:30-10:00': [{
            id: 102,
            name: 'Ch-Réseaux Informatiques Avancés',
            groupe: 'ING2_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Omar NASRI',
            biWeekly: false
          }],
          '10:15-11:45': [{
            id: 103,
            name: 'TP Réseaux',
            groupe: 'ING2_TIC_G1',
            room: 'LAB-3',
            type: 'TP',
            professor: 'Omar NASRI',
            biWeekly: false
          }]
        }
      }
    }
  }
};

export interface Schedule {
  [day: string]: {
    [niveau: string]: {
      [time: string]: Seance[];
    };
  };
}
