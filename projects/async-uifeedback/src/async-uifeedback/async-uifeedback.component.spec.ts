import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AsyncUIFeedbackComponent } from './async-uifeedback.component';

describe('AsyncUIFeedbackComponent', () => {
  let component: AsyncUIFeedbackComponent;
  let fixture: ComponentFixture<AsyncUIFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncUIFeedbackComponent ],
      imports: [MatSnackBarModule]
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
