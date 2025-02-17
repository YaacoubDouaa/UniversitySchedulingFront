// import { Component, OnInit } from '@angular/core';
// import {NotificationService} from '../notifications.service';
//
//
// @Component({
//   selector: 'app-notifications',
//   templateUrl: './notifications.component.html',
//   styleUrls: ['./notifications.component.css'],
//   standalone:false
// })
// export class NotificationsComponent implements OnInit {
//   notifications: Notification[] = [];
//   unreadCount: number = 0;
//
//   constructor(private notificationService: NotificationService) {}
//
//   ngOnInit() {
//     this.notificationService.getNotifications().subscribe(notifications => {
//       this.notifications = notifications;
//     });
//
//     this.notificationService.getUnreadCount().subscribe(count => {
//       this.unreadCount = count;
//     });
//   }
//
//   markAsRead(notification: Notification) {
//     this.notificationService.markAsRead(notification.id);
//   }
//
//   markAllAsRead() {
//     this.notificationService.markAllAsRead();
//   }
//
//   clearNotifications() {
//     this.notificationService.clearNotifications();
//   }
// }
