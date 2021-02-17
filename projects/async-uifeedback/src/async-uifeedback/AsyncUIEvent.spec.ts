import { AsyncUIEvent } from './AsyncUIEvent';
import { SpyHelper } from '@bit/mxds.angular-components.spy-helper';
import { AsyncUIState } from './AsyncUIState';
import { MatSnackBar } from '@angular/material/snack-bar';


describe('AsyncUIEvent class, without reactive features', () => {

    const spyHelper = new SpyHelper();

    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    let asyncUIEvent: AsyncUIEvent;

    beforeEach(() => {
        asyncUIEvent = new AsyncUIEvent(false, snackSpy);
        spyHelper.resetCalls(snackSpy.open);
    });

    it('Has the default current state', () => {

        const time = Date.now();
        asyncEventStateExpects.new(asyncUIEvent, time);
    });

    it('Changes state to loading with correct boolean flags, but does not emit events', () => {

        const event = asyncUIEvent.start();
        asyncStateExpects.start(event, Date.now());
        expect(asyncUIEvent.state$).toBeUndefined();
    });

    it('Changes state to complete with correct boolean flags, but does not emit events', () => {

        asyncUIEvent.start();
        const event = asyncUIEvent.complete();
        asyncStateExpects.complete(event, Date.now());
        expect(asyncUIEvent.state$).toBeUndefined();
    });

    it('Changes state to error with correct boolean flags, but does not emit events', () => {

        asyncUIEvent.start();
        const event = asyncUIEvent.error();
        asyncStateExpects.error(event, Date.now());
        expect(asyncUIEvent.state$).toBeUndefined();
    });
});

describe('AsyncUIEvent class, with reactive features', () => {

    const spyHelper = new SpyHelper();

    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    let asyncUIEvent: AsyncUIEvent;

    beforeEach(() => {
        asyncUIEvent = new AsyncUIEvent(true, snackSpy);
        spyHelper.resetCalls(snackSpy.open);
    });

    it('Has the default current state', () => {

        const time = Date.now();
        asyncEventStateExpects.new(asyncUIEvent, time);
    });

    it('Changes state to loading with correct boolean flags, and emits event', () => {

        const event = asyncUIEvent.start();
        asyncStateExpects.start(event, Date.now());
        asyncUIEvent.state$?.subscribe(state => {
            asyncStateExpects.start(event, Date.now());
        });
    });

    it('Changes state to complete, emits state and opens snack bar', () => {

        asyncUIEvent.start();
        const event = asyncUIEvent.complete();
        asyncStateExpects.complete(event, Date.now());
        asyncUIEvent.state$?.subscribe(state => {
            asyncStateExpects.complete(event, Date.now());
        });
        spyHelper.expect.callCount(snackSpy.open, 1);
    });

    it('Changes state to error, emits state and opens snack bar', () => {

        asyncUIEvent.start();
        const event = asyncUIEvent.error();
        asyncStateExpects.error(event, Date.now());
        asyncUIEvent.state$?.subscribe(state => {
            asyncStateExpects.error(event, Date.now());
        });
        spyHelper.expect.callCount(snackSpy.open, 1);
    });

    it('Changes state to error but does not emit snack as feature turned off', () => {

        asyncUIEvent.preventSnack = true;
        asyncUIEvent.start();
        const event = asyncUIEvent.error();
        asyncStateExpects.error(event, Date.now());
        asyncUIEvent.state$?.subscribe(state => {
            asyncStateExpects.error(event, Date.now());
        });
        spyHelper.expect.callCount(snackSpy.open, 0);
    });
});


const eventStateExpectations = (event: AsyncUIEvent, loading: boolean, complete: boolean, error: boolean, time: number): void => {
    expect(event.currentState.loading).toEqual(loading);
    expect(event.currentState.error).toEqual(error);
    expect(event.currentState.complete).toEqual(complete);
    expect(event.isLoading).toEqual(loading);
    expect(event.isError).toEqual(error);
    expect(event.isComplete).toEqual(complete);
    expect(event.id).toBeLessThanOrEqual(time);
};
const asyncEventStateExpects = {
    new: (event: AsyncUIEvent, time: number) => {
        eventStateExpectations(event, false, false, false, time);
    },
    complete: (event: AsyncUIEvent, time: number) => {
        eventStateExpectations(event, false, true, false, time);
    },
    start: (event: AsyncUIEvent, time: number) => {
        eventStateExpectations(event, true, false, false, time);
    },
    error: (event: AsyncUIEvent, time: number) => {
        eventStateExpectations(event, false, false, true, time);
    },
};
const stateExpectations = (event: AsyncUIState, loading: boolean, complete: boolean, error: boolean, time: number): void => {

    expect(event.loading).toEqual(loading);
    expect(event.error).toEqual(error);
    expect(event.complete).toEqual(complete);
    expect(event.id).toBeLessThanOrEqual(time);
};
const asyncStateExpects = {
    new: (event: AsyncUIState, time: number) => {
        stateExpectations(event, false, false, false, time);
    },
    complete: (event: AsyncUIState, time: number) => {
        stateExpectations(event, false, true, false, time);
    },
    start: (event: AsyncUIState, time: number) => {
        stateExpectations(event, true, false, false, time);
    },
    error: (event: AsyncUIState, time: number) => {
        stateExpectations(event, false, false, true, time);
    },
};
