import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Observable, Subscription} from 'rxjs';
import {PropositionsDeRattrapageService} from '../propositions-de-rattrapage.service';
import {NotificationService} from '../notifications.service';
import {formatDate} from 'date-fns';
import {PropositionDeRattrapage} from '../models/Notifications';
type TabType = 'new' | 'list';
@Component({
  selector: 'app-propose-rattrapage',
  templateUrl: './propose-rattrapage.component.html',
  standalone:false
})
export class ProposeRattrapageComponent implements OnInit, OnDestroy {



  activeTab: TabType = 'new';
  showConfirmDialog = false;
  propositions: any[] = [];
  propositionsById: any[] = [];
  private subscription = new Subscription();

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
    this.updateCurrentDateTime();
    setInterval(() => this.updateCurrentDateTime(), 1000);
    this.initForm();

    // Subscribe to propositions changes
    this.subscription.add(
      this.propositionsService.propositions$.subscribe(props => {
        this.propositions = props;
      })
    );

    // Subscribe to propositionsById changes
    this.subscription.add(
      this.propositionsService.propositionsById$.subscribe(props => {
        this.propositionsById = props;
      })
    );
  }




  // Add method to get proposition synchronously
  getPropositionByIdSync(id: string): PropositionDeRattrapage[] {
    return this.propositions.find(prop => prop.prof.codeEnseignet === id);
  }



  // Add these new properties
  selectedProposition?: PropositionDeRattrapage;
  showPropositionDetails = false;



  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  private updateCurrentDateTime(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  rattrapageForm: FormGroup=new FormGroup({});
  isSubmitting = false;
  showSuccess = false;
  currentDateTime: string=new Date().toISOString();
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  private initForm(): void {
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
      Object.keys(this.rattrapageForm.controls).forEach(key => {
        const control = this.rattrapageForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
    this.showConfirmDialog = true;
  }

  confirmSubmit(): void {
    this.showConfirmDialog = false;
    this.submitForm();
  }

  cancelSubmit(): void {
    this.showConfirmDialog = false;
  }

  private submitForm(): void {
    if (this.rattrapageForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.rattrapageForm.value;

    try {
      const newProposition = {
        id: Math.floor(Math.random() * 10000),
        date: formValue.date,
        reason: formValue.reason === 'Autre' ? formValue.otherReason : formValue.reason,
        status: 'En attente',
        enseignantId: 101,
        type: formValue.type,
        name: formValue.name,
        niveau: formValue.niveau,
        details: formValue.details
      };

      this.propositionsService.addProposition(newProposition);

      this.notificationService.addNotification(
        `Nouvelle proposition de rattrapage créée pour ${formValue.name}`,
        'success',
        101,
        0
      );

      this.showSuccess = true;
      this.rattrapageForm.reset({
        type: 'COURS',
        date: new Date().toISOString().split('T')[0]
      });

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);

      // Switch to list view after successful submission
      this.activeTab = 'list';
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

  hasError(controlName: string, errorName: string): boolean {
    const control = this.rattrapageForm.get(controlName);
    return (control?.touched && control?.hasError(errorName)) || false;
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmé':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Refusé':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'En attente':
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Confirmé':
        return 'check-square';
      case 'Refusé':
        return 'x-square';
      case 'En attente':
      default:
        return 'clock';
    }
  }


  protected readonly formatDate = formatDate;
}
