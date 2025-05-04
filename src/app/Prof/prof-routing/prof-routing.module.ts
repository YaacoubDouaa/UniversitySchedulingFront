import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfessorDashboardComponent} from '../professor-dashboard/professor-dashboard.component';
import {ProfScheduleComponent} from '../prof-schedule/prof-schedule.component';
import {ProposeRattrapageComponent} from '../propose-rattrapage/propose-rattrapage.component';
import {MessagingComponent} from '../../messaging/messaging.component';
import {NotificationsComponent} from '../../notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorDashboardComponent,
    children: [
      { path: '', redirectTo: 'schedule', pathMatch: 'full' },
      { path: 'schedule', component: ProfScheduleComponent },
      { path: 'rattrapage', component: ProposeRattrapageComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfrRoutingModule { }
