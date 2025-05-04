import { Component } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {ProfessorsService} from '../../Services/ProfessorSevice/professors.service';

@Component({
  selector: 'app-technicien-space',
  standalone: false,

  templateUrl: './technicien-space.component.html',
  styleUrl: './technicien-space.component.css',
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
export class TechnicienSpaceComponent {
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
  navItems = [
    { route: 'techDashboard', label: 'Dashboard', icon: 'home' },
    { route: 'techGlobalSchedule', label: 'Global Schedule', icon: 'calendar' },
    { route: 'rooms', label: 'Room Manager ', icon: 'map-pin' },
    { route: 'techSchedule', label: 'Groups schedule', icon: 'users' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' }
  ];
  showMessageNotification: boolean=true;

  constructor(
    private router: Router,
    private professorService: ProfessorsService
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
    this.router.navigate(['/adminSpace']);
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
}
