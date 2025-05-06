// Current Date and Time (UTC): 2025-05-06 10:18:54
// Current User's Login: YaacoubDouaa

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import Auth Module correctly

// Import Angular Material modules (not individual components)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

// Component imports
import { SidenavComponent } from './sidenav/sidenav.component';
import { ConflictListComponent } from './conflict-list/conflict-list.component';
import { ConflictPageComponent } from './Admin/conflict-page/conflict-page.component';
import { RoomsComponent } from './Room/rooms/rooms.component';
import { ViewScheduleComponent } from './Student/view-schedule/view-schedule.component';
import { ScheduleComponent } from './Admin/schedule/schedule.component';
import { ViewRoomsComponent } from './Student/view-rooms/view-rooms.component';
import { ProfessorsComponent } from './Prof/professors/professors.component';
import { RoomScheduleComponent } from './Room/room-schedule/room-schedule.component';
import { GlobalScheduleComponent } from './Admin/global-schedule/global-schedule.component';
import { PropositionRattrapageComponent } from './proposition-rattrapage/proposition-rattrapage.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProfessorSpaceComponent } from './Prof/professor-space/professor-space.component';
import { ProfessorDashboardComponent } from './Prof/professor-dashboard/professor-dashboard.component';
import { ProposeRattrapageComponent } from './Prof/propose-rattrapage/propose-rattrapage.component';
import { CsvImportComponent } from './Admin/csv-import/csv-import.component';
import { MessagingComponent } from './messaging/messaging.component';
import { AdministratorSpaceComponent } from './Admin/administrator-sapce/administrator-space.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfEditScheduleComponent } from './Prof/prof-edit-schedule/prof-edit-schedule.component';
import { StudentScheduleComponent } from './Student/student-schedule/student-schedule.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { StudentDashBoardComponent } from './Student/student-dash-board/student-dash-board.component';
import { TechnicienGlobalScheduleComponent } from './technicien/technicien-global-schedule/technicien-global-schedule.component';
import { TechnicienDashBoardComponent } from './technicien/technicien-dash-board/technicien-dash-board.component';
import { TechnicienSpaceComponent } from './technicien/technicien-space/technicien-space.component';
import { ProfScheduleComponent } from './Prof/prof-schedule/prof-schedule.component';
import { NavbarComponent } from './nav-bar/nav-bar.component';
import { SidebarComponent } from './side-bar/side-bar.component';
import { ConfirmationDialogComponent } from './Admin/confirmation-dialog/confirmation-dialog.component';

// Services
import { ScheduleService } from './Services/ScheduleService/schedule-service.service';
import { ConflictService } from './Services/ConflictService/conflict.service';

// Feather icons
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Animation
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {AuthModule} from './auth-module/auth-module.module';

// Define routes
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ConflictListComponent,
    ConflictPageComponent,
    RoomsComponent,
    ViewScheduleComponent,
    ScheduleComponent,
    ViewRoomsComponent,
    ProfessorsComponent,
    RoomScheduleComponent,
    GlobalScheduleComponent,
    PropositionRattrapageComponent,
    DashboardComponent,
    ProfessorSpaceComponent,
    ProfessorDashboardComponent,
    ProposeRattrapageComponent,
    CsvImportComponent,
    MessagingComponent,
    AdministratorSpaceComponent,
    NotificationsComponent,
    ProfEditScheduleComponent,
    StudentScheduleComponent,
    EditModalComponent,
    StudentDashBoardComponent,
    TechnicienGlobalScheduleComponent,
    TechnicienDashBoardComponent,
    TechnicienSpaceComponent,
    ProfScheduleComponent
  ],
  imports: [
    // Angular Core Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // Auth Module - import this to get LoginComponent
    AuthModule,

    // IMPORTANT: Import RouterModule EXPLICITLY to fix router-outlet
    RouterModule.forRoot(routes),

    // Routing Module
    AppRoutingModule,

    // Material Modules - properly imported as modules
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatChipsModule,
    MatStepperModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,

    // Feather Icons
    FeatherModule.pick(allIcons),

    // Standalone Components
    SidebarComponent,
    ConfirmationDialogComponent,
    NavbarComponent
  ],
  providers: [
    ScheduleService,
    ConflictService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
