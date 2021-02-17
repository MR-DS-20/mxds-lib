import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AsyncUIFeedbackService } from './async-uifeedback.service';
import { AsyncUIEvent } from './AsyncUIEvent';
import { SpyHelper } from '@bit/mxds.angular-components.spy-helper';

describe('AsyncUIFeedbackService', () => {
  const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
  let service: AsyncUIFeedbackService;
  const spyHelp = new SpyHelper();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackSpy }
      ]
    });
    service = TestBed.inject(AsyncUIFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('succesfull event cycle', () => {

    it('creates and returns an event', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      expect(event.id).toBeDefined();
    });

    it('returns the correct event', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      expect(service.getEvent(event.id)?.id)
        .toEqual(event.id);
    });

    it('returns udefined as event does not exist', () => {
      expect(service.getEvent(83495)).toBeUndefined();
    });

    it('Updates an event to complete state, and calls snack bar', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      event.complete('Complete Message');
      expect(service.getEvent(event.id)?.isComplete).toBeTrue();
      spyHelp.expect.called(snackSpy.open);
    });

    it('deletes the correct event', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      expect(service.deleteEvent(event.id)?.id)
        .toEqual(event.id);
      expect(service.getEvent(event.id)).toBeUndefined();
    });

    it('tries to delete a non-existant event, returns undefined', () => {
      expect(service.deleteEvent(43545)).toBeUndefined();
    });

  });
  describe('Error event cycle', () => {

    it('creates a new event, updates it to error state, calling snack bar', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      event.error('Error message');
      spyHelp.expect.called(snackSpy.open);
      expect(service.getEvent(event.id)?.isError).toBeTrue();
    });

  });

  describe('Provides and manages observables of all current events', () => {

    it('when a new event is created', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      service.events$.subscribe(events => {
        expect(events.find(e => e.id === event.id)?.id).toEqual(event.id);
      });
    });

    it('when an event is changed to error', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      event.error();
      service.events$.subscribe(events => {
        expect(events.find(e => e.id === event.id)?.isError).toEqual(true);
      });
    });
    it('when an event is changed to complete', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      event.complete();
      service.events$.subscribe(events => {
        expect(events.find(e => e.id === event.id)?.isComplete).toEqual(true);
      });
    });
    it('unsubscribes and removes an active event', () => {
      let event: AsyncUIEvent;
      event = service.newEvent();
      event.complete();
      expect(service.deleteEvent(event.id)?.isComplete).toEqual(true);
      expect(service.getEvent(event.id)).toBeUndefined();

      // TODO create a new event that has a jasmine.spy to check if unsubscribe is being called
    });

  });

});
