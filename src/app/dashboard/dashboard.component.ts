import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  upcomingClasses = [
    { name: 'Mathematics 101', time: '10:00 AM', room: 'A101' },
    { name: 'Physics 202', time: '2:00 PM', room: 'B205' },
    { name: 'Computer Science 301', time: '4:00 PM', room: 'C310' }
  ];

  recentAnnouncements = [
    { title: 'Exam Schedule Posted', date: '2023-05-15' },
    { title: 'Library Hours Extended', date: '2023-05-10' },
    { title: 'New Course Offerings', date: '2023-05-05' }
  ];

  constructor() { }

  ngOnInit(): void { }
}
