import { ProfList } from './models/Professors';

export const INITIAL_PROFS_LIST: ProfList = {
  'YaacoubDouaa': {
    name: 'YaacoubDouaa',
    codeEnseignant: 'P003',
    heures: 18,
    schedule: {
      LUNDI: {
        '8:30-10:00': {
          'ING3_TIC': {
            id: 301,
            name: 'Intelligence Artificielle',
            groupe: 'ING3_TIC',
            room: 'A-15',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }
        },
        '10:15-11:45': {
          'ING3_TIC_G1': {
            id: 302,
            name: 'TP Intelligence Artificielle',
            groupe: 'ING3_TIC_G1',
            room: 'LAB-2',
            type: 'TP',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }
        }
      },
      MERCREDI: {
        '13:00-14:30': {
          'ING2_TIC': {
            id: 303,
            name: 'Deep Learning',
            groupe: 'ING2_TIC',
            room: 'B-14',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }
        },
        '14:45-16:15': {
          'ING2_TIC_G1': {
            id: 304,
            name: 'TP Deep Learning',
            groupe: 'ING2_TIC_G1',
            room: 'LAB-1',
            type: 'TP',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }
        }
      },
      VENDREDI: {
        '8:30-10:00': {
          'ING1_TIC': {
            id: 305,
            name: 'Introduction au Machine Learning',
            groupe: 'ING1_TIC',
            room: 'C-12',
            type: 'COURS',
            professor: 'YaacoubDouaa',
            biWeekly: false
          }
        }
      }
    }
  },
  'Omar NASRI': {
    name: 'Omar NASRI',
    codeEnseignant: 'P001',
    heures: 15,
    schedule: {
      LUNDI: {
        '13:00-14:30': {
          'ING3_TIC': {
            id: 101,
            name: 'Réseaux avancés',
            groupe: 'ING3_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Omar NASRI',
            biWeekly: false
          }
        }
      },
      MARDI: {
        '8:30-10:00': {
          'ING2_TIC': {
            id: 102,
            name: 'Ch-Réseaux Informatiques Avancés',
            groupe: 'ING2_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Omar NASRI',
            biWeekly: false
          }
        },
        '10:15-11:45': {
          'ING2_TIC_G1': {
            id: 103,
            name: 'TP Réseaux',
            groupe: 'ING2_TIC_G1',
            room: 'LAB-3',
            type: 'TP',
            professor: 'Omar NASRI',
            biWeekly: false
          }
        }
      }
    }
  },
  'Hana CHAIEB': {
    name: 'Hana CHAIEB',
    codeEnseignant: 'P002',
    heures: 12,
    schedule: {
      MARDI: {
        '13:00-14:30': {
          'ING2_TIC': {
            id: 201,
            name: 'Sécurité des Systèmes',
            groupe: 'ING2_TIC',
            room: 'B-12',
            type: 'COURS',
            professor: 'Hana CHAIEB',
            biWeekly: false
          }
        },
        '14:45-16:15': {
          'ING2_TIC_G1': {
            id: 202,
            name: 'TP Sécurité',
            groupe: 'ING2_TIC_G1',
            room: 'LAB-4',
            type: 'TP',
            professor: 'Hana CHAIEB',
            biWeekly: false
          }
        }
      },
      JEUDI: {
        '10:15-11:45': {
          'ING3_TIC': {
            id: 203,
            name: 'Cryptographie',
            groupe: 'ING3_TIC',
            room: 'A-14',
            type: 'COURS',
            professor: 'Hana CHAIEB',
            biWeekly: false
          }
        }
      }
    }
  },
  'Ahmed BENNOUR': {
    name: 'Ahmed BENNOUR',
    codeEnseignant: 'P004',
    heures: 16,
    schedule: {
      MERCREDI: {
        '8:30-10:00': {
          'ING1_TIC': {
            id: 401,
            name: 'Base de données',
            groupe: 'ING1_TIC',
            room: 'A-11',
            type: 'COURS',
            professor: 'Ahmed BENNOUR',
            biWeekly: false
          }
        },
        '10:15-11:45': {
          'ING1_TIC_G1': {
            id: 402,
            name: 'TP Base de données',
            groupe: 'ING1_TIC_G1',
            room: 'LAB-1',
            type: 'TP',
            professor: 'Ahmed BENNOUR',
            biWeekly: false
          }
        }
      },
      JEUDI: {
        '13:00-14:30': {
          'ING2_TIC': {
            id: 403,
            name: 'Systèmes distribués',
            groupe: 'ING2_TIC',
            room: 'B-15',
            type: 'COURS',
            professor: 'Ahmed BENNOUR',
            biWeekly: false
          }
        }
      }
    }
  }
};
