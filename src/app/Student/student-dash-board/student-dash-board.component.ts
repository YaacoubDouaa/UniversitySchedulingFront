import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-student-dash-board',
  templateUrl: './student-dash-board.component.html',
  styleUrls: ['./student-dash-board.component.css'],
  standalone:false,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class StudentDashBoardComponent implements OnInit {
  currentDateTime = '2025-02-26 21:33:08';
  currentUser = 'YaacoubDouaa';

  // Carousel
  currentSlide = 0;
  notifications: any[] = [
    {
      type: 'schedule_update',
      title: 'Schedule Update',
      message: 'Your Tuesday schedule has been updated',
      time: '5 minutes ago'
    },
    {
      type: 'rattrapage',
      title: 'New Rattrapage Session',
      message: 'Mathematics session added for next week',
      time: '1 hour ago'
    }
  ];

  // Stats
  stats = {
    totalCourses: 6,
    upcomingExams: 3,
    attendance: '85%',
    rattrapages: 2
  };

  // Schedule Updates
  scheduleUpdates = [
    {
      date: '2025-02-27',
      changes: [
        { type: 'added', course: 'Mathematics', time: '10:15-11:45' },
        { type: 'cancelled', course: 'Physics Lab', time: '13:00-14:30' }
      ]
    }
  ];

  // Carousel Items
  carouselItems = [
    {
      title: 'Actualités',
      icon: 'bell',
      count: 5,
      color: 'blue'
    },
    {
      title: 'Rattrapages',
      icon: 'calendar',
      count: 2,
      color: 'purple'
    },
    {
      title: 'Examens',
      icon: 'book-open',
      count: 3,
      color: 'green'
    }
  ];

  showNotification = false;

  constructor() {
    this.startTimeUpdate();
  }

  ngOnInit() {
    this.startCarousel();
  }

  private startTimeUpdate() {
    setInterval(() => {
      const now = new Date();
      this.currentDateTime = this.formatDateTime(now);
    }, 1000);
  }

  private formatDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  private startCarousel() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
    }, 5000);
  }

  toggleNotification() {
    this.showNotification = !this.showNotification;
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      schedule_update: 'calendar',
      rattrapage: 'clock',
      exam: 'book-open',
      default: 'bell'
    };
    return icons[type] || icons['default'];
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      schedule_update: 'blue',
      rattrapage: 'purple',
      exam: 'green',
      default: 'gray'
    };
    return colors[type] || colors['default'];
  }
}
