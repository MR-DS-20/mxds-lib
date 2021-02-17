import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncUIEvent } from './AsyncUIEvent';

/*
 * Provides features to control elements that would reflect user interactions with async services,
 * such as display loading spinners and error/success messages.
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncUIFeedbackService {

  // Holds all events that have been created
  private events: Array<AsyncUIEvent> = [];

  private activeEvent$: Array<{ id: number, $?: Subscription }> = [];

  // Used for sharing all events between components
  private eventChange: BehaviorSubject<Array<AsyncUIEvent>> = new BehaviorSubject(this.events);

  // Observable of all existing Events in their current state
  public events$: Observable<Array<AsyncUIEvent>> = this.eventChange.asObservable();

  constructor(
    private snack: MatSnackBar
  ) { }

  /**
   * Crates a new event, adds it to the events array.
   * Subscribes to the new event so that when the event emits a state change the service emits the updated events array.
   * Subscription is added to activeEvent$ array, so it can be deleted when necessarry
   * @param isReactive determines wether the event will emit changes
   * @returns the new event object
   */
  newEvent(isReactive = true): AsyncUIEvent {

    const event = new AsyncUIEvent(isReactive, this.snack);
    this.events.push(event);

    if (isReactive) {
      this.activeEvent$.push({
        id: event.id,
        $: event?.state$?.subscribe(e => {
          this.emitEventChange();
        })
      });
    }

    return event;
  }

  getEvent(id: number): AsyncUIEvent | undefined {

    return this.events?.find(e => e.id === id);
  }

  /**
   * Unsubscribes from event subscription if exists, removes event from event array
   * and returns removed event
   * @param id id of event to be deleted
   * @returns removed event
   */
  deleteEvent(id: number): AsyncUIEvent | undefined {

    this.activeEvent$.forEach(e => {
      if (e.id === id) {
        e?.$?.unsubscribe();
      }
    });
    return this.events?.splice(
      this.events?.findIndex(e => e.id === id),
      1
    )[0];
  }

  private emitEventChange(): void {

    this.eventChange.next(this.events);
  }

}


