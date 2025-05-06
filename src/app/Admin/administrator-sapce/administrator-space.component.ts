// Current Date and Time (UTC): 2025-05-06 11:03:25
// Current User's Login: YaacoubDouaa

import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service.service';

@Component({
  selector: 'app-administrator-sapce',
  standalone: false,
  templateUrl: './administrator-space.component.html',
  styleUrl: './administrator-space.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class AdministratorSpaceComponent implements OnInit {
  title = 'UniversitySchedulingFront';
  // Fix naming consistency - use isOpen throughout the component
  isOpen = true;
  isSidebarOpen = true; // This is redundant but keeping for compatibility

  currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  currentDate = this.currentDateTime;
  currentUser = 'YaacoubDouaa';
  currentUserId = 1;

  unreadMessages = 3;
  showMessageNotification = false;
  latestMessage = {
    sender: 'Prof. Ahmed',
    content: 'Bonjour, je voudrais discuter de l\'emploi du temps...',
    time: '2 min ago'
  };

  isMobileMenuOpen = false;

  // Keep relative route paths for child routes
  navItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { route: 'view', label: 'View Group Schedule', icon: 'calendar' },
    { route: 'schedule', label: ' Edit Group Schedule', icon: 'calendar' },
    { route: 'global', label: 'Global schedule', icon: 'book' },
    { route: 'conflicts', label: 'Conflicts', icon: 'alert-triangle' },
    { route: 'rattrapage', label: 'Rattrapage', icon: 'refresh-cw' },
    { route: 'profs', label: 'Disponibilté des profs', icon: 'users' },
    { route: 'rooms', label: 'Disponibilté des salles', icon: 'map-pin' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' },
    { route: 'import', label: 'Import Csv', icon: 'file-plus' }
  ];
  private showNotification =false;

  constructor(private router: Router, private authService: AuthService) {
    this.updateDateTime();
  }

  ngOnInit(): void {
    // Start updating date/time
    setInterval(() => this.updateDateTime(), 1000);

    // Simulate receiving a new message
    setTimeout(() => {
      this.showMessageNotification = true;
    }, 2000);
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    this.currentDate = this.currentDateTime;
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.isSidebarOpen = this.isOpen; // Keep them in sync
  }

  navigateToMessages(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.showMessageNotification = false;

    // Use relative navigation to the 'messages' child route
    this.router.navigate(['messages'], { relativeTo: this.router.routerState.root.firstChild })
      .catch(error => console.error('Navigation error:', error));
  }

  dismissNotification(event: Event): void {
    event.stopPropagation();
    this.showMessageNotification = false;
  }

  logout(): void {
    // Call the auth service logout method
    this.authService.logout();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      schedule_update: 'calendar',
      rattrapage: 'clock',
      exam: 'book-open',
      default: 'bell'
    };
    return icons[type] || icons['default'];
  }
  notifications: any[] = [
    {
      type: 'schedule_update',
      title: 'Schedule Update',
      message: 'Your Tuesday schedule has been updated',
      time: '5 minutes ago'
    },
    {
      type: 'rattrapage',
      title: 'New Rattrapage Session',
      message: 'Mathematics session added for next week',
      time: '1 hour ago'
    }
  ];
  toggleNotification() {
    this.showNotification = !this.showNotification;
  }
  // Stats
  stats = {
    totalCourses: 6,
    upcomingExams: 3,
    attendance: '85%',
    rattrapages: 2
  };
  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      schedule_update: 'blue',
      rattrapage: 'purple',
      exam: 'green',
      default: 'gray'
    };
    return colors[type] || colors['default'];
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  // Add this method to your component
  navigateToRoute(route: string): void {
    console.log(`Navigating to: ${route}`);
    this.router.navigate([route], { relativeTo: this.router.routerState.root.firstChild })
      .then(() => console.log('Navigation success'))
      .catch(error => console.error('Navigation error:', error));
  }
}
