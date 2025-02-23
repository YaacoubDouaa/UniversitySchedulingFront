// services/messaging.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {User} from './models/Users';
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
  private baseTime = new Date('2025-02-23T15:11:52Z');
  private readonly CURRENT_USER = 'YaacoubDouaa';
  private readonly CURRENT_USER_ID = 1;
  private readonly PROF_ID = 2; // Added professor's ID

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private selectedConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private signalsSubject = new BehaviorSubject<Signal[]>([]);

  conversations$ = this.conversationsSubject.asObservable();
  selectedConversation$ = this.selectedConversationSubject.asObservable();
  signals$ = this.signalsSubject.asObservable();

  constructor() {
    this.initializeData();
    // Update time every second
    setInterval(() => {
      this.baseTime = new Date(this.baseTime.getTime() + 1000);
    }, 1000);
  }

  private getCurrentDateTime(): string {
    return this.baseTime.toISOString();
  }

  private initializeData(): void {
    const currentTime = this.getCurrentDateTime();
    const fiveMinutesAgo = new Date(this.baseTime.getTime() - 5 * 60000).toISOString();
    const tenMinutesAgo = new Date(this.baseTime.getTime() - 10 * 60000).toISOString();

    const initialConversations: Conversation[] = [
      {
        id: this.PROF_ID,
        name: 'Prof. Ahmed',
        lastMessage: {
          id: 2,
          message: 'La réunion de département est prévue pour demain à 10h',
          date: fiveMinutesAgo,
          type: 'MESSAGE',
          read: false,
          recepteurId: this.CURRENT_USER_ID,
          expediteurId: this.PROF_ID
        },
        unreadCount: 2,
        notifications: [
          {
            id: 1,
            message: 'Bonjour, pouvez-vous me confirmer votre présence à la réunion?',
            date: tenMinutesAgo,
            type: 'MESSAGE',
            read: false,
            recepteurId: this.CURRENT_USER_ID,
            expediteurId: this.PROF_ID
          },
          {
            id: 2,
            message: 'La réunion de département est prévue pour demain à 10h',
            date: fiveMinutesAgo,
            type: 'MESSAGE',
            read: false,
            recepteurId: this.CURRENT_USER_ID,
            expediteurId: this.PROF_ID
          }
        ],
        status: 'online'
      }
    ];

    const initialSignals: Signal[] = [
      {
        id: 1,
        message: 'Vous avez 2 nouveaux messages non lus',
        severity: 'info',
        timestamp: currentTime
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
      timestamp: this.getCurrentDateTime()
    };

    this.addSignal(signal);
  }

  sendMessage(message: string): void {
    const selectedConversation = this.selectedConversationSubject.value;
    if (!message.trim() || !selectedConversation) return;

    const currentTime = this.getCurrentDateTime();

    const notification: Notification = {
      id: Date.now(),
      message: message,
      date: currentTime,
      type: 'MESSAGE',
      read: true,
      recepteurId: this.PROF_ID, // Send to professor
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
      timestamp: currentTime
    };

    this.addSignal(signal);

    // Generate professor's response
    this.generateProfessorResponse(selectedConversation.id);
  }

  private generateProfessorResponse(conversationId: number): void {
    setTimeout(() => {
      const conversation = this.conversationsSubject.value.find(c => c.id === conversationId);
      if (!conversation) return;

      const currentTime = this.getCurrentDateTime();
      const notification: Notification = {
        id: Date.now(),
        message: 'Je vous remercie pour votre message. Je vais l\'examiner et vous répondre dans les plus brefs délais.',
        date: currentTime,
        type: 'MESSAGE',
        read: false,
        recepteurId: this.CURRENT_USER_ID,
        expediteurId: this.PROF_ID // From professor
      };

      const updatedConversation = {
        ...conversation,
        lastMessage: notification,
        notifications: [...conversation.notifications, notification],
        unreadCount: this.selectedConversationSubject.value?.id === conversationId ? 0 : conversation.unreadCount + 1
      };

      const conversations = this.conversationsSubject.value.map(conv =>
        conv.id === conversationId ? updatedConversation : conv
      );

      this.conversationsSubject.next(conversations);

      if (this.selectedConversationSubject.value?.id === conversationId) {
        this.selectedConversationSubject.next(updatedConversation);
      }

      const signal: Signal = {
        id: this.signalsSubject.value.length + 1,
        message: `Nouveau message de ${conversation.name}`,
        severity: 'info',
        timestamp: currentTime
      };

      this.addSignal(signal);
    }, 1000); // 1 second delay for response
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
    const now = this.baseTime;

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    return date.toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Add available users list
  private readonly availableUsers: User[] = [
    {id: 2, name: 'Prof. Ahmed', status: 'online'},
    {id: 3, name: 'Dr. Sarah', status: 'away'},
    {id: 4, name: 'Prof. Mohamed', status: 'offline'},
    {id: 5, name: 'Prof. Fatima', status: 'online'},
    {id: 6, name: 'Dr. Karim', status: 'online'}
  ];

  // Add a subject for available users
  private availableUsersSubject = new BehaviorSubject<User[]>(this.availableUsers);
  availableUsers$ = this.availableUsersSubject.asObservable();

  // ... your existing code ...

  // Add these new methods:
  getAvailableUsers(): User[] {
    // Filter out users that already have a conversation
    const existingConversationUserIds = this.conversationsSubject.value
      .map(conv => conv.id);

    return this.availableUsers
      .filter(user => !existingConversationUserIds.includes(user.id));
  }

  createNewConversation(userId: number): void {
    const user = this.availableUsers.find(u => u.id === userId);
    if (!user) return;

    const currentTime = this.getCurrentDateTime();

    const newConversation: Conversation = {
      id: userId,
      name: user.name,
      lastMessage: {
        id: Date.now(),
        message: 'Début de la conversation',
        date: currentTime,
        type: 'MESSAGE',
        read: true,
        recepteurId: userId,
        expediteurId: this.CURRENT_USER_ID
      },
      unreadCount: 0,
      notifications: [],
      status: user.status
    };

    const updatedConversations = [
      ...this.conversationsSubject.value,
      newConversation
    ];

    this.conversationsSubject.next(updatedConversations);
    this.selectConversation(userId);

    const signal: Signal = {
      id: this.signalsSubject.value.length + 1,
      message: `Nouvelle conversation créée avec ${user.name}`,
      severity: 'success',
      timestamp: currentTime
    };

    this.addSignal(signal);
  }
}
