import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {FeatherModule} from "angular-feather";
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-nav-bar',

  templateUrl: './nav-bar.component.html',
    imports: [
        // NgClass,
        NgIf,
        NgForOf,
        FeatherModule,

    ],

  styleUrl: './nav-bar.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]

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
  currentDateTime: string='';

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.isProfileMenuOpen = false;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isNotificationOpen = false;
  }
  getNotificationIcon(type: string): string {
    return type === 'warning' ? 'alert-triangle' : 'info';
  }

  getNotificationIconClass(type: string): string {
    const baseClasses = 'p-2 rounded-full flex items-center justify-center';
    return type === 'warning'
      ? `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400`
      : `${baseClasses} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`;
  }

}

//
// import {Component, EventEmitter, Output} from '@angular/core';
// import {NgClass, NgForOf, NgIf} from '@angular/common';
// import {MatIcon} from '@angular/material/icon';
// import {Router} from '@angular/router';
//
//
// @Component({
//   selector: 'app-nav-bar',
//
//   templateUrl: './nav-bar.component.html',
//   imports: [
//     NgClass,
//     NgIf,
//     NgForOf,
//
//   ],
//
//   styleUrl: './nav-bar.component.css'
//
// })
// export class NavbarComponent {
//   @Output() toggleSidebar = new EventEmitter<void>();
//
//   isProfileMenuOpen = false;
//   isNotificationOpen = false;
//
//   notifications = [
//     { id: 1, message: 'Nouveau conflit détecté', type: 'warning', time: '5m' },
//     { id: 2, message: 'Session de rattrapage ajoutée', type: 'info', time: '10m' },
//     { id: 3, message: 'Mise à jour de l\'emploi du temps', type: 'info', time: '1h' }
//   ];
//
//   userProfile = {
//     name: 'John Doe',
//     email: 'john@example.com',
//     avatar: 'assets/avatar.jpg'
//   };
//
//   toggleProfileMenu(): void {
//     this.isProfileMenuOpen = !this.isProfileMenuOpen;
//     this.isNotificationOpen = false;
//   }
//
//   toggleNotifications(): void {
//     this.isNotificationOpen = !this.isNotificationOpen;
//     this.isProfileMenuOpen = false;
//   }
//
//
// }
