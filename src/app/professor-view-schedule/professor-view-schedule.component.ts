// import { Component, OnInit } from '@angular/core';
//
// import {Seance} from '../models/Seance';
// import {SalleSchedule} from '../models/Salle';
// import {ProfessorsService} from '../professors.service';
// import {Schedule} from '../models/Schedule';
// interface TimeSlot {
//   time: string;
//   sessions: {
//     [groupe: string]: Seance;
//   };
// }
//
// interface DaySchedule {
//   day: string;
//   timeSlots: TimeSlot[];
// }
//
//
// @Component({
//   selector: 'app-professor-view-schedule',
//   templateUrl: './professor-view-schedule.component.html',
//   styleUrls: ['./professor-view-schedule.component.css'],standalone:false
// })
// export class ProfessorViewScheduleComponent implements OnInit {
//
//   schedule: DaySchedule[] = [];
//   currentDay: string;
//   currentDateTime: string;
//   isLoading = true;
//   error: string | null = null;
//
//   readonly days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
//   readonly timeSlots = [
//     '8:30-10:00',
//     '10:15-11:45',
//     '13:00-14:30',
//     '14:45-16:15',
//     '16:30-18:00'
//   ];
//
//   constructor(public professorsService: ProfessorsService) {
//     this.currentDay = this.getCurrentDay();
//     this.currentDateTime = this.professorsService.getCurrentDateTime();
//   }
//
//   ngOnInit(): void {
//     this.loadSchedule();
//     this.startTimeUpdate();
//   }
//
//   private getCurrentDay(): string {
//     const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
//     return days[new Date().getDay()];
//   }
//
//   private startTimeUpdate(): void {
//     setInterval(() => {
//       this.currentDateTime = this.professorsService.getCurrentDateTime();
//     }, 1000);
//   }
//
//   private loadSchedule(): void {
//     this.isLoading = true;
//     this.error = null;
//
//     this.professorsService.getCurrentProfessorSchedule()
//       .subscribe({
//         next: (schedule) => {
//           if (schedule) {
//             this.schedule = this.formatSchedule(schedule);
//           }
//           this.isLoading = false;
//         },
//         error: (err) => {
//           console.error('Error loading schedule:', err);
//           this.error = 'Failed to load schedule. Please try again later.';
//           this.isLoading = false;
//         }
//       });
//   }
//
//   private formatSchedule(schedule: Schedule): DaySchedule[] {
//     return this.days.map(day => ({
//       day,
//       timeSlots: this.timeSlots
//         .filter(time => schedule[day]?.[time])
//         .map(time => ({
//           time,
//           sessions: schedule[day][time] || {}
//         }))
//         .sort((a, b) => this.compareTimeSlots(a.time, b.time))
//     }));
//   }
//
//   private compareTimeSlots(a: string, b: string): number {
//     const [aStart] = a.split('-');
//     const [bStart] = b.split('-');
//     const [aHour, aMinute] = aStart.split(':').map(Number);
//     const [bHour, bMinute] = bStart.split(':').map(Number);
//
//     if (aHour !== bHour) return aHour - bHour;
//     return aMinute - bMinute;
//   }
//
//   isCurrentTimeSlot(day: string, time: string): boolean {
//     if (day !== this.currentDay) return false;
//     const [start, end] = time.split('-');
//     const [startHour, startMinute] = start.split(':').map(Number);
//     const [endHour, endMinute] = end.split(':').map(Number);
//
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
//
//     const isAfterStart = currentHour > startHour ||
//       (currentHour === startHour && currentMinute >= startMinute);
//     const isBeforeEnd = currentHour < endHour ||
//       (currentHour === endHour && currentMinute <= endMinute);
//
//     return isAfterStart && isBeforeEnd;
//   }
//
//   getSessionTypeClass(type: string): string {
//     switch (type) {
//       case 'COURS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
//       case 'TD': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
//       case 'TP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
//     }
//   }
//   getSessionsForTimeSlot(day: string, timeSlot: string): Seance[] {
//     const daySchedule = this.schedule.find(d => d.day === day);
//     if (!daySchedule) return [];
//
//     const timeSlotData = daySchedule.timeSlots.find(t => t.time === timeSlot);
//     if (!timeSlotData) return [];
//
//     return Object.values(timeSlotData.sessions);
//   }
// }
