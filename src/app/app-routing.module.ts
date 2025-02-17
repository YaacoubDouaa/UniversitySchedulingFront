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
import {ProfessorViewScheduleComponent} from './professor-view-schedule/professor-view-schedule.component';

const routes: Routes = [ { path: '', component: LoginComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: SidenavComponent },
  { path: 'login', component: LoginComponent },
  { path: 'conflict', component: ConflictPageComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'schedule', component: ScheduleComponent },
  {path:'view', component:ViewScheduleComponent},
  {path:'room-schedule', component:RoomScheduleComponent},
  { path: 'global', component: GlobalScheduleComponent },
  { path: 'rattrapage', component: PropositionRattrapageComponent },
  { path: 'dashboard', component: DashboardComponent},
  {
    path: 'professor',
    component: ProfessorSpaceComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfessorDashboardComponent },
      { path: 'schedule', component: ProfessorViewScheduleComponent },
      { path: 'propose-rattrapage', component: ProposeRattrapageComponent }
    ]
  }
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
