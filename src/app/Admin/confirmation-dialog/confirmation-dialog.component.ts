
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      Êtes-vous sûr de vouloir {{ data.action === 'confirm' ? 'confirmer' : 'refuser' }}
      cette proposition de rattrapage ?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Annuler</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Confirmer</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string; proposition: any }
  ) {}
}
