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
import { ScheduleComponent } from './Admin/schedule/schedule.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule} from '@angular/router';
import { ConflictListComponent } from './conflict-list/conflict-list.component';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { ConflictPageComponent } from './Admin/conflict-page/conflict-page.component';

import { RoomsComponent } from './Room/rooms/rooms.component';
import {ViewScheduleComponent} from './Student/view-schedule/view-schedule.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSelect} from '@angular/material/select';
import {ScheduleService} from './Services/ScheduleService/schedule-service.service';
import {RoomScheduleComponent} from './Room/room-schedule/room-schedule.component';
import { ViewRoomsComponent } from './Student/view-rooms/view-rooms.component';
import { ProfessorsComponent } from './Prof/professors/professors.component';
import { GlobalScheduleComponent } from './Admin/global-schedule/global-schedule.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatDivider, MatDividerModule} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import { PropositionRattrapageComponent } from './proposition-rattrapage/proposition-rattrapage.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import {MatList, MatListItem, MatListModule} from '@angular/material/list';
import {MatLine, MatNativeDateModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { ConfirmationDialogComponent } from './Admin/confirmation-dialog/confirmation-dialog.component';
import {MatTooltip} from '@angular/material/tooltip';
import { ProfessorSpaceComponent } from './Prof/professor-space/professor-space.component';
import { ProfessorDashboardComponent } from './Prof/professor-dashboard/professor-dashboard.component';
import { ProposeRattrapageComponent } from './Prof/propose-rattrapage/propose-rattrapage.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatGridList, MatGridListModule, MatGridTile} from '@angular/material/grid-list';
import {MatChip, MatChipListbox, MatChipsModule} from '@angular/material/chips';
import {ConflictService} from './Services/ConflictService/conflict.service';
 import { CsvImportComponent } from './Admin/csv-import/csv-import.component';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {MatProgressBar} from '@angular/material/progress-bar';
import {SidebarComponent} from './side-bar/side-bar.component';

import {FeatherModule} from 'angular-feather';
import {allIcons} from 'angular-feather/icons';
import {Calendar, Clock, User} from 'lucide-angular';
import { MessagingComponent } from './messaging/messaging.component';
import { AdministratorSpaceComponent } from './Admin/administrator-sapce/administrator-space.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { ProfEditScheduleComponent } from './Prof/prof-edit-schedule/prof-edit-schedule.component';
import {StudentScheduleComponent} from './Student/student-schedule/student-schedule.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { StudentDashBoardComponent } from './Student/student-dash-board/student-dash-board.component';
import { TechnicienGlobalScheduleComponent } from './technicien/technicien-global-schedule/technicien-global-schedule.component';
import { TechnicienDashBoardComponent } from './technicien/technicien-dash-board/technicien-dash-board.component';
import { TechnicienSpaceComponent } from './technicien/technicien-space/technicien-space.component';
import {ProfScheduleComponent} from './Prof/prof-schedule/prof-schedule.component';
import {NavbarComponent} from './nav-bar/nav-bar.component';

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
    DashboardComponent,
    MessagingComponent,
    AdministratorSpaceComponent,
    NotificationsComponent,
    ProfEditScheduleComponent,
    StudentScheduleComponent,
    EditModalComponent,
    StudentDashBoardComponent,
    ProfEditScheduleComponent,
    TechnicienGlobalScheduleComponent,
    TechnicienDashBoardComponent,
    TechnicienSpaceComponent,
    ProfScheduleComponent
  ],
  imports: [
    BrowserAnimationsModule,
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
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
    MatTabGroup,
    MatTab,
    MatDivider,
    MatMenu,
    MatBadge,
    MatMenuTrigger,
    MatMenuItem,
    MatListItem,
    MatList,
    MatLine,
    MatTable,
    ConfirmationDialogComponent,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatTooltip,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatGridTile,
    MatGridList,
    MatChip,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    MatChipListbox,
    MatStepper,
    MatStep,
    MatProgressBar,
    MatStepperPrevious,
    MatStepLabel,
    MatStepperNext,
    NavbarComponent,

    RouterModule.forRoot([
      {path: '', component: DashboardComponent}
    ]),
    FeatherModule.pick(allIcons),

    SidebarComponent,

    MatProgressSpinner,



  ],

  providers: [
    provideAnimationsAsync(),ConflictService
  ],

  bootstrap: [AppComponent]

})
export class AppModule { }
