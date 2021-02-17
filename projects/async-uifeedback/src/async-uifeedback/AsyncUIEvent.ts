import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncUIState } from './AsyncUIState';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Provides functions observables and parameters for a UIState object
 */
export class AsyncUIEvent {

    private state: AsyncUIState;

    private stateSubject?: BehaviorSubject<AsyncUIState>;

    public state$?: Observable<AsyncUIState>;

    private isReactive = true;

    private snack?: MatSnackBar;

    // Prevent snacks from being opened for this event
    private noSnack = false;

    // Default time for snack bar to stay open (4000)
    public snackTime = 4000;

    constructor(isReactive = true, snackBar?: MatSnackBar) {

        this.isReactive = isReactive;
        this.state = this.newEventState;

        if (isReactive) {
            this.stateSubject = new BehaviorSubject(this.state);
            this.state$ = this.stateSubject.asObservable();
        }

        snackBar ? this.snack = snackBar : this.noSnack = true;
    }

    get currentState(): AsyncUIState {
        return this.state;
    }

    get isError(): boolean {
        return this.state.error;
    }

    get isLoading(): boolean {
        return this.state.loading;
    }
    get isComplete(): boolean {
        return this.state.complete;
    }

    get successMessage(): string | undefined{
        return this.state?.successMessage;
    }
    get errorMessage(): string | undefined{
        return this.state?.errMessage;
    }

    get stateLabel(): 'Loading' | 'Error' | 'Complete' | 'New' {
        switch (true) {
            case this.isLoading:
                return 'Loading';
                break;
            case this.isError:
                return 'Error';
                break;
            case this.isComplete:
                return 'Complete';
                break;
            default:
                return 'New';
                break;
        }
    }

    get id(): number {
        return this.state.id;
    }

    set preventSnack(bool: boolean) {
        this.noSnack = bool;
    }

    start(): AsyncUIState {

        this.state.loading = true;
        this.state.error = false;
        this.state.complete = false;

        this.emitState();

        return this.state;
    }

    complete(message = 'Complete'): AsyncUIState {

        this.state.loading = false;
        this.state.error = false;
        this.state.complete = true;
        this.state.successMessage = message;

        this.openSnack(message);
        this.emitState();

        return this.state;
    }

    error(message= 'Error'): AsyncUIState {

        this.state.loading = false;
        this.state.error = true;
        this.state.complete = false;
        this.state.errMessage = message;

        this.openSnack(message);
        this.emitState();

        return this.state;
    }

    reset(): AsyncUIState {

        this.state.loading = false;
        this.state.error = false;
        this.state.complete = false;
        this.state.successMessage = undefined;
        this.state.errMessage = undefined;

        this.emitState();

        return this.state;
    }

    openSnack(message: string, time = this.snackTime, action = 'event notification'): void {
        if (!this.noSnack) {
            this.snack?.open(message, action, { duration: time });
        }
    }

    private emitState(): void {
        if (this.isReactive) {
            this.stateSubject?.next(this.state);
        }
    }
    private get newEventState(): AsyncUIState {

        return {
            loading: false,
            error: false,
            complete: false,
            id: Date.now()
        };
    }
}
