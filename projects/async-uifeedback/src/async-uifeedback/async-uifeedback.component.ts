import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncUIEvent } from './AsyncUIEvent';
import { AsyncUIState } from './AsyncUIState';
import { AsyncUIFeedbackService } from './async-uifeedback.service';
@Component({
  selector: 'lib-async-uifeedback',
  template: `
    <h2>Async UI Example </h2>
    <div>
        <h3>Static Messages</h3>
        <div>
            <h4>Success:</h4>
            <!-- <p>{{asyncEvent.successMessage}}</p> -->
        </div>
        <div class="">
            <h4>Failure:</h4>
            <!-- <p>{{asyncEvent.errorMessage}}</p> -->
        </div>
    </div>
    <div>
        <h3>Current State of Event</h3>
        <ul>
            <li>stateLabel {{asyncEvent.stateLabel}}</li>
            <li>isLoading {{asyncEvent.isLoading}}</li>
            <li>isError {{asyncEvent.isError}}</li>
            <li>isComplete {{asyncEvent.isComplete}}</li>
        </ul>
    </div>
    <div>
        <h3>Event Subscriptions</h3>
        <ul>
            <li>successMessage {{currentStateSubscriptionOutput?.successMessage}}</li>
            <li>errorMessage {{currentStateSubscriptionOutput?.errMessage}}</li>
            <li>isLoading {{currentStateSubscriptionOutput?.loading}}</li>
            <li>isError {{currentStateSubscriptionOutput?.error}}</li>
            <li>isComplete {{currentStateSubscriptionOutput?.complete}}</li>
        </ul>
    </div>
    <div>
        <button (click)="startSuccess()">Start Success</button>
        <button (click)="startFailure()">Start Failure</button>
        <button (click)="reset()">Reset Event</button>
    </div>
  `,
  styles: []
})
export class AsyncUIFeedbackComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public asyncEvent: AsyncUIEvent;

  public currentStateSubscriptionOutput?: AsyncUIState;

  public eventFromServiceSubscription?: AsyncUIEvent;

  constructor(
    private asyncUIService: AsyncUIFeedbackService
  ) {

    this.asyncEvent = this.asyncUIService.newEvent(); // add false to parameter to turn off reactive features

    this.asyncEvent.state$?.pipe(takeUntil(this.destroyed$)).subscribe(state => {
      this.currentStateSubscriptionOutput = state;
    });

    this.asyncEvent.snackTime = 5000; // Change time snack bar stays open for this event only, default to 4000.

    // Typically use this feature in another component to listen to changes for this event
    this.asyncUIService.events$?.pipe(takeUntil(this.destroyed$)).subscribe(events => {
      this.eventFromServiceSubscription = events.find(e => e.id === this.asyncEvent.id);
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.asyncUIService.deleteEvent(this.asyncEvent.id);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  startSuccess(): void {
    this.asyncEvent.start();
    setTimeout(() => {
      this.asyncEvent.complete('Event completed Successfully');
    }, 1500);
  }

  startFailure(): void {
    this.asyncEvent.start();
    setTimeout(() => {
      this.asyncEvent.error('Failure, Event not completed');
    }, 1500);
  }

  reset(): void {
    this.asyncEvent.reset();
  }

}

