import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PropositionsDeRattrapageService} from '../propositions-de-rattrapage.service';
import {NotificationService} from '../notifications.service';

@Component({
  selector: 'app-propose-rattrapage',
  templateUrl: './propose-rattrapage.component.html',
  standalone:false
})
export class ProposeRattrapageComponent implements OnInit {
  rattrapageForm: FormGroup=new FormGroup({});
  isSubmitting = false;
  showSuccess = false;

  readonly courseTypes = ['COURS', 'TD', 'TP'];
  readonly niveaux = ['ING_1', 'ING_2', 'ING_3'];
  readonly reasons = [
    'Maladie',
    'Voyage académique',
    'Événement administratif',
    'Formation professionnelle',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private propositionsService: PropositionsDeRattrapageService,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    // Get current date in YYYY-MM-DD format for the date input
    const today = new Date().toISOString().split('T')[0];

    this.rattrapageForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: [today, [Validators.required, this.futureDateValidator()]],
      type: ['COURS', Validators.required],
      niveau: ['', Validators.required],
      reason: ['', Validators.required],
      otherReason: [''],
      details: ['', Validators.maxLength(500)]
    });

    // Handle other reason field visibility and validation
    this.rattrapageForm.get('reason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.rattrapageForm.get('otherReason');
      if (value === 'Autre') {
        otherReasonControl?.setValidators([Validators.required]);
      } else {
        otherReasonControl?.clearValidators();
        otherReasonControl?.setValue('');
      }
      otherReasonControl?.updateValueAndValidity();
    });
  }

  private futureDateValidator() {
    return (control: any) => {
      if (!control.value) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);

      return inputDate >= today ? null : { pastDate: true };
    };
  }
  onSubmit(): void {
    if (this.rattrapageForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.rattrapageForm.value;

    const newProposition = {
      id: Math.floor(Math.random() * 10000),
      date: formValue.date,
      reason: formValue.reason === 'Autre' ? formValue.otherReason : formValue.reason,
      status: 'En attente',
      enseignantId: 101, // This should come from your auth service
      type: formValue.type,
      name: formValue.name,
      niveau: formValue.niveau
    };

    try {
      this.propositionsService.propositions.push(newProposition);
      this.notificationService.addNotification(
        `Nouvelle proposition de rattrapage créée pour ${formValue.name}`,
        'success',
        101,
        0
      );
      this.showSuccess = true;
      this.rattrapageForm.reset({
        type: 'COURS'
      });
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    } catch (error) {
      this.notificationService.addNotification(
        'Erreur lors de la création de la proposition',
        'error',
        101,
        0
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  // Helper method for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.rattrapageForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.rattrapageForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (controlName) {
      case 'name':
        if (control.errors['required']) {
          return 'Le nom du cours est requis';
        }
        if (control.errors['minlength']) {
          return 'Le nom doit contenir au moins 3 caractères';
        }
        break;

      case 'date':
        if (control.errors['required']) {
          return 'La date est requise';
        }
        if (control.errors['pastDate']) {
          return 'La date doit être future';
        }
        break;

      case 'niveau':
        if (control.errors['required']) {
          return 'Le niveau est requis';
        }
        break;

      case 'reason':
        if (control.errors['required']) {
          return 'La raison est requise';
        }
        break;

      case 'otherReason':
        if (control.errors['required']) {
          return 'Veuillez préciser la raison';
        }
        break;

      case 'details':
        if (control.errors['maxlength']) {
          return 'Les détails ne doivent pas dépasser 500 caractères';
        }
        break;
    }

    return '';
  }


}
