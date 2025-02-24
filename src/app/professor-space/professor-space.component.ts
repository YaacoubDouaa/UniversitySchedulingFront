import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProfessorsService} from '../professors.service';
import {animate, style, transition, trigger} from '@angular/animations';


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
  navItems = [
    { route: 'profdashboard', label: 'Dashboard', icon: 'home' },
    { route: 'profschedule', label: 'My Schedule', icon: 'calendar' },
    { route: 'propose-rattrapage', label: 'Make-up Sessions', icon: 'clock' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' }
  ];
 showMessageNotification: boolean=false;

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
}
