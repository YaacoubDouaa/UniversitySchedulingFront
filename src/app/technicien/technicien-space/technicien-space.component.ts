import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../auth-service.service';
import { interval, Subscription } from 'rxjs';

interface NavItem {
  route: string;
  label: string;
  icon: string;
}

interface Notification {
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-technicien-space',
  templateUrl: './technicien-space.component.html',
  styleUrl: './technicien-space.component.css',
  standalone:false,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class TechnicienSpaceComponent implements OnInit, OnDestroy {
  // User information
  currentUser: string = 'YaacoubDouaa';
  currentDateTime: Date = new Date();

  // Sidebar and mobile states
  isOpen: boolean = true;
  isMobileView: boolean = false;
  isMobileMenuOpen: boolean = false;

  // Notification panel
  showNotification: boolean = false;
  notifications: Notification[] = [
    {
      type: 'schedule_update',
      title: 'Schedule Update',
      message: 'Your Tuesday schedule has been updated.',
      time: '5 minutes ago',
      read: false
    },
    {
      type: 'rattrapage',
      title: 'New Rattrapage Session',
      message: 'Mathematics session added for next week.',
      time: '1 hour ago',
      read: false
    },
    {
      type: 'exam',
      title: 'Exam Room Change',
      message: 'Database Systems exam moved to Room A-101.',
      time: 'Yesterday',
      read: true
    }
  ];

  // Navigation items with correct routes
  navItems: NavItem[] = [
    { route: 'techdashboard', label: 'Dashboard', icon: 'grid' },
    { route: 'global', label: 'Global Schedule', icon: 'calendar' },
    { route: 'rooms', label: 'Room Availability', icon: 'map-pin' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' },
    { route: 'notifications', label: 'Notifications', icon: 'bell' }
  ];

  // Subscriptions for cleanup
  private clockSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Check screen size on init
    this.checkScreenSize();

    // Set up clock to update every second
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentDateTime = new Date();
    });

    // Simulate new notification after 5 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  // Window resize listener
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  // Check screen size to adjust layout
  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 640; // sm breakpoint in Tailwind

    // Auto-close sidebar on mobile
    if (this.isMobileView) {
      this.isOpen = false;
    } else {
      this.isMobileMenuOpen = false;
    }
  }

  // Toggle sidebar for desktop view
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  // Toggle mobile menu for mobile view
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Toggle notification panel
  toggleNotification(): void {
    this.showNotification = !this.showNotification;

    // If opening notifications, mark them as read
    if (this.showNotification) {
      this.markNotificationsAsRead();
    }
  }

  // Mark all notifications as read
  markNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  // Get appropriate icon for notification type
  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      schedule_update: 'calendar',
      rattrapage: 'refresh-cw',
      exam: 'book-open',
      default: 'bell'
    };
    return icons[type] || icons['default'];
  }

  // Get appropriate color for notification type
  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      schedule_update: 'blue',
      rattrapage: 'purple',
      exam: 'green',
      default: 'gray'
    };
    return colors[type] || colors['default'];
  }

  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
