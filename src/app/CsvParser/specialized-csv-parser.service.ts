import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import {Observable} from 'rxjs';
import {SeanceDTO} from '../models/Seance';
// import { SaveRequest } from './models/save-request.interface';

/**
 * Service responsible for parsing university schedule CSV data into SeanceDTO objects
 * This specialized parser handles the complex timetable format with days, time slots, and course information
 */
@Injectable({
  providedIn: 'root'
})
export class SpecializedCsvParserService {

  constructor(private papa: Papa) { }

  /**
   * Main function to convert CSV string data into an array of SeanceDTO objects
   * @param csvData The raw CSV data as a string
   * @returns Array of SeanceDTO objects representing the schedule
   */
  parseScheduleCsvToSeanceDTO(csvData: string): any[] {
    // Use Papa Parse to convert CSV string to a 2D array
    const parseResult = this.papa.parse(csvData, {
      skipEmptyLines: true // Skip empty rows in the CSV
    });

    // Validate that we have enough data to work with
    if (!parseResult.data || parseResult.data.length < 2) {
      throw new Error('Invalid CSV data format');
    }

    // Extract the data from the parse result
    const rawData = parseResult.data;

    // Process the 2D array to extract Seances
    return this.extractSeancesFromRawData(rawData);
  }

  /**
   * Processes the 2D array of CSV data to extract Seance objects
   * @param rawData 2D array of CSV data
   * @returns Array of SeanceDTO objects
   */
  private extractSeancesFromRawData(rawData: any[][]): any[] {
    const seances :SeanceDTO[]=[];

    // The first row contains day headers (Lundi, Mardi, etc.)
    const dayHeadersRow = rawData[0];

    // The second row contains time slots (08:30 - 10:00, etc.)
    const timeSlotRow = rawData[1];

    // Identify which columns correspond to which days of the week
    const dayColumns = this.findDayColumns(dayHeadersRow);

    // Process each row starting from the third row (index 2)
    // Each row represents a room or location
    for (let rowIndex = 2; rowIndex < rawData.length; rowIndex++) {
      const row = rawData[rowIndex];

      // Skip empty rows
      if (this.isRowEmpty(row)) continue;

      // The first cell of each row contains the room/location name
      const roomName = row[0];
      if (!roomName) continue; // Skip if no room name

      // Process each day column
      dayColumns.forEach(dayCol => {
        const day = dayHeadersRow[dayCol];
        if (!day) return; // Skip if day is empty

        // Process each time slot for this day (there are 6 time slots per day)
        for (let timeCol = dayCol + 1; timeCol < dayCol + 7; timeCol++) {
          if (timeCol >= row.length) continue; // Skip if out of bounds

          const cellContent = row[timeCol];
          if (!cellContent) continue; // Skip empty cells

          // Get the time slot string (e.g., "08:30 - 10:00")
          const timeSlot = timeSlotRow[timeCol];
          if (!timeSlot) continue; // Skip if no time slot

          // Parse this cell to create a Seance object
          const seanceData = this.parseSeanceData(cellContent, day, timeSlot, roomName, rowIndex, rawData);
          if (seanceData) {
            seances.push(seanceData);
          }
        }
      });
    }

    return seances;
  }

  /**
   * Identifies the columns in the header row that contain day names
   * @param headerRow The first row of the CSV containing day names
   * @returns Array of column indices for days
   */
  private findDayColumns(headerRow: any[]): number[] {
    const dayColumns = [];
    // List of days to look for in the header row
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // Find all columns that contain a day name
    for (let i = 0; i < headerRow.length; i++) {
      if (days.includes(headerRow[i])) {
        dayColumns.push(i);
      }
    }

    return dayColumns;
  }

  /**
   * Checks if a row is empty (contains only null, undefined, or empty strings)
   * @param row The row to check
   * @returns True if the row is empty, false otherwise
   */
  private isRowEmpty(row: any[]): boolean {
    return row.every(cell => !cell || cell.trim() === '');
  }

  /**
   * Parses a single cell from the timetable to extract information for a Seance
   * @param cellContent The content of the cell
   * @param day The day of the week for this cell
   * @param timeSlot The time slot for this cell
   * @param roomName The room name for this cell
   * @param rowIndex The current row index (used to find teacher and course info)
   * @param rawData The complete raw data array
   * @returns A SeanceDTO object or null if the cell cannot be parsed
   */
  private parseSeanceData(cellContent: string, day: string, timeSlot: string, roomName: string, rowIndex: number, rawData: any[][]): any {
    // Skip empty cells
    if (!cellContent || cellContent.trim() === '') {
      return null;
    }

    // Parse the time slot into start and end times
    const [startTime, endTime] = this.parseTimeSlot(timeSlot);

    // Parse class info (might contain groups, custom times)
    const { classes, customTime } = this.parseClassInfo(cellContent);
    if (classes.length === 0) return null; // Skip if no classes found

    // Find the teacher info (usually in the next row with the same column)
    const teacherInfo = rowIndex + 1 < rawData.length ? rawData[rowIndex + 1][rawData[rowIndex].indexOf(cellContent)] : '';

    // Find the course info (usually two rows down with the same column)
    const courseInfo = rowIndex + 2 < rawData.length ? rawData[rowIndex + 2][rawData[rowIndex].indexOf(cellContent)] : '';

    // Create a SeanceDTO object with the extracted information
    const baseSeanceData = {
      id: null, // Will be generated by backend
      jour: day, // Day of the week
      heureDebut: customTime ? customTime.start : startTime, // Start time
      heureFin: customTime ? customTime.end : endTime, // End time
      type: this.extractSessionType(courseInfo), // Type of session (CR, CI, TD, TP)
      matiere: this.extractCourseName(courseInfo), // Course name
      frequence: this.extractFrequency(courseInfo), // Frequency (weekly, biweekly)

      // Room information
      salle: {
        name: roomName,
        building: this.extractBuilding(roomName),
        capacity: null // Unknown from the CSV data
      },

      // Teacher information
      enseignant: {
        name: teacherInfo || 'Non spécifié',
        email: null, // Unknown from the CSV data
        department: null // Unknown from the CSV data
      },

      // Class/Branch information
      branches: classes.map(className => ({
        name: className,
        level: this.extractLevel(className),
        department: this.extractDepartment(className)
      })),

      // These will be populated later if needed
      tds: [],
      tps: []
    };

    return baseSeanceData;
  }

