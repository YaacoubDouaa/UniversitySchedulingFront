import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PropositionDeRattrapage} from '../models/Notifications';
import {Seance} from '../models/Seance';
import {RattrapageService} from '../rattrapage.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {NotificationService} from '../notifications.service';
import {Salle} from '../models/Salle';
import {FormControl} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-proposition-rattrapage',
  templateUrl: './proposition-rattrapage.component.html',
  styleUrls: ['./proposition-rattrapage.component.css'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class PropositionRattrapageComponent implements OnInit {
  searchControl = new FormControl('');
  sortControl = new FormControl('date');
  filterStatus = new FormControl('all');
  isDarkMode = false;
  propositions: PropositionDeRattrapage[] = [
    {
      id: 1,
      date: '2025-03-10',
      reason: 'Maladie',
      status: 'En attente',
      enseignantId: 101,
      type: 'COURS',
      name: 'Mathématiques',
      niveau: 'ING_1'
    },
    {
      id: 2,
      date: '2025-03-12',
      reason: 'Voyage académique',
      status: 'En attente',
      enseignantId: 102,
      type: 'COURS',
      name: 'Physique',
      niveau: 'ING_1'
    },
  ];

  displayedColumns: string[] = ['id', 'date', 'reason', 'status', 'enseignantId', 'type', 'niveau', 'actions'];
  sallesList: Salle[] = [];
  private rattrapageScheduleMap = new Map<number, { day: string, time: string, seanceId: number }>();
  // Form controls
  startDate = new FormControl<Date | null>(null);
  endDate = new FormControl<Date | null>(null);

  constructor(
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { // Initialize with current date range
    // Initialize with default dates
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate.setValue(thirtyDaysAgo);
    this.endDate.setValue(today);
  }

  availableRooms = [
    'Room A101',
    'Room B202',
    'Room C303',
    'Room D404',
    'Room E505',
  ];
  ngOnInit() {
    // You can load propositions from a service here if needed
    this.propositions.forEach(prop => {
      this.notificationService.addNotification(`New make-up session proposal: ${prop.name} on ${prop.date}`, 'info', prop.enseignantId, 0);
    });
  }

  openConfirmationDialog(action: string, prop: PropositionDeRattrapage): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {action, proposition: prop}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'confirm') {
          this.confirmRattrapage(prop);
        } else if (action === 'reject') {
          this.rejectRattrapage(prop.id);
        }
      }
    });
  }

  confirmRattrapage(prop: PropositionDeRattrapage) {
    if (prop && prop.status === 'En attente') {
      prop.status = 'Confirmé';
      const dateObj = new Date(prop.date);
      const day = dateObj.toLocaleDateString('fr-FR', {weekday: 'long'}).toUpperCase();
      const time = '10:15-11:45';

      const seance: Seance = {
        name: prop.name,
        id: Math.floor(Math.random() * 1000),
        room: '',
        type: prop.type,
        professor: `Enseignant ${prop.enseignantId}`,
        groupe: prop.niveau,
        biWeekly: false
      };

      this.rattrapageService.addRattrapageSeance(day, time, seance);
    }
    this.notificationService.addNotification(`Make-up session confirmed: ${prop.name} on ${prop.date}`, 'success', prop.enseignantId, 0);

  }
  changeRoom(proposition: any) {
    proposition.salle = null;
    // Add your room change logic here
  }
  rejectRattrapage(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'Refusé'} : prop
    );
    const refusedProp = this.propositions.find(prop => prop.id === id);
    if (refusedProp) {
      this.notificationService.addNotification(`Make-up session rejected: ${refusedProp.name} on ${refusedProp.date}`, 'error', refusedProp.enseignantId, 0);
    }
  }

  reinitialiser(id: number) {
    this.propositions = this.propositions.map(prop =>
      prop.id === id ? {...prop, status: 'En attente'} : prop
    );
  }

  assignRoom(event: Event, propId: number) {
    const target = event.target as HTMLInputElement;
    const newSalle = target.value;

    // Get the stored mapping for this proposition
    const scheduleInfo = this.rattrapageScheduleMap.get(propId);

    if (!scheduleInfo) {
      this.notificationService.addNotification('Cannot update salle: session mapping not found', 'error', 0, 0);
      return;
    }

    const { day, time, seanceId } = scheduleInfo;

    // Update the salle
    const success = this.rattrapageService.updateSeanceSalle(
      day,
      time,
      seanceId,
      newSalle
    );

    if (success) {
      // Update the proposition's salle in the local array
      this.propositions = this.propositions.map(prop =>
        prop.id === propId ? { ...prop, salle: newSalle } : prop
      );

      this.notificationService.addNotification(`Salle updated to ${newSalle}`, 'success', 0, 0);

    } else {
      this.notificationService.addNotification('Failed to update salle', 'error', 0, 0);
    }
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }
// Add this method to filter by date range
  applyDateFilter() {
    const start = this.startDate.value ? new Date(this.startDate.value) : null;
    const end = this.endDate.value ? new Date(this.endDate.value) : null;
    const status = this.filterStatus.value;

    this.propositions = this.propositions.filter(prop => {
      const propDate = new Date(prop.date);
      const matchesDate = (!start || propDate >= start) && (!end || propDate <= end);
      const matchesStatus = status === 'all' || prop.status === status;
      return matchesDate && matchesStatus;
    });
  }

  // Update reset filters method
  ngOnInit() {
    // Update time every second
    this.updateDateTime();
    this.timeInterval = setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toISOString()
      .replace('T', ' ')
      .slice(0, 19);
  }



  applyFilters() {
    const filters = {
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      status: this.filterStatus.value
    };

    // Implement your filter logic here
    console.log('Applying filters:', filters);
  }

  resetFilters() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate.setValue(thirtyDaysAgo);
    this.endDate.setValue(today);
    this.filterStatus.setValue('all');
  }


  private loadPropositions() {

  }

//design
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'En attente': return 'bg-orange-100 text-orange-700';
      case 'Confirmé': return 'bg-green-100 text-green-700';
      case 'Refuseé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'En attente': return 'clock';
      case 'Confirmé': return 'check-circle';
      case 'Refusé': return 'x-circle';
      default: return 'help-circle';
    }
  }

  getPendingCount(): number {
    return this.propositions.filter(p => p.status === 'En attente').length;
  }

  getConfirmedCount(): number {
    return this.propositions.filter(p => p.status === 'Confirmé').length;
  }

  getRefusedCount(): number {
    return this.propositions.filter(p => p.status === 'Refusé').length;
  }

  applyFilters() {

  }

  onStatusChange() {

  }

  onDateChange() {

  }
}
