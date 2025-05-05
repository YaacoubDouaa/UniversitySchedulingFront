import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdministratorSpaceComponent} from '../administrator-sapce/administrator-space.component';
import {ScheduleComponent} from '../schedule/schedule.component';
import {RoomsComponent} from '../../Room/rooms/rooms.component';
import {CsvImportComponent} from '../csv-import/csv-import.component';
import {PropositionRattrapageComponent} from '../../proposition-rattrapage/proposition-rattrapage.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {ConflictPageComponent} from '../conflict-page/conflict-page.component';
import {MessagingComponent} from '../../messaging/messaging.component';
import {ProfessorsComponent} from '../../Prof/professors/professors.component';
<<<<<<< HEAD
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ViewScheduleComponent} from '../view-schedule/view-schedule.component';
import {GlobalScheduleComponent} from '../global-schedule/global-schedule.component';
=======
>>>>>>> 21dcef4a9219d9d305a82ce6f581ed47d2dc80e8

const routes: Routes = [
  {
    path: '',
    component:AdministratorSpaceComponent,
    children: [
<<<<<<< HEAD
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
=======
      { path: '', redirectTo: 'schedule', pathMatch: 'full' },
>>>>>>> 21dcef4a9219d9d305a82ce6f581ed47d2dc80e8
      { path: 'schedule', component: ScheduleComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'import', component: CsvImportComponent },
      { path: 'rattrapage', component: PropositionRattrapageComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'conflicts', component: ConflictPageComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'profs', component: ProfessorsComponent },
<<<<<<< HEAD
      { path: 'view', component: ViewScheduleComponent },
      { path: 'global', component: GlobalScheduleComponent },
=======

>>>>>>> 21dcef4a9219d9d305a82ce6f581ed47d2dc80e8

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
