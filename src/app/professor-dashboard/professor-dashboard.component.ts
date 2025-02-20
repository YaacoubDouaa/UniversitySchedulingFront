import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css'],
  standalone:false
})
export class ProfessorDashboardComponent implements OnInit {
  upcomingClasses = [
    { name: 'Mathematics 101', time: '10:00 AM', room: 'A-101' },
    { name: 'Physics 202', time: '2:00 PM', room: 'B-203' },
  ];

  pendingProposals = [
    { name: 'Chemistry 301', date: '2023-06-15', status: 'Pending' },
    { name: 'Biology 102', date: '2023-06-18', status: 'Pending' },
  ];

  constructor() { }
  showNotifications = false;
  notifications = [
    { title: "Class Rescheduled", message: "Your class at 10 AM has been moved to 11 AM." },
    { title: "New Assignment", message: "A new assignment has been posted for your course." },
    { title: "Meeting Reminder", message: "Faculty meeting at 3 PM in Room A-01." }
  ];

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  clearNotifications() {
    this.notifications = [];
  }
  ngOnInit(): void { }
}
