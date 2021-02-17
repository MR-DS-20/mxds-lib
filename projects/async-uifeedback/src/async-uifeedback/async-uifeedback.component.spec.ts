import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncUIFeedbackComponent } from './async-uifeedback.component';

describe('AsyncUIFeedbackComponent', () => {
  let component: AsyncUIFeedbackComponent;
  let fixture: ComponentFixture<AsyncUIFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncUIFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncUIFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
