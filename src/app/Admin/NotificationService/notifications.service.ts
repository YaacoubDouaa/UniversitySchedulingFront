import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Personne} from '../../models/Users';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Notification {
  id: number;
  message: string;
  date: string; // ISO Date Format
  type: string;
  read: boolean;
  recepteurId: number;
  expediteurId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  constructor(private snackBar: MatSnackBar) {}

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  addNotification(message: string, type: 'info' | 'warning' | 'success' | 'error', recepteurId: number, expediteurId: number) {
    const newNotification: Notification = {
      id: this.notifications.length + 1,
      message,
      date: new Date().toISOString(),
      type,
      read: false,
      recepteurId,
      expediteurId
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

  sendNotificationToUser(message: string, type: 'info' | 'warning' | 'success' | 'error', recepteurId: number, expediteurId: number) {
    this.addNotification(message, type, recepteurId, expediteurId);
  }

  sendNotificationToPersonneById(message: string, type: 'info' | 'warning' | 'success' | 'error', personne: Personne, expediteurId: number) {
    personne.signalIds.forEach(id => {
      this.addNotification(message, type, id, expediteurId);
    });
  }
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

}
