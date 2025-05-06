import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../Services/RoomsService/rooms.service';
import { SalleList } from '../../models/Salle';

@Component({
  selector: 'app-technicien-dash-board',
  templateUrl: './technicien-dash-board.component.html',
  standalone:false,
  styleUrls: ['./technicien-dash-board.component.css']
})
export class TechnicienDashBoardComponent implements OnInit {
  // Room data
  sallesList: any[] = [];
  filteredRooms: any[] = [];

  // Filter states
  searchQuery: string = '';
  filterType: string = '';
  filterAvailability: string = '';

  // Carousel states
  currentSlide: number = 0;
  isAnimating: boolean = false;
  touchStartX: number = 0;
  touchEndX: number = 0;

  // View mode
  viewMode: 'carousel' | 'grid' | 'list' = 'carousel';

  // Time slots
  timeSlots: string[] = ['8:30-10:00', '10:15-11:45', '13:00-14:30', '14:45-16:15', '16:30-18:00'];

  // Days of the week
  days: string[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRoomData();
  }

  // Data loading and filtering
  loadRoomData(): void {
    this.roomService.getSalles().subscribe({
      next: (sallesList: SalleList) => {
        this.sallesList = Object.entries(sallesList).map(([name, details]) => ({

          ...details
        }));
        this.filteredRooms = [...this.sallesList];
        console.log('Rooms loaded:', this.sallesList);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        // Load mock data for preview
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    // Mock data for preview purposes
    this.sallesList = [
      {
        name: 'A-101',
        type: 'COURS',
        capacite: 80,
        schedule: this.generateMockSchedule(3)
      },
      {
        name: 'B-205',
        type: 'TD',
        capacite: 40,
        schedule: this.generateMockSchedule(4)
      },
      {
        name: 'LAB-1',
        type: 'TP',
        capacite: 25,
        schedule: this.generateMockSchedule(5)
      },
      {
        name: 'C-301',
        type: 'SEMINAIRE',
        capacite: 120,
        schedule: this.generateMockSchedule(2)
      }
    ];
    this.filteredRooms = [...this.sallesList];
  }

  generateMockSchedule(occupiedSlots: number): any {
    const schedule: any = {};
    const dayIndex = new Date().getDay();
    const today = this.days[dayIndex > 0 && dayIndex <= 6 ? dayIndex - 1 : 0];

    schedule[today] = {};

    // Generate random groups for occupied time slots
    const groups = ['ING1_INFO', 'ING2_INFO', 'ING3_INFO'];
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    schedule[today][randomGroup] = {};

    // Assign random time slots
    const timeSlotsCopy = [...this.timeSlots];
    for (let i = 0; i < occupiedSlots && timeSlotsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * timeSlotsCopy.length);
      const timeSlot = timeSlotsCopy.splice(randomIndex, 1)[0];

      schedule[today][randomGroup][timeSlot] = [{
        id: 100 + i,
        name: `Course ${i + 1}`,
        groupe: randomGroup,
        room: this.generateRoomName(),
        type: this.getRandomType(),
        professor: this.generateProfessorName(),
        biWeekly: Math.random() > 0.7
      }];
    }

    return schedule;
  }

  generateRoomName(): string {
    const buildings = ['A', 'B', 'C', 'LAB'];
    const buildingNum = Math.floor(Math.random() * 4);
    const roomNum = Math.floor(Math.random() * 500);
    return `${buildings[buildingNum]}-${roomNum}`;
  }

  generateProfessorName(): string {
    const firstNames = ['Ahmed', 'Fatima', 'Mohamed', 'Sophia', 'Youssef', 'Leila'];
    const lastNames = ['Taleb', 'Mansour', 'Khalil', 'Berrada', 'El Fassi', 'Bernoussi'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  getRandomType(): string {
    const types = ['COURS', 'TD', 'TP', 'SEMINAIRE'];
    return types[Math.floor(Math.random() * types.length)];
  }

  filterRooms(): void {
    this.filteredRooms = this.sallesList.filter(room => {
      // Apply search query filter
      if (this.searchQuery && !room.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }

      // Apply room type filter
      if (this.filterType && room.type !== this.filterType) {
        return false;
      }

      // Apply availability filter
      if (this.filterAvailability) {
        const isAvailable = !this.isRoomOccupied(room, this.getCurrentDay(), this.getCurrentTimeSlot());
        if (this.filterAvailability === 'available' && !isAvailable) {
          return false;
        }
        if (this.filterAvailability === 'occupied' && isAvailable) {
          return false;
        }
      }

      return true;
    });

    // Reset current slide if needed
    this.currentSlide = Math.min(this.currentSlide, Math.max(0, this.filteredRooms.length - 1));
  }

  // View mode functions
  setViewMode(mode: 'carousel' | 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  // Carousel control functions
  previousSlide(): void {
    if (this.currentSlide > 0 && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSlide--;
      setTimeout(() => this.isAnimating = false, 500);
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.filteredRooms.length - 1 && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSlide++;
      setTimeout(() => this.isAnimating = false, 500);
    }
  }

  goToSlide(index: number): void {
    if (!this.isAnimating && index !== this.currentSlide) {
      this.isAnimating = true;
      this.currentSlide = index;
      setTimeout(() => this.isAnimating = false, 500);
    }
  }

  getSlideTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  getIndicators(): number[] {
    return Array(this.filteredRooms.length).fill(0).map((_, i) => i);
  }

  // Touch event handlers for mobile swipe
  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchEnd(): void {
    if (!this.isAnimating) {
      const swipeThreshold = 50; // Minimum distance for swipe to register
      const swipeDistance = this.touchStartX - this.touchEndX;

      if (swipeDistance > swipeThreshold && this.currentSlide < this.filteredRooms.length - 1) {
        this.nextSlide();
      } else if (swipeDistance < -swipeThreshold && this.currentSlide > 0) {
        this.previousSlide();
      }
    }
  }

  // Room status and schedule functions
  getCurrentDay(): string {
    const dayIndex = new Date().getDay();
    return this.days[dayIndex > 0 && dayIndex <= 6 ? dayIndex - 1 : 0];
  }

  getCurrentTimeSlot(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // Time slot boundaries (approximated)
    const timeSlotBoundaries = [
      { slot: '8:30-10:00', start: 8.5, end: 10 },
      { slot: '10:15-11:45', start: 10.25, end: 11.75 },
      { slot: '13:00-14:30', start: 13, end: 14.5 },
      { slot: '14:45-16:15', start: 14.75, end: 16.25 },
      { slot: '16:30-18:00', start: 16.5, end: 18 }
    ];

    for (const boundary of timeSlotBoundaries) {
      if (currentTime >= boundary.start && currentTime <= boundary.end) {
        return boundary.slot;
      }
    }

    // Default to first slot if outside any time slot
    return this.timeSlots[0];
  }

  isTimeSlotCurrentlyActive(timeSlot: string): boolean {
    return timeSlot === this.getCurrentTimeSlot();
  }

  isRoomOccupied(room: any, day: string, timeSlot: string): boolean {
    if (!room || !room.schedule || !room.schedule[day]) {
      return false;
    }

    // Check all groups for this day
    for (const groupe of Object.keys(room.schedule[day])) {
      if (room.schedule[day][groupe][timeSlot]?.length > 0) {
        return true;
      }
    }

    return false;
  }

  isTimeSlotOccupied(room: any, day: string, timeSlot: string): boolean {
    return this.isRoomOccupied(room, day, timeSlot);
  }

  getOccupiedTimeSlots(room: any, day: string): string[] {
    const occupiedSlots: string[] = [];

    if (!room || !room.schedule || !room.schedule[day]) {
      return occupiedSlots;
    }

    // Check all groups for this day
    for (const groupe of Object.keys(room.schedule[day])) {
      for (const timeSlot of this.timeSlots) {
        if (room.schedule[day][groupe][timeSlot]?.length > 0 &&
          !occupiedSlots.includes(timeSlot)) {
          occupiedSlots.push(timeSlot);
        }
      }
    }

    return occupiedSlots;
  }

  getRoomScheduleStatus(room: any, day: string, timeSlot: string): string {
    if (!room || !room.schedule || !room.schedule[day]) {
      return 'Available';
    }

    // Check all groups for this day
    for (const groupe of Object.keys(room.schedule[day])) {
      const sessions = room.schedule[day][groupe][timeSlot];
      if (sessions && sessions.length > 0) {
        const session = sessions[0]; // Take the first session
        return `${session.name} (${session.groupe})`;
      }
    }

    return 'Available';
  }

  getOccupancyColor(room: any, day: string, timeSlot: string): string {
    if (this.isRoomOccupied(room, day, timeSlot)) {
      return 'border-l-4 border-red-500';
    } else if (timeSlot === this.getCurrentTimeSlot()) {
      return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10';
    }
    return '';
  }

  getRoomIcon(type: string): string {
    switch (type) {
      case 'COURS':
        return 'monitor';
      case 'TD':
        return 'users';
      case 'TP':
        return 'cpu';
      case 'SEMINAIRE':
        return 'mic';
      default:
        return 'home';
    }
  }

  getRoomTypeName(type: string): string {
    switch (type) {
      case 'COURS':
        return 'Lecture Hall';
      case 'TD':
        return 'Tutorial Room';
      case 'TP':
        return 'Laboratory';
      case 'SEMINAIRE':
        return 'Seminar Room';
      default:
        return type;
    }
  }

  getNextSessionInfo(room: any): string {
    const day = this.getCurrentDay();
    const currentTimeSlot = this.getCurrentTimeSlot();
    const currentTimeSlotIndex = this.timeSlots.indexOf(currentTimeSlot);

    if (this.isRoomOccupied(room, day, currentTimeSlot)) {
      return `Current: ${this.getRoomScheduleStatus(room, day, currentTimeSlot)}`;
    }

    // Look for the next session today
    for (let i = currentTimeSlotIndex + 1; i < this.timeSlots.length; i++) {
      const nextSlot = this.timeSlots[i];
      if (this.isRoomOccupied(room, day, nextSlot)) {
        return `Next: ${this.getRoomScheduleStatus(room, day, nextSlot)} (${nextSlot})`;
      }
    }

    return 'No upcoming sessions today';
  }

  // Stats functions
  getAvailableRoomsCount(): number {
    return this.sallesList.filter(room =>
      !this.isRoomOccupied(room, this.getCurrentDay(), this.getCurrentTimeSlot())
    ).length;
  }

  getAvailabilityPercentage(): number {
    if (this.sallesList.length === 0) return 0;
    return Math.round((this.getAvailableRoomsCount() / this.sallesList.length) * 100);
  }

  getOccupancyRate(): number {
    if (this.sallesList.length === 0) return 0;
    return 100 - this.getAvailabilityPercentage();
  }

  getRoomUsageRate(room: any): number {
    let occupiedSlots = 0;
    let totalSlots = this.timeSlots.length;

    if (room && room.schedule) {
      for (const day of this.days) {
        if (room.schedule[day]) {
          const occupied = this.getOccupiedTimeSlots(room, day).length;
          occupiedSlots += occupied;
        }
      }
    }

    const totalPossibleSlots = totalSlots * this.days.length;
    return Math.round((occupiedSlots / totalPossibleSlots) * 100);
  }

  getMaintenanceCount(): number {
    // Mock data for demo purposes
    return Math.floor(Math.random() * 5) + 1;
  }

  getPendingMaintenance(): number {
    // Mock data for demo purposes
    return Math.floor(Math.random() * 3) + 1;
  }
}
