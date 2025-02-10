import {Component, Input} from '@angular/core';
import {SalleList} from '../models/Salle';
import {Seance} from '../models/Seance';

@Component({
  selector: 'app-room-schedule',
  standalone: false,

  templateUrl: './room-schedule.component.html',
  styleUrl: './room-schedule.component.css'
})
export class RoomScheduleComponent {
  @Input() salles: SalleList = {};

  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  times = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

 getSalleInfo(salle: any, day: string, time: string): string {
  if (salle.schedule[day] && salle.schedule[day][time]) {
    const course: Seance = salle.schedule[day][time];
    const courseDetails = `${course.name} (${course.professor}) ${course.code}`;
    return courseDetails;
  }
  return 'Available';
}}
