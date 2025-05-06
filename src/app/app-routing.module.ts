// Current Date and Time (UTC): 2025-05-05 22:16:50
// Current User's Login: YaacoubDouaa

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components - Main
import { LoginComponent } from './login/login.component';

// Components - Admin
import { AdministratorSpaceComponent } from './Admin/administrator-sapce/administrator-space.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ScheduleComponent } from './Admin/schedule/schedule.component';
import { ConflictPageComponent } from './Admin/conflict-page/conflict-page.component';
import { GlobalScheduleComponent } from './Admin/global-schedule/global-schedule.component';
import { CsvImportComponent } from './Admin/csv-import/csv-import.component';

// Components - Professor
import { ProfessorSpaceComponent } from './Prof/professor-space/professor-space.component';
import { ProfessorDashboardComponent } from './Prof/professor-dashboard/professor-dashboard.component';
import { ProposeRattrapageComponent } from './Prof/propose-rattrapage/propose-rattrapage.component';
import { ProfEditScheduleComponent } from './Prof/prof-edit-schedule/prof-edit-schedule.component';
import { ProfScheduleComponent } from './Prof/prof-schedule/prof-schedule.component';

// Components - Student
import { StudentDashBoardComponent } from './Student/student-dash-board/student-dash-board.component';
import { StudentScheduleComponent } from './Student/student-schedule/student-schedule.component';
import { ViewScheduleComponent } from './Student/view-schedule/view-schedule.component';

// Components - Technician
import { TechnicienSpaceComponent } from './technicien/technicien-space/technicien-space.component';
import { TechnicienDashBoardComponent } from './technicien/technicien-dash-board/technicien-dash-board.component';
import { TechnicienGlobalScheduleComponent } from './technicien/technicien-global-schedule/technicien-global-schedule.component';

// Shared Components
import { MessagingComponent } from './messaging/messaging.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RoomsComponent } from './Room/rooms/rooms.component';

// Guards
import { AuthGuard } from './Core/Guards/authGuard';
import { RoleGuard } from './Core/Guards/roleGuard';
import {ProfessorsComponent} from './Prof/professors/professors.component';
import {PropositionRattrapageComponent} from './proposition-rattrapage/proposition-rattrapage.component';
import {StudentSpaceComponent} from './Student/student-space/student-space.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Admin routes
  {
    path: 'admin',
    component: AdministratorSpaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'rattrapage', component:PropositionRattrapageComponent },
      { path: 'conflicts', component: ConflictPageComponent },
      { path: 'global', component: GlobalScheduleComponent },
      { path: 'import', component: CsvImportComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'profs', component:ProfessorsComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'view', component: ViewScheduleComponent }
    ]
  },

  // Professor routes
  {
    path: 'professor',
    component: ProfessorSpaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PROFESSOR'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfessorDashboardComponent },
      { path: 'schedule', component: ProfScheduleComponent },
      { path: 'edit-schedule', component: ProfEditScheduleComponent },
      { path: 'propose-rattrapage', component: ProposeRattrapageComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  },

  // Student routes
  {
    path: 'student',
    component: StudentSpaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STUDENT'] },
    children: [
      { path: '', redirectTo: 'studentdash', pathMatch: 'full' },
      { path: 'studentschedule', component: StudentScheduleComponent },
      { path: 'view-schedule', component: ViewScheduleComponent },

      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  },

  // Technician routes
  {
    path: 'technician',
    component: TechnicienSpaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TECHNICIAN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TechnicienDashBoardComponent },
      { path: 'schedule', component: TechnicienGlobalScheduleComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'messages', component: MessagingComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  },

  // Wildcard route for 404
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
