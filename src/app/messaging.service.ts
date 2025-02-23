// services/messaging.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// models/messaging.models.ts
export interface Signal {
  id: number;
  message: string;
  severity: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  message: string;
  date: string;
  type: string;
  read: boolean;
  recepteurId: number;
  expediteurId: number;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage: Notification;
  unreadCount: number;
  notifications: Notification[];
  status: 'online' | 'offline' | 'away';
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly CURRENT_DATE = '2025-02-23 14:43:53';
  private readonly CURRENT_USER = 'YaacoubDouaa';
  private readonly CURRENT_USER_ID = 1;

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private selectedConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private signalsSubject = new BehaviorSubject<Signal[]>([]);

  conversations$ = this.conversationsSubject.asObservable();
  selectedConversation$ = this.selectedConversationSubject.asObservable();
  signals$ = this.signalsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const initialConversations: Conversation[] = [
      {
        id: 1,
        name: 'Prof. Ahmed',
        lastMessage: {
          id: 1,
          message: 'La réunion de département est prévue pour demain à 10h',
          date: '2025-02-23T14:40:00Z',
          type: 'MESSAGE',
          read: false,
          recepteurId: 1,
          expediteurId: 2
        },
        unreadCount: 2,
        notifications: [
          {
            id: 1,
            message: 'Bonjour, pouvez-vous me confirmer votre présence à la réunion?',
            date: '2025-02-23T14:35:00Z',
            type: 'MESSAGE',
            read: false,
            recepteurId: 1,
            expediteurId: 2
          },
          {
            id: 2,
            message: 'La réunion de département est prévue pour demain à 10h',
            date: '2025-02-23T14:40:00Z',
            type: 'MESSAGE',
            read: false,
            recepteurId: 1,
            expediteurId: 2
          }
        ],
        status: 'online'
      },
      // Add more conversations as needed
    ];

    const initialSignals: Signal[] = [
      {
        id: 1,
        message: 'Vous avez 2 nouveaux messages non lus',
        severity: 'info',
        timestamp: this.CURRENT_DATE
      }
    ];

    this.conversationsSubject.next(initialConversations);
    this.signalsSubject.next(initialSignals);
  }

  selectConversation(conversationId: number): void {
    const conversations = this.conversationsSubject.value;
    const conversation = conversations.find(c => c.id === conversationId);

    if (conversation) {
      if (conversation.unreadCount > 0) {
        this.markConversationAsRead(conversation);
      }
      this.selectedConversationSubject.next({...conversation});
      this.updateConversations();
    }
  }

  private markConversationAsRead(conversation: Conversation): void {
    conversation.unreadCount = 0;
    conversation.notifications.forEach(n => n.read = true);

    const signal: Signal = {
      id: this.signalsSubject.value.length + 1,
      message: `Messages marqués comme lus - ${conversation.name}`,
      severity: 'success',
      timestamp: this.CURRENT_DATE
    };

    this.addSignal(signal);
  }

  sendMessage(message: string): void {
    const selectedConversation = this.selectedConversationSubject.value;
    if (!message.trim() || !selectedConversation) return;

    const notification: Notification = {
      id: Date.now(),
      message: message,
      date: this.CURRENT_DATE,
      type: 'MESSAGE',
      read: true,
      recepteurId: selectedConversation.id,
      expediteurId: this.CURRENT_USER_ID
    };

    const updatedConversation = {
      ...selectedConversation,
      lastMessage: notification,
      notifications: [...selectedConversation.notifications, notification]
    };

    const conversations = this.conversationsSubject.value.map(conv =>
      conv.id === selectedConversation.id ? updatedConversation : conv
    );

    this.conversationsSubject.next(conversations);
    this.selectedConversationSubject.next(updatedConversation);

    const signal: Signal = {
      id: this.signalsSubject.value.length + 1,
      message: 'Message envoyé',
      severity: 'success',
      timestamp: this.CURRENT_DATE
    };

    this.addSignal(signal);
  }

  private addSignal(signal: Signal): void {
    this.signalsSubject.next([...this.signalsSubject.value, signal]);
  }

  private updateConversations(): void {
    const conversations = [...this.conversationsSubject.value];
    this.conversationsSubject.next(conversations);
  }

  getFilteredConversations(query: string): Conversation[] {
    if (!query.trim()) return this.conversationsSubject.value;

    const searchTerm = query.toLowerCase();
    return this.conversationsSubject.value.filter(conv =>
      conv.name.toLowerCase().includes(searchTerm) ||
      conv.lastMessage.message.toLowerCase().includes(searchTerm)
    );
  }

  isMessageFromCurrentUser(notification: Notification): boolean {
    return notification.expediteurId === this.CURRENT_USER_ID;
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const now = new Date(this.CURRENT_DATE);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
