import { Component, Input } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FeatherModule} from 'angular-feather';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    FeatherModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './side-bar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = true;

  navItems: NavItem[] = [
    { icon: 'grid', label: 'Tableau de Bord', route: '/', active: true },
    { icon: 'calendar', label: 'Emploi du Temps', route: '/schedule' },
    { icon: 'alert-triangle', label: 'Conflits', route: '/conflict' },
    { icon: 'refresh-cw', label: 'Rattrapages', route: '/rattrapage' },
    { icon: 'users', label: 'Professeurs', route: '/profs' },
    { icon: 'book', label: 'Cours', route: '/global' },
    { icon: 'map-pin', label: 'Salles', route: '/rooms' },
    { icon: 'message-circle', label: 'Messages', route: '/messages' }, // Added messaging

  ];
  currentUser='Douaa';

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}
