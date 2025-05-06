import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProfessorsService} from '../../Services/ProfessorSevice/professors.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../auth-service.service';


@Component({
  selector: 'app-professor-space',
  templateUrl: './professor-space.component.html',
  standalone:false,
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
export class ProfessorSpaceComponent implements OnInit {
  isOpen = true;
  currentDateTime = '2025-02-23 23:24:03';
  currentUser = 'YaacoubDouaa';
  isMobileMenuOpen = false;
  currentUserId:number=2;
  unreadMessages = 3;

  latestMessage = {
    sender: 'Prof. Ahmed',
    content: 'Bonjour, je voudrais discuter de l\'emploi du temps...',
    time: '2 min ago'
  };
  // Update navigation items to match your route configuration
  navItems = [
    // Use relative paths that m
    // atch your ProfRoutingModule
    { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { route: 'schedule', label: 'My Schedule', icon: 'calendar' },
    { route: 'propose-rattrapage', label: 'Make-up Sessions', icon: 'clock' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' },
    { route: 'notifications', label: 'Notifications', icon: 'bell' }
  ];
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

  // Stats
  stats = {
    totalCourses: 6,
    upcomingExams: 3,
    attendance: '85%',
    rattrapages: 2
  };

  // Schedule Updates
  scheduleUpdates = [
    {
      date: '2025-02-27',
      changes: [
        { type: 'added', course: 'Mathematics', time: '10:15-11:45' },
        { type: 'cancelled', course: 'Physics Lab', time: '13:00-14:30' }
      ]
    }
  ];

  showMessageNotification: boolean=true;
  protected showNotification=false;
  toggleNotification() {
    this.showNotification = !this.showNotification;
  }
  constructor(
    private router: Router,
    private professorService: ProfessorsService,private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateDateTime();
  }

  private updateDateTime(): void {
    setInterval(() => {
      this.currentDateTime = new Date()
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
    }, 1000);
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  logout(): void {
    // Call the auth service logout method
    this.authService.logout();
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  navigateToMessages(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.showMessageNotification = false;
    this.router.navigate(['/messages'])
      .catch(error => console.error('Navigation error:', error));
  }

  dismissNotification(event: Event): void {
    event.stopPropagation();
    this.showMessageNotification = false;
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


  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      schedule_update: 'blue',
      rattrapage: 'purple',
      exam: 'green',
      default: 'gray'
    };
    return colors[type] || colors['default'];
  }
}
