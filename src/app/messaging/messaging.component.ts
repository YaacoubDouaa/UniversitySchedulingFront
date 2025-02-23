// message.component.ts
import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {MessagingService} from '../messaging.service';
export interface Signal {
  id: number;
  message: string;
  severity: string;
  timestamp: string; // ISO Date Format
}
interface Conversation {
  id: number;
  name: string;
  lastMessage: Notification;
  unreadCount: number;
  notifications: Notification[];
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}
// Notification Interface
export interface Notification {
  id: number;
  message: string;
  date: string; // ISO Date Format
  type: string;
  read: boolean;
  recepteurId: number;
  expediteurId: number;
}

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  standalone:false,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('expandMessage', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ])
    ]),
      trigger('fadeInOut', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
        ])
      ]),

    ]
})
export class MessagingComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  signals: Signal[] = [];
  newMessage: string = '';
  searchQuery: string = '';

  private subscriptions = new Subscription();

  constructor(private messagingService: MessagingService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.messagingService.conversations$.subscribe(
        conversations => this.conversations = conversations
      )
    );

    this.subscriptions.add(
      this.messagingService.selectedConversation$.subscribe(
        conversation => this.selectedConversation = conversation
      )
    );

    this.subscriptions.add(
      this.messagingService.signals$.subscribe(
        signals => this.signals = signals
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectConversation(conversation: Conversation): void {
    this.messagingService.selectConversation(conversation.id);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messagingService.sendMessage(this.newMessage);
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  getFilteredConversations(): Conversation[] {
    return this.messagingService.getFilteredConversations(this.searchQuery);
  }

  isMessageFromCurrentUser(notification: Notification): boolean {
    return this.messagingService.isMessageFromCurrentUser(notification);
  }

  formatDate(date: string): string {
    return this.messagingService.formatDate(date);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messageContainer = document.querySelector('.message-container');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 100);
  }
}
