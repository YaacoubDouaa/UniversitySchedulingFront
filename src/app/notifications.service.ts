import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  addNotification(message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') {
    const newNotification: Notification = {
      id: this.notifications.length + 1,
      message,
      type,
      read: false,
      timestamp: new Date()
    };
    this.notifications.unshift(newNotification);
    this.notificationsSubject.next(this.notifications);
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next(this.notifications);
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notificationsSubject.next(this.notifications);
  }

  clearNotifications() {
    this.notifications = [];
    this.notificationsSubject.next(this.notifications);
  }

  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getNotifications().subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }
}
