import {ChangeDetectionStrategy, Component, signal} from '@angular/core';

@Component({
  selector: 'app-conflict-list',
  standalone: false,

  templateUrl: './conflict-list.component.html',
  styleUrl: './conflict-list.component.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictListComponent {
  readonly panelOpenState = signal(false);
}


