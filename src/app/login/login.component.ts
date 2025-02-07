import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, Observable, of, startWith} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  myControl = new FormControl('');
  options: string[] = ['Admin', 'User', 'Guest'];
  filteredOptions!: Observable<string[]>;
  stateGroupOptions: Observable<{ letter: string, names: string[] }[]> = of([
    { letter: 'A', names: ['Alice', 'Aaron'] },
    { letter: 'B', names: ['Bob', 'Bobby'] },
    { letter: 'C', names: ['Charlie', 'Chuck'] }
  ]);

constructor( private router: Router) {
}
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
  navigate() {
    this.router.navigate(['/schedule']);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
