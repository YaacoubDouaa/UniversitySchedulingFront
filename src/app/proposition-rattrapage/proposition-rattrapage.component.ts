import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { PropositionDeRattrapage } from '../models/Notifications';
import { RattrapageService } from '../rattrapage.service';
import { NotificationService } from '../notifications.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PropositionsDeRattrapageService } from '../propositions-de-rattrapage.service';

interface StatusIcon {
  icon: string;
  color: string;
  bgColor: string;
  message: string;
}

@Component({
  selector: 'app-proposition-rattrapage',
  templateUrl: './proposition-rattrapage.component.html',
  styleUrls: ['./proposition-rattrapage.component.css'],
  standalone:false,
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
/**
 * Component for managing makeup session propositions
 * Handles the display, filtering, and actions for makeup session requests
 */
export class PropositionRattrapageComponent implements OnInit, OnDestroy {
  /**
   * System configuration
   * Stores current date/time and user information
   */
  private readonly currentDateTime = '2025-02-24 20:07:27';
  private readonly currentUser = 'YaacoubDouaa';
  private readonly ADMIN_ID = 1; // ID used for sending administrative notifications

  /**
   * Form Controls
   * Handle user input for filtering and sorting propositions
   */
  searchControl = new FormControl('');        // Text search input
  sortControl = new FormControl('date');      // Sort order selection
  filterStatus = new FormControl('all');      // Status filter selection
  startDate = new FormControl<Date | null>(null);  // Date range start
  endDate = new FormControl<Date | null>(null);    // Date range end

  /**
   * Component State
   * Manages the visual and data state of the component
   */
  isDarkMode = false;  // Tracks dark/light theme
  propositions: PropositionDeRattrapage[] = [];          // All propositions
  filteredPropositions: PropositionDeRattrapage[] = [];  // Filtered view
  private propositionsSubscription?: Subscription;        // Cleanup reference

  /**
   * Display Configuration
   * Defines the structure and options for the UI
   */
    // Table columns to display
  displayedColumns: string[] = [
    'id', 'date', 'reason', 'status', 'enseignantId',
    'type', 'niveau', 'salle', 'actions'
  ];

  // Available rooms for assignment
  availableRooms = [
    'Room A101', 'Room B202', 'Room C303',
    'Room D404', 'Room E505'
  ];

  /**
   * Status Styling Configuration
   * Defines visual appearance and messages for each status
   */
  statusIcons: { [key: string]: StatusIcon } = {
    'En attente': {
      icon: 'clock',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      message: 'est en attente de confirmation'
    },
    'Confirmé': {
      icon: 'check-circle',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      message: 'a été confirmée'
    },
    'Refusé': {
      icon: 'x-circle',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      message: 'a été refusée'
    }
  };

  /**
   * Component Constructor
   * Initializes services and sets up initial state
   */
  constructor(
    private propositionsService: PropositionsDeRattrapageService,
    private rattrapageService: RattrapageService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.initializeDateRange();
    this.setupFilterSubscriptions();
  }

  /**
   * Lifecycle Hooks
   * Handle component initialization and cleanup
   */
  ngOnInit(): void {
    this.loadPropositions();
  }

  ngOnDestroy(): void {
    this.propositionsSubscription?.unsubscribe();
  }

  /**
   * Date Range Initialization
   * Sets up default date range for filtering (last 30 days)
   */
  private initializeDateRange(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.startDate.setValue(thirtyDaysAgo);
    this.endDate.setValue(today);
  }

  /**
   * Filter Subscriptions Setup
   * Establishes reactive filtering based on user input
   */
  private setupFilterSubscriptions(): void {
    // Apply filters whenever any filter control changes
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.filterStatus.valueChanges.subscribe(() => this.applyFilters());
    this.startDate.valueChanges.subscribe(() => this.applyFilters());
    this.endDate.valueChanges.subscribe(() => this.applyFilters());
  }

  /**
   * Data Loading
   * Fetches and maintains proposition data
   */
  private loadPropositions(): void {
    this.propositionsSubscription = this.propositionsService.propositions$
      .subscribe(propositions => {
        this.propositions = propositions;
        this.applyFilters();
      });
  }

  /**
   * Confirmation Dialog
   * Handles user confirmation for status changes
   */
  openConfirmationDialog(action: string, prop: PropositionDeRattrapage): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        action,
        proposition: prop,
        title: `${action === 'confirm' ? 'Confirmer' : 'Refuser'} la séance de rattrapage`,
        message: `Êtes-vous sûr de vouloir ${action === 'confirm' ? 'confirmer' : 'refuser'}
                 la séance de rattrapage pour ${prop.name}?`
      }
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

  /**
   * Status Management Methods
   * Handle proposition status changes and notifications
   */
  confirmRattrapage(prop: PropositionDeRattrapage): void {
    if (prop && prop.status === 'En attente') {
      this.propositionsService.confirmRattrapage(prop);
      this.notificationService.addNotification(
        `Votre demande de rattrapage pour ${prop.name} a été confirmée`,
        'success',
        prop.enseignantId,
        this.ADMIN_ID
      );
    }
  }

  rejectRattrapage(id: number): void {
    const prop = this.propositions.find(p => p.id === id);
    if (prop) {
      this.propositionsService.rejectRattrapage(id);
      this.notificationService.addNotification(
        `Votre demande de rattrapage pour ${prop.name} a été refusée`,
        'error',
        prop.enseignantId,
        this.ADMIN_ID
      );
    }
  }

  reinitialiser(id: number): void {
    const prop = this.propositions.find(p => p.id === id);
    if (prop) {
      this.propositionsService.reinitialiser(id);
      this.notificationService.addNotification(
        `Votre demande de rattrapage pour ${prop.name} a été remise en attente`,
        'info',
        prop.enseignantId,
        this.ADMIN_ID
      );
    }
  }

  /**
   * Room Assignment
   * Handles room assignment and related notifications
   */
  assignRoom(event: Event, prop: PropositionDeRattrapage): void {
    const target = event.target as HTMLSelectElement;
    const newRoom = target.value;

    this.propositionsService.assignRoom(prop.id, newRoom);
    this.notificationService.addNotification(
      `La salle ${newRoom} a été assignée à votre rattrapage de ${prop.name}`,
      'info',
      prop.enseignantId,
      this.ADMIN_ID
    );
  }

  /**
   * Filter Application
   * Applies all active filters to the propositions list
   */
  applyFilters(): void {
    let filtered = [...this.propositions];

    // Apply text search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(prop =>
        prop.name.toLowerCase().includes(searchTerm) ||
        prop.reason.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    const status = this.filterStatus.value;
    if (status && status !== 'all') {
      filtered = filtered.filter(prop => prop.status === status);
    }

    // Apply date range filter
    const start = this.startDate.value;
    const end = this.endDate.value;
    if (start && end) {
      filtered = filtered.filter(prop => {
        const propDate = new Date(prop.date);
        return propDate >= start && propDate <= end;
      });
    }

    this.filteredPropositions = filtered;
  }

  /**
   * Filter Reset
   * Resets all filters to their default values
   */
  resetFilters(): void {
    this.searchControl.setValue('');
    this.filterStatus.setValue('all');
    this.initializeDateRange();
  }

  /**
   * Theme Management
   * Handles dark/light theme toggling
   */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  /**
   * Status Display Helpers
   * Provide visual styling and icons for status display
   */
  getStatusClasses(status: string): string {
    const statusIcon = this.statusIcons[status];
    return statusIcon ? `${statusIcon.color} ${statusIcon.bgColor}` : 'text-gray-700 bg-gray-100';
  }

  getStatusIcon(status: string): string {
    return this.statusIcons[status]?.icon || 'help-circle';
  }

  /**
   * Status Count Methods
   * Calculate counts for different proposition statuses
   */
  getPendingCount(): number {
    return this.propositions.filter(p => p.status === 'En attente').length;
  }

  getConfirmedCount(): number {
    return this.propositions.filter(p => p.status === 'Confirmé').length;
  }

  getRefusedCount(): number {
    return this.propositions.filter(p => p.status === 'Refusé').length;
  }

  /**
   * System State Getters
   * Provide access to system state information
   */
  getCurrentDateTime(): string {
    return this.currentDateTime;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }

  /**
   * Change Room Assignment
   * Resets the room assignment for a proposition and notifies the user
   * @param proposition The proposition whose room assignment should be changed
   */
  changeRoom(proposition: PropositionDeRattrapage): void {
    // Store the old room for notification
    const oldRoom = proposition.salle;

    // Reset the room in the local proposition
    proposition.salle = undefined;

    // Update through service
    this.propositionsService.assignRoom(proposition.id, '');

    // Send notification about room change
    this.notificationService.addNotification(
      `La salle ${oldRoom} a été libérée pour le rattrapage de ${proposition.name}`,
      'info',
      proposition.enseignantId,
      this.ADMIN_ID
    );
  }
}
