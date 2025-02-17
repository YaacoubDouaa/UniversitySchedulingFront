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
  MatAccordion, MatExpansionModule,
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
import {ScheduleService} from './schedule-service.service';
import {RoomScheduleComponent} from './room-schedule/room-schedule.component';
import { ViewRoomsComponent } from './view-rooms/view-rooms.component';
import { ProfessorsComponent } from './professors/professors.component';
import { ProfScheduleComponent } from './prof-schedule/prof-schedule.component';
import { GlobalScheduleComponent } from './global-schedule/global-schedule.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import { PropositionRattrapageComponent } from './proposition-rattrapage/proposition-rattrapage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatTooltip} from '@angular/material/tooltip';
import { ProfessorSpaceComponent } from './professor-space/professor-space.component';
import { ProfessorDashboardComponent } from './professor-dashboard/professor-dashboard.component';
import { ProfessorViewScheduleComponent } from './professor-view-schedule/professor-view-schedule.component';
import { ProposeRattrapageComponent } from './propose-rattrapage/propose-rattrapage.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatGridList, MatGridListModule, MatGridTile} from '@angular/material/grid-list';

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
    ProfScheduleComponent,
    RoomScheduleComponent,
    GlobalScheduleComponent,
    PropositionRattrapageComponent,
    DashboardComponent,
    ProfessorSpaceComponent,
    ProfessorDashboardComponent,
    ProfessorViewScheduleComponent,
    ProposeRattrapageComponent,
    ProfessorViewScheduleComponent



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

  ],
  providers: [
    provideAnimationsAsync(),ConflictDetectionService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
