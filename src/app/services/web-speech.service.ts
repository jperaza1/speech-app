import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { IEvent } from '../models/IEvent';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
    SpeechRecognition: any;
}

@Injectable()
export class WebSpeechService {
    private engine: any = null;

    private recognizing = false;
    private observer: Observer<IEvent>;

    constructor(private zone: NgZone) {
        this.create();
    }

    /**
     * Starts the audio capture and speech recognition engine.
     * @returns {Observable<IEvent>} Observable that emits any event related to the speech recognition,
     * including the resulting transcript and any error that might occur...
     */
    start(): Observable<IEvent> {
        if (!this.recognizing) {
        this.engine.start();
        }
        return new Observable((observer: Observer<IEvent>) => { this.observer = this.observer || observer; });
    }

    /**
     * Stops the audio capture and speech recognition engine.
     */
    stop() {
        this.engine.stop();

        if (this.observer) {
            // Give it some time to any additional event to propragate to subscribers...
            setTimeout(() => { this.observer = null; }, 2000);
        }
    }

    /**
     * Returns true if audio capture is in progress; false, otherwise.
     * @returns {boolean}
     */
    isRecognizing(): boolean {
        return this.recognizing;
    }

    /**
     * Helper function to create SpeechRecognition engine and bind relevant events.
     */
    private create() {
        this.engine = this.createEngine();
        this.engine.continuous = true;
        this.engine.lang = 'en-US';
        this.engine.interimResults = true;
        this.engine.maxAlternatives = 1;

        this.engine.onerror = this.onerror.bind(this);
        this.engine.onresult = this.onresult.bind(this);
        this.engine.onaudiostart = this.onaudiostart.bind(this);
        this.engine.onaudioend = this.onaudioend.bind(this);
        this.engine.onnomatch = this.onnomatch.bind(this);
    }

    /**
     * Helper function to create SpeechRecognition object supporting multiple browsers' engines.
     */
    private createEngine(): any {
        const win: IWindow = <IWindow><unknown>window;
        return new (win.webkitSpeechRecognition ||
                    win.mozSpeechRecognition ||
                    win.msSpeechRecognition ||
                    win.SpeechRecognition)();
    };

    private onaudiostart() {
        this.recognizing = true;

        this.zone.run(() => {
            this.observer.next({
            type: 'hint',
            value: 'Capturing audio...'
            });
        });
    }

    private onaudioend() {
        this.recognizing = false;

        this.zone.run(() => {
            this.observer.next({
            type: 'hint',
            value: 'Stopped capturing audio.'
            });
        });
    }

    private onnomatch() {
        this.zone.run(() => {
            this.observer.next({
            type: 'hint',
            value: 'No match!'
            });
        });
    }

    private onerror(event: any) {
        this.recognizing = false;

        this.zone.run(() => {
            this.observer.error({
            type: 'error',
            value: event.error
            });
        });

        this.stop();
    }

    private onresult(event: any) {
        this.zone.run(() => {
            this.transcriptText(event);
        });
    }

    /**
     * Basic parsing of the speech recognition result object, emitting 'tag' event for subscribers.
     * @param event The onresult event returned by the SpeechRecognition engine
     */
    private transcriptText(event: any) {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
            this.observer.next({
                type: 'tag',
                value: event.results[i][0].transcript
            });
            }
        }
    }
}