  /**
   * Parses a time slot string (e.g., "08:30 - 10:00") into start and end times
   * @param timeSlot The time slot string
   * @returns Tuple of [startTime, endTime]
   */
  private parseTimeSlot(timeSlot: string): [string, string] {
    if (!timeSlot) return ['', ''];

    // Split by hyphen and trim whitespace
    const parts = timeSlot.split('-').map(part => part.trim());
    if (parts.length !== 2) return ['', '']; // Invalid format

    return [parts[0], parts[1]];
  }

  /**
   * Parses class information from a cell, handling custom times
   * @param cellContent The content of the cell
   * @returns Object with classes array and optional custom time
   */
  private parseClassInfo(cellContent: string): { classes: string[], customTime: { start: string, end: string } | null } {
    // Check if there's custom time information (format: CLASS |HH:MM - HH:MM)
    // This is used when a session has a different time than the column header
    const timeMatch = cellContent.match(/([^|]+)\|(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);

    if (timeMatch) {
      const className = timeMatch[1].trim();
      return {
        classes: [className],
        customTime: {
          start: timeMatch[2],
          end: timeMatch[3]
        }
      };
    }

    // No custom time, just extract classes (might be multiple, separated by commas)
    return {
      classes: cellContent.split(',').map(cls => cls.trim()).filter(cls => cls),
      customTime: null
    };
  }

  /**
   * Extracts the session type (CR, CI, TD, TP) from the course information
   * @param courseInfo The course information string
   * @returns The session type or "CR" as default
   */
  private extractSessionType(courseInfo: string): string {
    if (!courseInfo) return 'CR'; // Default to CR (Cours)

    // Extract type from course info (CR, CI, TD, TP)
    const typeMatch = courseInfo.match(/^(CR|CI|TD|TP)-/);
    return typeMatch ? typeMatch[1] : 'CR'; // Return the type or default to CR
  }

  /**
   * Extracts the course name from the course information
   * @param courseInfo The course information string
   * @returns The cleaned course name
   */
  private extractCourseName(courseInfo: string): string {
    if (!courseInfo) return 'Non spécifié';

    // Remove prefix like "CR-" or "TD-" and any frequency info like "1/15-"
    return courseInfo
      .replace(/^(CR|CI|TD|TP)-/, '') // Remove session type prefix
      .replace(/^\d{1,2}H\d{2}-/, '') // Remove duration prefix (e.g., "2H00-")
      .replace(/\d+\/\d+-/, '') // Remove frequency prefix (e.g., "1/15-")
      .trim();
  }

  /**
   * Extracts the frequency information from the course info
   * @param courseInfo The course information string
   * @returns Frequency string (e.g., "1/15") or empty string for weekly
   */
  private extractFrequency(courseInfo: string): string {
    if (!courseInfo) return '';

    // Check for biweekly pattern like "1/15"
    const frequencyMatch = courseInfo.match(/(\d+\/\d+)-/);
    return frequencyMatch ? frequencyMatch[1] : ''; // Empty string means weekly
  }

  /**
   * Extracts the building code from a room name
   * @param roomName The room name (e.g., "A-KANOUN")
   * @returns The building code
   */
  private extractBuilding(roomName: string): string {
    if (!roomName) return '';

    // Extract building code (usually first part before hyphen)
    const buildingMatch = roomName.match(/^([A-Za-z]+)-/);
    return buildingMatch ? buildingMatch[1] : '';
  }

  /**
   * Extracts the level from a class name
   * @param className The class name (e.g., "L2_INFO")
   * @returns The level (e.g., "L2")
   */
  private extractLevel(className: string): string {
    if (!className) return '';

    // Extract level (L1, L2, L3, M1, M2, CPI_1, CPI_2, etc.)
    const levelMatch = className.match(/(L\d|M\d|CPI_\d)/);
    return levelMatch ? levelMatch[1] : '';
  }

  /**
   * Extracts the department from a class name
   * @param className The class name (e.g., "L2_INFO")
   * @returns The department (e.g., "INFO")
   */
  private extractDepartment(className: string): string {
    if (!className) return '';

    // Extract department (INFO, MATH, TIC, etc.)
    const deptMatch = className.match(/(INFO|MATH|TIC|EEA|SE|MIM|EL|GL)/);
    return deptMatch ? deptMatch[1] : '';
  }

  // saveSeances(request: SaveRequest): Observable<{ success: boolean; message: string }> {
  //   return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/seances`, request);
  // }
}
