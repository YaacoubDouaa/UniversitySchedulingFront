import {Component, NgIterable, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {AuthService} from '../../auth-service.service';

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
export class AdministratorSpaceComponent  implements OnInit {
  title = 'UniversitySchedulingFront';
  isSidebarOpen = true;
  currentDate: string = '2025-02-23 23:24:03';
  currentUser: string = 'YaacoubDouaa';
  currentUserId:number=1;
  unreadMessages = 3;
  showMessageNotification = false;
  latestMessage = {
    sender: 'Prof. Ahmed',
    content: 'Bonjour, je voudrais discuter de l\'emploi du temps...',
    time: '2 min ago'
  };


  isMobileMenuOpen = false;
  navItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { route: 'schedule', label: 'Group Schedule', icon: 'calendar' },
    { route: 'global', label: 'Global schedule', icon: 'book' },
    { route: 'conflicts', label: 'Conflicts', icon: 'alert-triangle' },
    { route: 'rattrapage', label: 'Rattrapage', icon: 'refresh-cw' },
    { route: 'profs', label: 'Disponibilté des profs', icon: 'users' },
    { route: 'rooms', label: 'Disponibilté des salles', icon: 'map-pin' },
    { route: 'messages', label: 'Messages', icon: 'message-circle' },
    { route: 'import', label: 'Import Csv', icon: 'file-plus' }
  ];


  constructor(private router: Router,private authService: AuthService) {
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
    this.currentDate = now.toISOString().slice(0, 19).replace('T', ' ');
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
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
  // logout() {
  //   this.authService.logout('admin');
  // }
  isOpen: any;
  currentDateTime: string='2025-05-04 19:44:06';





  logout(): void {
    this.router.navigate(['/adminSpace']);
  }
  toggleMobileMenu() {

  }


}

