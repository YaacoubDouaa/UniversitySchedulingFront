import {animate, style, transition, trigger} from '@angular/animations';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppNotification} from '../models/Notifications';
import {Subscription} from 'rxjs';
import {NotificationService} from '../notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  unreadCount = 0;
  showNotifications = false;
  currentDateTime: string;
  currentUser: string;
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {
    this.currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.currentUser = 'YaacoubDouaa';
  }

  ngOnInit(): void {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications as AppNotification[];
        this.unreadCount = notifications.filter(n => !n.read).length;
      })
    );

    // Update current time every second
    setInterval(() => {
      this.currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.markAllAsRead();
    }
  }

  markAsRead(notification: AppNotification): void {
    this.notificationService.markAsRead(notification.id);
  }

  clearAll(): void {
    this.notificationService.clearNotifications();
    this.showNotifications = false;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      case 'info': default: return 'info';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
