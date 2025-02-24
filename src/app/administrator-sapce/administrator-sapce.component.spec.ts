import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorSapceComponent } from './administrator-sapce.component';

describe('AdministratorSapceComponent', () => {
  let component: AdministratorSapceComponent;
  let fixture: ComponentFixture<AdministratorSapceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministratorSapceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorSapceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
