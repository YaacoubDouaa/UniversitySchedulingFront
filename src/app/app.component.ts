// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import {Conversation, MessagingService,Notification} from './messaging.service';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'UniversitySchedulingFront';
  isSidebarOpen = true;
  currentDate = '2025-02-23 15:27:10';
  currentUser = 'YaacoubDouaa';
  currentUserId = 1;
  unreadMessages = 0;
  showMessageNotification = false;
  latestMessage = {
    sender: '',
    content: '',
    time: ''
  };

  private subscriptions = new Subscription();
  private baseTime = new Date('2025-02-23T15:27:10Z');

  constructor(
    private router: Router,
    private messagingService: MessagingService
  ) {
    this.updateDateTime();
  }

  ngOnInit(): void {
    // Update time every second
    setInterval(() => {
      this.baseTime = new Date(this.baseTime.getTime() + 1000);
      this.updateDateTime();
    }, 1000);

    // Subscribe to conversations
    this.subscriptions.add(
      this.messagingService.conversations$.subscribe(conversations => {
        this.updateNotifications(conversations);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateDateTime(): void {
    this.currentDate = this.baseTime.toISOString().slice(0, 19).replace('T', ' ');
  }

  private updateNotifications(conversations: Conversation[]): void {
    // Calculate total unread messages
    this.unreadMessages = conversations.reduce((total, conv) =>
      total + conv.unreadCount, 0);

    // Find latest unread message
    const latestNotification = this.findLatestUnreadNotification(conversations);
    if (latestNotification) {
      const conversation = conversations.find(c =>
        c.notifications.includes(latestNotification));

      if (conversation) {
        this.latestMessage = {
          sender: conversation.name,
          content: latestNotification.message,
          time: this.formatTimeAgo(latestNotification.date)
        };

        // Show notification if we have unread messages
        this.showMessageNotification = this.unreadMessages > 0;
      }
    }
  }

  private findLatestUnreadNotification(conversations: Conversation[]): Notification | null {
    let latestNotification: Notification | null = null;
    let latestDate = new Date(0);

    conversations.forEach(conversation => {
      conversation.notifications.forEach(notification => {
        if (!notification.read &&
          notification.expediteurId !== this.currentUserId) {
          const notificationDate = new Date(notification.date);
          if (notificationDate > latestDate) {
            latestDate = notificationDate;
            latestNotification = notification;
          }
        }
      });
    });

    return latestNotification;
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = this.baseTime;
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return 'À l\'instant';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `Il y a ${minutes} min`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `Il y a ${hours}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
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
  }hhh
}
