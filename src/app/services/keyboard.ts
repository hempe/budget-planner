import { EventEmitter, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class KeyboardService {
    public keyPressed: Observable<KeyboardEvent>;
    public keyUp: Observable<KeyboardEvent>;
    public keyDown: Observable<KeyboardEvent>;

    private keyPressedEmitter = new EventEmitter<KeyboardEvent>();
    private keyUpEmitter = new EventEmitter<KeyboardEvent>();
    private keyDownEmitter = new EventEmitter<KeyboardEvent>();

    constructor() {
        this.keyPressed = this.keyPressedEmitter.asObservable();
        this.keyUp = this.keyUpEmitter.asObservable();
        this.keyDown = this.keyDownEmitter.asObservable();

        document.addEventListener(
            'keypress',
            e => this.onKeyEvent(e, this.keyPressedEmitter),
            false
        );
        document.addEventListener(
            'keydown',
            e => this.onKeyEvent(e, this.keyDownEmitter),
            false
        );
        document.addEventListener(
            'keyup',
            e => this.onKeyEvent(e, this.keyUpEmitter),
            false
        );
    }

    private onKeyEvent(e, emitter: EventEmitter<KeyboardEvent>) {
        emitter.emit(e);
    }
}
