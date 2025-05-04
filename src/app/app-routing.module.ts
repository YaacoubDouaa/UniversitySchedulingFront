import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './Core/Guards/authGuard';
import {RoleGuard} from './Core/Guards/roleGuard';


// Current Date and Time (UTC): 2025-05-04 19:44:06
// Author: YaacoubDouaa

// @ts-ignore
// @ts-ignore
/**
 * Main application routes
 */
const routes: Routes = [
  // Public routes
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },


  // Student space
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STUDENT'] },
    loadChildren: () => {
      return import('./Student/student.module').then(m => m.StudentModule);
    }
  },

  // Administrator space
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./Admin/admin.module').then(m => m.AdminModule)
  },

  // Professor space
  {
    path: 'professor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PROFESSOR'] },
    loadChildren: () => import('./Professor/professor.module').then(m => m.ProfessorModule)
  },

  // Technician space
  {
    path: 'technician',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TECHNICIAN'] },
    loadChildren: () => import('./Technician/technician.module').then(m => m.TechnicianModule)
  },

  // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
