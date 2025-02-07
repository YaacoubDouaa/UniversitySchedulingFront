import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictListComponent } from './conflict-list.component';

describe('ConflictListComponent', () => {
  let component: ConflictListComponent;
  let fixture: ComponentFixture<ConflictListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConflictListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
