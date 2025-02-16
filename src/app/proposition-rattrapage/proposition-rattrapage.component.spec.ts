import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropositionRattrapageComponent } from './proposition-rattrapage.component';

describe('PropositionRattrapageComponent', () => {
  let component: PropositionRattrapageComponent;
  let fixture: ComponentFixture<PropositionRattrapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropositionRattrapageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropositionRattrapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
