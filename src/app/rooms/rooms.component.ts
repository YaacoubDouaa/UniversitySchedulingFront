import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: false,

  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  cards = [
    {title: 'Card 1', description: 'This is the description for card 1.'},
    {title: 'Card 2', description: 'This is the description for card 2.'},
    {title: 'Card 3', description: 'This is the description for card 3.'},
    {title: 'Card 4', description: 'This is the description for card 4.'}
  ];

}

