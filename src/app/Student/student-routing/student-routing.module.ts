import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewScheduleComponent} from '../view-schedule/view-schedule.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {StudentDashBoardComponent} from '../student-dash-board/student-dash-board.component';
import {StudentScheduleComponent} from '../student-schedule/student-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: StudentDashBoardComponent,
    children: [
      { path: '', redirectTo: 'schedule', pathMatch: 'full' },
      { path: 'view', component: StudentScheduleComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
