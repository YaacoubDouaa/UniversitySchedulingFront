// Current Date and Time (UTC): 2025-05-06 15:36:07
// Current User's Login: YaacoubDouaa

import { Schedule } from '../models/Schedule';
import { SalleList } from '../models/Salle';

export const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];
export const timeSlots = [
  '08:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'
];

// Student groups by year and specialization
export const groups = {
  firstYear: ['ING1_INFO', 'ING1_INFO_TD1', 'ING1_INFO_TD2', 'ING1_ELEC', 'ING1_ELEC_TD1', 'ING1_ELEC_TD2'],
  secondYear: ['ING2_INFO', 'ING2_INFO_TD1', 'ING2_INFO_TD2', 'ING2_ELEC', 'ING2_ELEC_TD1', 'ING2_ELEC_TD2'],
  thirdYear: ['ING3_INFO', 'ING3_INFO_TD1', 'ING3_INFO_TD2', 'ING3_ELEC', 'ING3_ELEC_TD1', 'ING3_ELEC_TD2'],
  masterYear: ['MASTER_IA', 'MASTER_CYBER', 'MASTER_IOT']
};

// Comprehensive demo schedule
export const demoSchedule: Schedule = {
  'LUNDI': {
    'ING1_INFO': {
      '08:30-10:00': [{
        id: 101,
        name: 'Analyse Mathématique',
        type: 'COURS',
        professor: 'Dr. Martin Bernard',
        groupe: 'ING1_INFO',
        room: 'A-101',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 102,
        name: 'Physique Générale',
        type: 'COURS',
        professor: 'Dr. Sophie Lambert',
        groupe: 'ING1_INFO',
        room: 'A-102',
        biWeekly: false
      }],
      '13:00-14:30': [{
        id: 103,
        name: 'Introduction aux Algorithmes',
        type: 'COURS',
        professor: 'Dr. Thomas Dupont',
        groupe: 'ING1_INFO',
        room: 'A-103',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD1': {
      '14:45-16:15': [{
        id: 104,
        name: 'Travaux Dirigés Mathématiques',
        type: 'TD',
        professor: 'Prof. Claire Moreau',
        groupe: 'ING1_INFO_TD1',
        room: 'B-201',
        biWeekly: true
      }]
    },
    'ING1_INFO_TD2': {
      '16:30-18:00': [{
        id: 105,
        name: 'Travaux Dirigés Mathématiques',
        type: 'TD',
        professor: 'Prof. Claire Moreau',
        groupe: 'ING1_INFO_TD2',
        room: 'B-202',
        biWeekly: true
      }]
    },
    'ING2_INFO': {
      '08:30-10:00': [{
        id: 106,
        name: 'Structures de Données Avancées',
        type: 'COURS',
        professor: 'Dr. Julien Petit',
        groupe: 'ING2_INFO',
        room: 'A-201',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 107,
        name: 'Bases de Données',
        type: 'COURS',
        professor: 'Dr. Marie Lefevre',
        groupe: 'ING2_INFO',
        room: 'A-202',
        biWeekly: false
      }]
    },
    'ING3_INFO': {
      '13:00-14:30': [{
        id: 108,
        name: 'Intelligence Artificielle',
        type: 'COURS',
        professor: 'Dr. Philippe Martin',
        groupe: 'ING3_INFO',
        room: 'A-301',
        biWeekly: false,
        isRattrapage: true
      }],
      '14:45-16:15': [{
        id: 109,
        name: 'Sécurité Informatique',
        type: 'COURS',
        professor: 'Dr. Laurent Dubois',
        groupe: 'ING3_INFO',
        room: 'A-302',
        biWeekly: false
      }]
    }
  },
  'MARDI': {
    'ING1_INFO': {
      '08:30-10:00': [{
        id: 201,
        name: 'Programmation en C',
        type: 'COURS',
        professor: 'Dr. Antoine Rousseau',
        groupe: 'ING1_INFO',
        room: 'A-101',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 202,
        name: 'Architecture des Ordinateurs',
        type: 'COURS',
        professor: 'Dr. Nicolas Blanc',
        groupe: 'ING1_INFO',
        room: 'A-102',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD1': {
      '13:00-14:30': [{
        id: 203,
        name: 'TP Programmation en C',
        type: 'TP',
        professor: 'Prof. Marc Girard',
        groupe: 'ING1_INFO_TD1',
        room: 'LAB-01',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD2': {
      '14:45-16:15': [{
        id: 204,
        name: 'TP Programmation en C',
        type: 'TP',
        professor: 'Prof. Marc Girard',
        groupe: 'ING1_INFO_TD2',
        room: 'LAB-01',
        biWeekly: false
      }]
    },
    'ING2_INFO': {
      '13:00-14:30': [{
        id: 205,
        name: 'Programmation Orientée Objet',
        type: 'COURS',
        professor: 'Dr. Sophie Bertrand',
        groupe: 'ING2_INFO',
        room: 'A-201',
        biWeekly: false
      }]
    },
    'ING2_INFO_TD1': {
      '14:45-16:15': [{
        id: 206,
        name: 'TP Bases de Données',
        type: 'TP',
        professor: 'Prof. Christine Durand',
        groupe: 'ING2_INFO_TD1',
        room: 'LAB-02',
        biWeekly: true
      }]
    },
    'ING2_ELEC': {
      '08:30-10:00': [{
        id: 207,
        name: 'Électronique Numérique',
        type: 'COURS',
        professor: 'Dr. Jean Leclerc',
        groupe: 'ING2_ELEC',
        room: 'A-203',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 208,
        name: 'Traitement du Signal',
        type: 'COURS',
        professor: 'Dr. Michel Fournier',
        groupe: 'ING2_ELEC',
        room: 'A-204',
        biWeekly: false
      }]
    }
  },
  'MERCREDI': {
    'ING1_INFO': {
      '08:30-10:00': [{
        id: 301,
        name: 'Algèbre Linéaire',
        type: 'COURS',
        professor: 'Dr. Emma Dupuis',
        groupe: 'ING1_INFO',
        room: 'A-101',
        biWeekly: false
      }]
    },
    'ING1_INFO_TD1 || ING1_INFO_TD2': {
      '10:15-11:45': [{
        id: 302,
        name: 'TP Architecture des Ordinateurs',
        type: 'TP',
        professor: 'Prof. David Morel',
        groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
        room: 'LAB-03',
        biWeekly: true
      }]
    },
    'ING3_INFO': {
      '08:30-10:00': [{
        id: 303,
        name: 'Réseaux et Protocoles',
        type: 'COURS',
        professor: 'Dr. Pierre Fontaine',
        groupe: 'ING3_INFO',
        room: 'A-301',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 304,
        name: 'Cloud Computing',
        type: 'COURS',
        professor: 'Dr. Julie Mercier',
        groupe: 'ING3_INFO',
        room: 'A-302',
        biWeekly: false
      }]
    },
    'ING3_INFO_TD1': {
      '13:00-14:30': [{
        id: 305,
        name: 'TP Intelligence Artificielle',
        type: 'TP',
        professor: 'Prof. Vincent Lemoine',
        groupe: 'ING3_INFO_TD1',
        room: 'LAB-04',
        biWeekly: true
      }]
    },
    'MASTER_IA': {
      '13:00-14:30': [{
        id: 306,
        name: 'Apprentissage Profond',
        type: 'COURS',
        professor: 'Dr. Catherine Dumas',
        groupe: 'MASTER_IA',
        room: 'A-401',
        biWeekly: false
      }],
      '14:45-16:15': [{
        id: 307,
        name: 'Vision par Ordinateur',
        type: 'COURS',
        professor: 'Dr. Olivier Roux',
        groupe: 'MASTER_IA',
        room: 'A-402',
        biWeekly: false
      }]
    }
  },
  'JEUDI': {
    'ING1_ELEC': {
      '08:30-10:00': [{
        id: 401,
        name: 'Électromagnétisme',
        type: 'COURS',
        professor: 'Dr. François Legrand',
        groupe: 'ING1_ELEC',
        room: 'A-104',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 402,
        name: 'Circuits Électriques',
        type: 'COURS',
        professor: 'Dr. Sylvie Renard',
        groupe: 'ING1_ELEC',
        room: 'A-105',
        biWeekly: false
      }]
    },
    'ING1_ELEC_TD1': {
      '13:00-14:30': [{
        id: 403,
        name: 'TD Électromagnétisme',
        type: 'TD',
        professor: 'Prof. Jacques Beaumont',
        groupe: 'ING1_ELEC_TD1',
        room: 'B-203',
        biWeekly: true
      }]
    },
    'ING2_INFO_TD2': {
      '14:45-16:15': [{
        id: 404,
        name: 'TP Bases de Données',
        type: 'TP',
        professor: 'Prof. Christine Durand',
        groupe: 'ING2_INFO_TD2',
        room: 'LAB-02',
        biWeekly: true
      }]
    },
    'MASTER_CYBER': {
      '08:30-10:00': [{
        id: 405,
        name: 'Cryptographie Avancée',
        type: 'COURS',
        professor: 'Dr. Stéphane Chevalier',
        groupe: 'MASTER_CYBER',
        room: 'A-403',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 406,
        name: 'Sécurité des Réseaux',
        type: 'COURS',
        professor: 'Dr. Hélène Garnier',
        groupe: 'MASTER_CYBER',
        room: 'A-404',
        biWeekly: false
      }]
    }
  },
  'VENDREDI': {
    'ING3_INFO': {
      '08:30-10:00': [{
        id: 501,
        name: 'Génie Logiciel',
        type: 'COURS',
        professor: 'Dr. Alexandre Perrin',
        groupe: 'ING3_INFO',
        room: 'A-301',
        biWeekly: false
      }],
      '10:15-11:45': [{
        id: 502,
        name: 'Développement Web',
        type: 'COURS',
        professor: 'Dr. Isabelle Roy',
        groupe: 'ING3_INFO',
        room: 'A-302',
        biWeekly: false
      }]
    },
    'ING3_INFO_TD2': {
      '13:00-14:30': [{
        id: 503,
        name: 'TP Intelligence Artificielle',
        type: 'TP',
        professor: 'Prof. Vincent Lemoine',
        groupe: 'ING3_INFO_TD2',
        room: 'LAB-04',
        biWeekly: true
      }]
    },
    'MASTER_IOT': {
      '13:00-14:30': [{
        id: 504,
        name: 'Systèmes Embarqués',
        type: 'COURS',
        professor: 'Dr. Gabriel Marchand',
        groupe: 'MASTER_IOT',
        room: 'A-405',
        biWeekly: false,
        isRattrapage: true
      }],
      '14:45-16:15': [{
        id: 505,
        name: 'Objets Connectés',
        type: 'COURS',
        professor: 'Dr. Nathalie Picard',
        groupe: 'MASTER_IOT',
        room: 'A-406',
        biWeekly: false
      }]
    },
    'ING2_ELEC_TD1': {
      '14:45-16:15': [{
        id: 506,
        name: 'TP Traitement du Signal',
        type: 'TP',
        professor: 'Prof. Alain Leroy',
        groupe: 'ING2_ELEC_TD1',
        room: 'LAB-05',
        biWeekly: true
      }]
    },
    'ING2_ELEC_TD2': {
      '16:30-18:00': [{
        id: 507,
        name: 'TP Traitement du Signal',
        type: 'TP',
        professor: 'Prof. Alain Leroy',
        groupe: 'ING2_ELEC_TD2',
        room: 'LAB-05',
        biWeekly: true
      }]
    }
  }
};

// Rooms data with schedules
export const demoSalles: SalleList = {
  'A-101': {
    id: 1001,
    name: 'A-101',
    type: 'COURS',
    capacite: 120,
    schedule: {
      'LUNDI': {
        'ING1_INFO': {
          '08:30-10:00': [{
            id: 101,
            name: 'Analyse Mathématique',
            type: 'COURS',
            professor: 'Dr. Martin Bernard',
            groupe: 'ING1_INFO',
            room: 'A-101',
            biWeekly: false
          }]
        }
      },
      'MARDI': {
        'ING1_INFO': {
          '08:30-10:00': [{
            id: 201,
            name: 'Programmation en C',
            type: 'COURS',
            professor: 'Dr. Antoine Rousseau',
            groupe: 'ING1_INFO',
            room: 'A-101',
            biWeekly: false
          }]
        }
      },
      'MERCREDI': {
        'ING1_INFO': {
          '08:30-10:00': [{
            id: 301,
            name: 'Algèbre Linéaire',
            type: 'COURS',
            professor: 'Dr. Emma Dupuis',
            groupe: 'ING1_INFO',
            room: 'A-101',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-102': {
    id: 1002,
    name: 'A-102',
    type: 'COURS',
    capacite: 120,
    schedule: {
      'LUNDI': {
        'ING1_INFO': {
          '10:15-11:45': [{
            id: 102,
            name: 'Physique Générale',
            type: 'COURS',
            professor: 'Dr. Sophie Lambert',
            groupe: 'ING1_INFO',
            room: 'A-102',
            biWeekly: false
          }]
        }
      },
      'MARDI': {
        'ING1_INFO': {
          '10:15-11:45': [{
            id: 202,
            name: 'Architecture des Ordinateurs',
            type: 'COURS',
            professor: 'Dr. Nicolas Blanc',
            groupe: 'ING1_INFO',
            room: 'A-102',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-103': {
    id: 1003,
    name: 'A-103',
    type: 'COURS',
    capacite: 120,
    schedule: {
      'LUNDI': {
        'ING1_INFO': {
          '13:00-14:30': [{
            id: 103,
            name: 'Introduction aux Algorithmes',
            type: 'COURS',
            professor: 'Dr. Thomas Dupont',
            groupe: 'ING1_INFO',
            room: 'A-103',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-104': {
    id: 1004,
    name: 'A-104',
    type: 'COURS',
    capacite: 100,
    schedule: {
      'JEUDI': {
        'ING1_ELEC': {
          '08:30-10:00': [{
            id: 401,
            name: 'Électromagnétisme',
            type: 'COURS',
            professor: 'Dr. François Legrand',
            groupe: 'ING1_ELEC',
            room: 'A-104',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-105': {
    id: 1005,
    name: 'A-105',
    type: 'COURS',
    capacite: 100,
    schedule: {
      'JEUDI': {
        'ING1_ELEC': {
          '10:15-11:45': [{
            id: 402,
            name: 'Circuits Électriques',
            type: 'COURS',
            professor: 'Dr. Sylvie Renard',
            groupe: 'ING1_ELEC',
            room: 'A-105',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-201': {
    id: 1006,
    name: 'A-201',
    type: 'COURS',
    capacite: 100,
    schedule: {
      'LUNDI': {
        'ING2_INFO': {
          '08:30-10:00': [{
            id: 106,
            name: 'Structures de Données Avancées',
            type: 'COURS',
            professor: 'Dr. Julien Petit',
            groupe: 'ING2_INFO',
            room: 'A-201',
            biWeekly: false
          }]
        }
      },
      'MARDI': {
        'ING2_INFO': {
          '13:00-14:30': [{
            id: 205,
            name: 'Programmation Orientée Objet',
            type: 'COURS',
            professor: 'Dr. Sophie Bertrand',
            groupe: 'ING2_INFO',
            room: 'A-201',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-202': {
    id: 1007,
    name: 'A-202',
    type: 'COURS',
    capacite: 100,
    schedule: {
      'LUNDI': {
        'ING2_INFO': {
          '10:15-11:45': [{
            id: 107,
            name: 'Bases de Données',
            type: 'COURS',
            professor: 'Dr. Marie Lefevre',
            groupe: 'ING2_INFO',
            room: 'A-202',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-203': {
    id: 1008,
    name: 'A-203',
    type: 'COURS',
    capacite: 90,
    schedule: {
      'MARDI': {
        'ING2_ELEC': {
          '08:30-10:00': [{
            id: 207,
            name: 'Électronique Numérique',
            type: 'COURS',
            professor: 'Dr. Jean Leclerc',
            groupe: 'ING2_ELEC',
            room: 'A-203',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-204': {
    id: 1009,
    name: 'A-204',
    type: 'COURS',
    capacite: 90,
    schedule: {
      'MARDI': {
        'ING2_ELEC': {
          '10:15-11:45': [{
            id: 208,
            name: 'Traitement du Signal',
            type: 'COURS',
            professor: 'Dr. Michel Fournier',
            groupe: 'ING2_ELEC',
            room: 'A-204',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-301': {
    id: 1010,
    name: 'A-301',
    type: 'COURS',
    capacite: 80,
    schedule: {
      'LUNDI': {
        'ING3_INFO': {
          '13:00-14:30': [{
            id: 108,
            name: 'Intelligence Artificielle',
            type: 'COURS',
            professor: 'Dr. Philippe Martin',
            groupe: 'ING3_INFO',
            room: 'A-301',
            biWeekly: false,
            isRattrapage: true
          }]
        }
      },
      'MERCREDI': {
        'ING3_INFO': {
          '08:30-10:00': [{
            id: 303,
            name: 'Réseaux et Protocoles',
            type: 'COURS',
            professor: 'Dr. Pierre Fontaine',
            groupe: 'ING3_INFO',
            room: 'A-301',
            biWeekly: false
          }]
        }
      },
      'VENDREDI': {
        'ING3_INFO': {
          '08:30-10:00': [{
            id: 501,
            name: 'Génie Logiciel',
            type: 'COURS',
            professor: 'Dr. Alexandre Perrin',
            groupe: 'ING3_INFO',
            room: 'A-301',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-302': {
    id: 1011,
    name: 'A-302',
    type: 'COURS',
    capacite: 80,
    schedule: {
      'LUNDI': {
        'ING3_INFO': {
          '14:45-16:15': [{
            id: 109,
            name: 'Sécurité Informatique',
            type: 'COURS',
            professor: 'Dr. Laurent Dubois',
            groupe: 'ING3_INFO',
            room: 'A-302',
            biWeekly: false
          }]
        }
      },
      'MERCREDI': {
        'ING3_INFO': {
          '10:15-11:45': [{
            id: 304,
            name: 'Cloud Computing',
            type: 'COURS',
            professor: 'Dr. Julie Mercier',
            groupe: 'ING3_INFO',
            room: 'A-302',
            biWeekly: false
          }]
        }
      },
      'VENDREDI': {
        'ING3_INFO': {
          '10:15-11:45': [{
            id: 502,
            name: 'Développement Web',
            type: 'COURS',
            professor: 'Dr. Isabelle Roy',
            groupe: 'ING3_INFO',
            room: 'A-302',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-401': {
    id: 1012,
    name: 'A-401',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'MERCREDI': {
        'MASTER_IA': {
          '13:00-14:30': [{
            id: 306,
            name: 'Apprentissage Profond',
            type: 'COURS',
            professor: 'Dr. Catherine Dumas',
            groupe: 'MASTER_IA',
            room: 'A-401',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-402': {
    id: 1013,
    name: 'A-402',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'MERCREDI': {
        'MASTER_IA': {
          '14:45-16:15': [{
            id: 307,
            name: 'Vision par Ordinateur',
            type: 'COURS',
            professor: 'Dr. Olivier Roux',
            groupe: 'MASTER_IA',
            room: 'A-402',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-403': {
    id: 1014,
    name: 'A-403',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'JEUDI': {
        'MASTER_CYBER': {
          '08:30-10:00': [{
            id: 405,
            name: 'Cryptographie Avancée',
            type: 'COURS',
            professor: 'Dr. Stéphane Chevalier',
            groupe: 'MASTER_CYBER',
            room: 'A-403',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-404': {
    id: 1015,
    name: 'A-404',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'JEUDI': {
        'MASTER_CYBER': {
          '10:15-11:45': [{
            id: 406,
            name: 'Sécurité des Réseaux',
            type: 'COURS',
            professor: 'Dr. Hélène Garnier',
            groupe: 'MASTER_CYBER',
            room: 'A-404',
            biWeekly: false
          }]
        }
      }
    }
  },
  'A-405': {
    id: 1016,
    name: 'A-405',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'VENDREDI': {
        'MASTER_IOT': {
          '13:00-14:30': [{
            id: 504,
            name: 'Systèmes Embarqués',
            type: 'COURS',
            professor: 'Dr. Gabriel Marchand',
            groupe: 'MASTER_IOT',
            room: 'A-405',
            biWeekly: false,
            isRattrapage: true
          }]
        }
      }
    }
  },
  'A-406': {
    id: 1017,
    name: 'A-406',
    type: 'COURS',
    capacite: 60,
    schedule: {
      'VENDREDI': {
        'MASTER_IOT': {
          '14:45-16:15': [{
            id: 505,
            name: 'Objets Connectés',
            type: 'COURS',
            professor: 'Dr. Nathalie Picard',
            groupe: 'MASTER_IOT',
            room: 'A-406',
            biWeekly: false
          }]
        }
      }
    }
  },
  'B-201': {
    id: 1018,
    name: 'B-201',
    type: 'TD',
    capacite: 40,
    schedule: {
      'LUNDI': {
        'ING1_INFO_TD1': {
          '14:45-16:15': [{
            id: 104,
            name: 'Travaux Dirigés Mathématiques',
            type: 'TD',
            professor: 'Prof. Claire Moreau',
            groupe: 'ING1_INFO_TD1',
            room: 'B-201',
            biWeekly: true
          }]
        }
      }
    }
  },
  'B-202': {
    id: 1019,
    name: 'B-202',
    type: 'TD',
    capacite: 40,
    schedule: {
      'LUNDI': {
        'ING1_INFO_TD2': {
          '16:30-18:00': [{
            id: 105,
            name: 'Travaux Dirigés Mathématiques',
            type: 'TD',
            professor: 'Prof. Claire Moreau',
            groupe: 'ING1_INFO_TD2',
            room: 'B-202',
            biWeekly: true
          }]
        }
      }
    }
  },
  'B-203': {
    id: 1020,
    name: 'B-203',
    type: 'TD',
    capacite: 40,
    schedule: {
      'JEUDI': {
        'ING1_ELEC_TD1': {
          '13:00-14:30': [{
            id: 403,
            name: 'TD Électromagnétisme',
            type: 'TD',
            professor: 'Prof. Jacques Beaumont',
            groupe: 'ING1_ELEC_TD1',
            room: 'B-203',
            biWeekly: true
          }]
        }
      }
    }
  },
  'LAB-01': {
    id: 1021,
    name: 'LAB-01',
    type: 'TP',
    capacite: 25,
    schedule: {
      'MARDI': {
        'ING1_INFO_TD1': {
          '13:00-14:30': [{
            id: 203,
            name: 'TP Programmation en C',
            type: 'TP',
            professor: 'Prof. Marc Girard',
            groupe: 'ING1_INFO_TD1',
            room: 'LAB-01',
            biWeekly: false
          }]
        },
        'ING1_INFO_TD2': {
          '14:45-16:15': [{
            id: 204,
            name: 'TP Programmation en C',
            type: 'TP',
            professor: 'Prof. Marc Girard',
            groupe: 'ING1_INFO_TD2',
            room: 'LAB-01',
            biWeekly: false
          }]
        }
      }
    }
  },
  'LAB-02': {
    id: 1022,
    name: 'LAB-02',
    type: 'TP',
    capacite: 25,
    schedule: {
      'MARDI': {
        'ING2_INFO_TD1': {
          '14:45-16:15': [{
            id: 206,
            name: 'TP Bases de Données',
            type: 'TP',
            professor: 'Prof. Christine Durand',
            groupe: 'ING2_INFO_TD1',
            room: 'LAB-02',
            biWeekly: true
          }]
        }
      },
      'JEUDI': {
        'ING2_INFO_TD2': {
          '14:45-16:15': [{
            id: 404,
            name: 'TP Bases de Données',
            type: 'TP',
            professor: 'Prof. Christine Durand',
            groupe: 'ING2_INFO_TD2',
            room: 'LAB-02',
            biWeekly: true
          }]
        }
      }
    }
  },
  'LAB-03': {
    id: 1023,
    name: 'LAB-03',
    type: 'TP',
    capacite: 30,
    schedule: {
      'MERCREDI': {
        'ING1_INFO_TD1 || ING1_INFO_TD2': {
          '10:15-11:45': [{
            id: 302,
            name: 'TP Architecture des Ordinateurs',
            type: 'TP',
            professor: 'Prof. David Morel',
            groupe: 'ING1_INFO_TD1 || ING1_INFO_TD2',
            room: 'LAB-03',
            biWeekly: true
          }]
        }
      }
    }
  },
  'LAB-04': {
    id: 1024,
    name: 'LAB-04',
    type: 'TP',
    capacite: 20,
    schedule: {
      'MERCREDI': {
        'ING3_INFO_TD1': {
          '13:00-14:30': [{
            id: 305,
            name: 'TP Intelligence Artificielle',
            type: 'TP',
            professor: 'Prof. Vincent Lemoine',
            groupe: 'ING3_INFO_TD1',
            room: 'LAB-04',
            biWeekly: true
          }]
        }
      },
      'VENDREDI': {
        'ING3_INFO_TD2': {
          '13:00-14:30': [{
            id: 503,
            name: 'TP Intelligence Artificielle',
            type: 'TP',
            professor: 'Prof. Vincent Lemoine',
            groupe: 'ING3_INFO_TD2',
            room: 'LAB-04',
            biWeekly: true
          }]
        }
      }
    }
  },
  'LAB-05': {
    id: 1025,
    name: 'LAB-05',
    type: 'TP',
    capacite: 20,
    schedule: {
      'VENDREDI': {
        'ING2_ELEC_TD1': {
          '14:45-16:15': [{
            id: 506,
            name: 'TP Traitement du Signal',
            type: 'TP',
            professor: 'Prof. Alain Leroy',
            groupe: 'ING2_ELEC_TD1',
            room: 'LAB-05',
            biWeekly: true
          }]
        },
        'ING2_ELEC_TD2': {
          '16:30-18:00': [{
            id: 507,
            name: 'TP Traitement du Signal',
            type: 'TP',
            professor: 'Prof. Alain Leroy',
            groupe: 'ING2_ELEC_TD2',
            room: 'LAB-05',
            biWeekly: true
          }]
        }
      }
    }
  }
};
