import {Component, EventEmitter, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';


@Component({
  selector: 'app-nav-bar',

  templateUrl: './nav-bar.component.html',
  imports: [
    NgClass,
    NgIf,
    NgForOf,

  ],

  styleUrl: './nav-bar.component.css'

})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  isProfileMenuOpen = false;
  isNotificationOpen = false;

  notifications = [
    { id: 1, message: 'Nouveau conflit détecté', type: 'warning', time: '5m' },
    { id: 2, message: 'Session de rattrapage ajoutée', type: 'info', time: '10m' },
    { id: 3, message: 'Mise à jour de l\'emploi du temps', type: 'info', time: '1h' }
  ];

  userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'assets/avatar.jpg'
  };

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isNotificationOpen = false;
  }

  toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.isProfileMenuOpen = false;
  }


}
