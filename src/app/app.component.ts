import {Component, OnInit} from '@angular/core';
import {Schedule} from './models/Schedule';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
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
  export class AppComponent implements OnInit {
    title = 'UniversitySchedulingFront';
    isSidebarOpen = true;
    currentDate: string = '';
    currentUser: string = 'YaacoubDouaa';
    currentUserId:number=1;
    unreadMessages = 3;
    showMessageNotification = false;
    latestMessage = {
      sender: 'Prof. Ahmed',
      content: 'Bonjour, je voudrais discuter de l\'emploi du temps...',
      time: '2 min ago'
    };

    constructor(private router: Router) {
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
  }
