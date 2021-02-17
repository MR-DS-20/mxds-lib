import { NgModule } from '@angular/core';
import { AsyncUIFeedbackComponent } from './async-uifeedback.component';
import { AsyncUIFeedbackService } from './async-uifeedback.service';



@NgModule({
  declarations: [AsyncUIFeedbackComponent],
  imports: [
  ],
  exports: [AsyncUIFeedbackComponent],
  providers: [AsyncUIFeedbackService]
})
export class AsyncUIFeedbackModule { }
