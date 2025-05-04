import {APP_CONSTANTS} from '../../initialData/constants';
import {Student} from '../../models/Users';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-student-schedule',
  templateUrl: './student-schedule.component.html',
  styleUrls: ['./student-schedule.component.css'],
  standalone:false
})
export class StudentScheduleComponent implements OnInit {
  currentStudent: Student = APP_CONSTANTS.CURRENT_STUDENT;
  days: string[] = APP_CONSTANTS.DAYS;
  timeSlots: string[] = APP_CONSTANTS.TIME_SLOTS;
  currentDateTime: string = APP_CONSTANTS.CURRENT_DATE;


  constructor() {
  }

  ngOnInit(): void {
  }
}
