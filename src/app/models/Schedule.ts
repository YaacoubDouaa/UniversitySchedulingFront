import {Seance} from './Seance';
import{TP} from './Branches'
export interface Schedule {
  [day: string]: {
    [niveau: string]: {
      [time: string]: Seance[] ;
    };
  };
}


// export interface Schedule {
//   [day: string]: {
//     [tp: TP]: {
//       [time: string]: Seance[] ;
//     };
//   };
// }
