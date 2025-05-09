import { Component, Input } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FeatherModule} from 'angular-feather';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

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
    NgClass,
  ],
  templateUrl: './side-bar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = true;

  @Input() navItems: NavItem[] = [
    { icon: 'grid', label: 'Tableau de Bord', route: '/', active: true },
    { icon: 'calendar', label: 'Emploi des groupes', route: '/schedule' },
    { icon: 'book', label: 'Emploi Global', route: '/global' },
    { icon: 'alert-triangle', label: 'Conflits', route: '/conflict' },
    { icon: 'refresh-cw', label: 'Rattrapages', route: '/rattrapage' },
    { icon: 'users', label: 'Disponiblité des Professeurs', route: '/profs' },
    { icon: 'map-pin', label: 'Disponiblité des Salles', route: '/rooms' },
    { icon: 'message-circle', label: 'Messages', route: '/messages' }, // Added messaging
    { icon: 'file-plus', label: 'Import csv', route: '/import' },
  ];
  @Input() currentUser='Douaa';

  constructor(private router:Router) {
  }

  @Input() toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  @Input()  logout(): void {
    this.router.navigate(['/login']);
  }
}
