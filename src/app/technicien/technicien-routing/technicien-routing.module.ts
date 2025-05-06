// Current Date and Time (UTC): 2025-05-05 21:29:41
// Current User's Login: YaacoubDouaa

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TechnicienSpaceComponent} from '../technicien-space/technicien-space.component';
import {TechnicienDashBoardComponent} from '../technicien-dash-board/technicien-dash-board.component';
import {TechnicienGlobalScheduleComponent} from '../technicien-global-schedule/technicien-global-schedule.component';
import {RoomsComponent} from '../../Room/rooms/rooms.component';
import {MessagingComponent} from '../../messaging/messaging.component';
import {NotificationsComponent} from '../../notifications/notifications.component';


/**
 * Routing module for the Technician feature area
 * Defines all routes available to technician users
 */
const routes: Routes = [
  {
    path: '',
    component: TechnicienSpaceComponent,
    children: [
      // Default route redirects to dashboard
      { path: '', redirectTo: 'techspace', pathMatch: 'full' },

      // Main technician routes
      { path: 'techdashboard', component: TechnicienDashBoardComponent },
      { path: 'techglobalschedule', component: TechnicienGlobalScheduleComponent },
      { path: 'rooms', component: RoomsComponent },

      // Communication routes
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnicienRoutingModule { }
