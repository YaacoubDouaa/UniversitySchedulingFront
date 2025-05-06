import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfessorSpaceComponent} from '../professor-space/professor-space.component';
import {ProfessorDashboardComponent} from '../professor-dashboard/professor-dashboard.component';
import {ProfScheduleComponent} from '../prof-schedule/prof-schedule.component';
import {ProposeRattrapageComponent} from '../propose-rattrapage/propose-rattrapage.component';
import {MessagingComponent} from '../../messaging/messaging.component';
import {NotificationsComponent} from '../../notifications/notifications.component';

// Current Date and Time (UTC): 2025-05-06 11:24:12
// Author: YaacoubDouaa

const routes: Routes = [
  {
    path: '',
    component: ProfessorSpaceComponent,  // <-- This should be ProfessorSpaceComponent
    children: [
      { path: '', redirectTo: 'schedule', pathMatch: 'full' },
      { path: 'dashboard', component: ProfessorDashboardComponent }, // Add this route
      { path: 'schedule', component: ProfScheduleComponent },
      { path: 'rattrapage', component: ProposeRattrapageComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
      // Remove login route - this should be in the main app routing
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfRoutingModule { }
