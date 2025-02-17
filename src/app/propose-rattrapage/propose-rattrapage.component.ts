import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NotificationService} from '../notifications.service';


@Component({
  selector: 'app-propose-rattrapage',
  templateUrl: './propose-rattrapage.component.html',
  styleUrls: ['./propose-rattrapage.component.css'],
  standalone:false
})
export class ProposeRattrapageComponent implements OnInit {
  proposeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.proposeForm = this.fb.group({
      courseName: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.proposeForm.valid) {
      // Here you would typically send the form data to a service
      console.log(this.proposeForm.value);
      this.notificationService.addNotification('Make-up session proposal submitted successfully', 'success');
      this.proposeForm.reset();
    }
  }
}
