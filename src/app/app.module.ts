import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
// Import Angular Material components
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatAutocomplete, MatAutocompleteTrigger, MatOptgroup, MatOption} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ScheduleComponent } from './schedule/schedule.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule} from '@angular/router';
import { ConflictListComponent } from './conflict-list/conflict-list.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { ConflictPageComponent } from './conflict-page/conflict-page.component';
import {ConflictDetectionService} from './conflict.service';
import { RoomsComponent } from './rooms/rooms.component';
import {ViewScheduleComponent} from './view-schedule/view-schedule.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSelect} from '@angular/material/select';
import {SalleScheduleServiceService} from './salle-schedule-service.service';
import {RoomScheduleComponent} from './room-schedule/room-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavComponent,
    ConflictListComponent,
    ConflictPageComponent,
    RoomsComponent,
    ViewScheduleComponent,
    ScheduleComponent,
    RoomScheduleComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatOption,
    MatOptgroup,
    FormsModule,
    MatToolbar,
    MatIcon,
    MatDrawer,
    MatDrawerContainer,
    // RouterModule.forRoot([
    //   {
    //     path: '',
    //     component: ScheduleComponent,
    //     children: [
    //       {
    //         path: '',
    //         component: SidenavComponent
    //       }
    //       // Add more routes here
    //     ]
    //   }
    // ]),
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatCheckbox,
    MatSelect,


  ],
  providers: [
    provideAnimationsAsync(),ConflictDetectionService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
