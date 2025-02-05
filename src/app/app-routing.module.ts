import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ConflictListComponent} from './conflict-list/conflict-list.component';
import {ConflictPageComponent} from './conflict-page/conflict-page.component';

const routes: Routes = [ { path: '', component: SidenavComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: SidenavComponent },
  { path: 'login', component: LoginComponent },
  { path: 'conflict', component: ConflictPageComponent }


  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
