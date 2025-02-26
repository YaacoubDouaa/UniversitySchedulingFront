import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ConflictListComponent} from './conflict-list/conflict-list.component';
import {ConflictPageComponent} from './conflict-page/conflict-page.component';
import {RoomsComponent} from './rooms/rooms.component';
import {ViewScheduleComponent} from './view-schedule/view-schedule.component';
import {RoomScheduleComponent} from './room-schedule/room-schedule.component';
import {ProfessorsComponent} from './professors/professors.component';
import {GlobalScheduleComponent} from './global-schedule/global-schedule.component';
import {PropositionRattrapageComponent} from './proposition-rattrapage/proposition-rattrapage.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfessorSpaceComponent} from './professor-space/professor-space.component';
import {ProfessorDashboardComponent} from './professor-dashboard/professor-dashboard.component';
import {ProposeRattrapageComponent} from './propose-rattrapage/propose-rattrapage.component';
import {CsvImportComponent} from './csv-import/csv-import.component';
import {MessagingComponent} from './messaging/messaging.component';
import {AdministratorSpaceComponent} from './administrator-sapce/administrator-space.component';
import {TechnicienSpaceComponent} from './technicien-space/technicien-space.component';
import {TechnicienGlobalScheduleComponent} from './technicien-global-schedule/technicien-global-schedule.component';
import {TechnicienDashBoardComponent} from './technicien-dash-board/technicien-dash-board.component';
import {ProfScheduleComponent} from './prof-schedule/prof-schedule.component';

const routes: Routes = [ { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'conflict', component: ConflictPageComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'schedule', component: ScheduleComponent },
  {path:'view', component:ViewScheduleComponent},
  {path:'room-schedule', component:RoomScheduleComponent},
  { path: 'global', component: GlobalScheduleComponent },
  { path: 'rattrapage', component: PropositionRattrapageComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'profs', component: ProfessorsComponent},
  { path: 'import', component: CsvImportComponent},
  { path: 'messages', component: MessagingComponent},
  { path: 'adminSpace', component: AdministratorSpaceComponent},

  {
    path: 'professor',
    component: ProfessorSpaceComponent},
      { path: '', redirectTo: 'profdashboard', pathMatch: 'full' },
      { path: 'profdashboard', component: ProfessorDashboardComponent },
      { path: 'profschedule', component: ProfScheduleComponent },
      { path: 'propose-rattrapage', component: ProposeRattrapageComponent },

  {
    path: 'technicien',
    component: TechnicienSpaceComponent},
  { path: '', redirectTo: 'techDashboard', pathMatch: 'full' },
  { path: 'techDashboard', component: TechnicienDashBoardComponent },
  { path: 'techGlobalSchedule', component: TechnicienGlobalScheduleComponent  },
  { path: 'rooms', component: RoomsComponent },
  { path: 'schedule', component: ScheduleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
