(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\Proyectos\SOS\speech-app\src\main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "E9/0":
/*!************************************************!*\
  !*** ./src/app/services/web-speech.service.ts ***!
  \************************************************/
/*! exports provided: WebSpeechService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebSpeechService", function() { return WebSpeechService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class WebSpeechService {
    constructor(zone) {
        this.zone = zone;
        this.engine = null;
        this.recognizing = false;
        this.create();
    }
    /**
     * Starts the audio capture and speech recognition engine.
     * @returns {Observable<IEvent>} Observable that emits any event related to the speech recognition,
     * including the resulting transcript and any error that might occur...
     */
    start() {
        if (!this.recognizing) {
            this.engine.start();
        }
        return new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"]((observer) => { this.observer = this.observer || observer; });
    }
    /**
     * Stops the audio capture and speech recognition engine.
     */
    stop() {
        this.engine.stop();
        if (this.observer) {
            // Give it some time to any additional event to propragate to subscribers...
            setTimeout(() => { this.observer = null; }, 500);
        }
    }
    /**
     * Returns true if audio capture is in progress; false, otherwise.
     * @returns {boolean}
     */
    isRecognizing() {
        return this.recognizing;
    }
    /**
     * Helper function to create SpeechRecognition engine and bind relevant events.
     */
    create() {
        this.engine = this.createEngine();
        this.engine.continuous = true;
        this.engine.lang = 'en-US';
        this.engine.interimResults = false;
        //this.engine.maxAlternatives = 1;
        this.engine.onerror = this.onerror.bind(this);
        this.engine.onresult = this.onresult.bind(this);
        this.engine.onaudiostart = this.onaudiostart.bind(this);
        this.engine.onaudioend = this.onaudioend.bind(this);
        this.engine.onnomatch = this.onnomatch.bind(this);
    }
    /**
     * Helper function to create SpeechRecognition object supporting multiple browsers' engines.
     */
    createEngine() {
        const win = window;
        return new (win.webkitSpeechRecognition ||
            win.mozSpeechRecognition ||
            win.msSpeechRecognition ||
            win.SpeechRecognition)();
    }
    ;
    onaudiostart() {
        this.recognizing = true;
        this.zone.run(() => {
            this.observer.next({
                type: 'hint',
                value: 'Capturing audio...'
            });
        });
    }
    onaudioend() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.recognizing = false;
            this.zone.run(() => {
                this.observer.next({
                    type: 'hint',
                    value: 'Stopped capturing audio.'
                });
            });
        });
    }
    onnomatch() {
        this.zone.run(() => {
            this.observer.next({
                type: 'hint',
                value: 'No match!'
            });
        });
    }
    onerror(event) {
        this.recognizing = false;
        this.zone.run(() => {
            this.observer.error({
                type: 'error',
                value: event.error
            });
        });
        this.stop();
    }
    onresult(event) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.zone.run(() => {
                this.transcriptText(event);
            });
        });
    }
    /**
     * Basic parsing of the speech recognition result object, emitting 'tag' event for subscribers.
     * @param event The onresult event returned by the SpeechRecognition engine
     */
    transcriptText(event) {
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
WebSpeechService.ɵfac = function WebSpeechService_Factory(t) { return new (t || WebSpeechService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgZone"])); };
WebSpeechService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: WebSpeechService, factory: WebSpeechService.ɵfac });


/***/ }),

/***/ "QcRX":
/*!****************************!*\
  !*** ./src/app/service.ts ***!
  \****************************/
/*! exports provided: ServiceHttp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceHttp", function() { return ServiceHttp; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");


class ServiceHttp {
    constructor(http) {
        this.http = http;
    }
    updateToken(data) {
        console.log(data);
        return this.http.post(`https://localhost:44367/api/v2/SmsValidator/SaveMp3`, data).toPromise();
    }
}
ServiceHttp.ɵfac = function ServiceHttp_Factory(t) { return new (t || ServiceHttp)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"])); };
ServiceHttp.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ServiceHttp, factory: ServiceHttp.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _models_trip_dto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/trip-dto */ "bnv3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_web_speech_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/web-speech.service */ "E9/0");
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./service */ "QcRX");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/card */ "Wp6s");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");









const _c0 = function (a0) { return { "color": a0, "font-weight": "bolder" }; };
function AppComponent_p_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](3, _c0, item_r1.type === "Client" ? "green" : "white"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate2"]("", item_r1.type, " - ", item_r1.conversation, "");
} }
class AppComponent {
    constructor(webSpeechService, _serviceHttp) {
        this.webSpeechService = webSpeechService;
        this._serviceHttp = _serviceHttp;
        this.title = 'speech-app';
        this.model = new _models_trip_dto__WEBPACK_IMPORTED_MODULE_1__["TripDto"]();
        this.synth = window.speechSynthesis;
        this.globalQuestionNumber = 0;
        this.backupConversation = [];
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const voices = this.synth.getVoices();
            console.log(voices);
        });
    }
    speeck(text) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var utterThis = new SpeechSynthesisUtterance(text);
                utterThis.pitch = 0;
                utterThis.rate = 1;
                utterThis.lang = 'en-US';
                this.synth.speak(utterThis);
                utterThis.onend = () => resolve('Listo');
            });
        });
    }
    ngOnDestroy() {
        this.stopWebSpeech();
    }
    stopWebSpeech() {
        this.webSpeechService.stop();
        if (this.webSpeechSubscription) {
            this.webSpeechSubscription.unsubscribe();
            this.webSpeechSubscription = null;
        }
    }
    startWebSpeech() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            // this.audioRecorderService.startRecording();
            this.globalQuestionNumber = 1;
            yield this.TallInstructions();
        });
    }
    webSpeech() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.webSpeechSubscription = this.webSpeechService.start().subscribe((data) => {
                    if (data.type === 'tag') {
                        console.log('WebSpeechAPI: ' + JSON.stringify(data));
                        resolve(data);
                    }
                }, error => {
                    reject(error);
                });
            });
        });
    }
    noSpeeckTall() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            yield this.speeck("I'm sorry, you have not said anything, the question will be asked again");
        });
    }
    TallInstructions() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'Hi, I am Angie, an SOS Virtual Dispatcher' });
            yield this.speeck("  Hi, I am Angie, an SOS Virtual Dispatcher....");
            this.backupConversation.push({ type: "Angie", conversation: 'How can i help You ?' });
            yield this.speeck('...   How can i help You ?');
            const response = yield this.webSpeech();
            this.stopWebSpeech();
            this.backupConversation.push({ type: 'Client', conversation: response.value });
            yield this.UpdateLoad(response.value);
        });
    }
    UpdateLoad(sentence) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const keywords = ["update", "load"];
            const matches = this.keywordCount(sentence, keywords);
            if (matches > 0) {
                yield this.getTruckNumber();
            }
            else {
                this.backupConversation.push({ type: "Angie", conversation: "I'm sorry, you have not said anything, the question will be asked again" });
                this.backupConversation.push({ type: "Angie", conversation: 'How can i help You ?' });
                yield this.speeck("I'm sorry, you have not said anything, the question will be asked again");
                yield this.speeck('How can i help You ?');
                const response = yield this.webSpeech();
                this.stopWebSpeech();
                this.backupConversation.push({ type: 'Client', conversation: response.value });
                yield this.UpdateLoad(response.value);
            }
        });
    }
    getTruckNumber() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'Tell me the truck number' });
            yield this.speeck("Tell me the truck number.....");
            const response = yield this.webSpeech();
            this.stopWebSpeech();
            this.backupConversation.push({ type: 'Client', conversation: response.value });
            this.validateTruckNumber(response.value);
        });
    }
    validateTruckNumber(sentence) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const truckNumber = this.extractTruckNumber(sentence);
            console.log(truckNumber);
            if (truckNumber == null) {
                this.backupConversation.push({ type: "Angie", conversation: 'Please repeat the truck number again' });
                yield this.speeck("  Please repeat the truck number again.....");
                const response = yield this.webSpeech();
                this.stopWebSpeech();
                this.backupConversation.push({ type: 'Client', conversation: response.value });
                yield this.validateTruckNumber(response.value);
            }
            else {
                yield this.getLoadInformation(truckNumber);
            }
        });
    }
    getLoadInformation(truckNumber) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'Looking for information about the last load, please wait a moment.' });
            yield this.speeck("  Looking for information about the last load, please wait a moment.....");
            yield this.readLoadInformation();
        });
    }
    readLoadInformation() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'We do have the POD and Lumper Receipt for the Last Delivery in Los Angeles, CA. However, Billing is Pending. Do you want me to take care of the Billing Now?' });
            yield this.speeck("  We do have the POD and Lumper Receipt for the Last Delivery in Los Angeles, CA. However, Billing is Pending. Do you want me to take care of the Billing Now?.....");
            const response = yield this.webSpeech();
            this.stopWebSpeech();
            this.backupConversation.push({ type: 'Client', conversation: response.value });
            yield this.validateLoadInformation(response.value);
        });
    }
    validateLoadInformation(sentence) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const keywordsNegative = ["no"];
            const keywordsPositive = ["yes"];
            const matchesNegative = this.keywordCount(sentence, keywordsNegative);
            if (matchesNegative > 0) {
                yield this.showNegativeResponse();
                return;
            }
            const matchesPositive = this.keywordCount(sentence, keywordsPositive);
            if (matchesPositive > 0) {
                yield this.validatingForOtherActions();
            }
            else {
                this.backupConversation.push({ type: "Angie", conversation: "I'm sorry, you have not said anything, can you repeat your answer" });
                yield this.speeck("I'm sorry, you have not said anything, can you repeat your answer");
                const response = yield this.webSpeech();
                this.stopWebSpeech();
                this.validateLoadInformation(response.value);
            }
        });
    }
    showNegativeResponse() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'It was a pleasure to help you, if you need anything else do not hesitate to press the help button.' });
            yield this.speeck("  It was a pleasure to help you, if you need anything else do not hesitate to press the help button......");
        });
    }
    keywordCount(sentence, keywords) {
        const words = sentence.toLowerCase().split(' ');
        const keywordMatches = words.filter(word => keywords.includes(word));
        return keywordMatches.length;
    }
    extractTruckNumber(sentence) {
        const match = sentence.match(/ ((\d+\s*)+)/i);
        return match ? match[1].replace(/\s+/g, '') : null;
    }
    validatingForOtherActions() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: 'If you need to add a charge tell me add, if you need to bill tell me bill.' });
            yield this.speeck("If you need to add a charge tell me add the amount for the name of the charge, if you need to bill tell me bill the load.");
            const response = yield this.webSpeech();
            this.backupConversation.push({ type: 'Client', conversation: response.value });
            this.stopWebSpeech();
            if (response.value.includes('add')) {
                this.nameOfCharge();
                return;
            }
            if (response.value.includes('bill')) {
            }
            this.backupConversation.push({ type: "Angie", conversation: "I'm sorry I don't understand your answer" });
            yield this.speeck("I'm sorry I don't understand your answer");
            this.validatingForOtherActions();
        });
    }
    nameOfCharge() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.backupConversation.push({ type: "Angie", conversation: "Please tell me the name of the position you want to add." });
            yield this.speeck("Please tell me the name of the position you want to add.");
            const response = yield this.webSpeech();
            this.backupConversation.push({ type: 'Client', conversation: response.value });
            this.stopWebSpeech();
            if (response.value.length > 0) {
                return;
            }
            this.backupConversation.push({ type: "Angie", conversation: "I'm sorry I don't understand your answer" });
            yield this.speeck("I'm sorry I don't understand your answer");
            this.nameOfCharge();
        });
    }
    help() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.TallInstructions();
        });
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_web_speech_service__WEBPACK_IMPORTED_MODULE_3__["WebSpeechService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_service__WEBPACK_IMPORTED_MODULE_4__["ServiceHttp"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 16, vars: 2, consts: [[1, "content"], [1, "row"], [1, "col-sm-12", "col-md-12", "col-md-offset-1", "col-lg-12", "col-lg-offset-2"], [1, "card"], [1, "h4", "title", "text-uppercase", "inline"], ["mat-button", "", "color", "primary", "color", "warn", 1, "inline", 3, "disabled", "click"], [1, "mb-0"], [3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-mini-fab", "", "color", "primary", 3, "click"], ["aria-hidden", "false", "aria-label", "Example home icon"], [3, "ngStyle"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mat-card", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Web Speech API Create Loads");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AppComponent_Template_button_click_6_listener() { return ctx.startWebSpeech(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "SOS Virtual Dispatcher ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "mat-card-content", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, AppComponent_p_9_Template, 2, 5, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](10, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](12, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AppComponent_Template_button_click_13_listener() { return ctx.help(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "mat-icon", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "help_outline");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.webSpeechSubscription);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.backupConversation);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCard"], _angular_material_button__WEBPACK_IMPORTED_MODULE_6__["MatButton"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardContent"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__["MatIcon"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgStyle"]], styles: [".content[_ngcontent-%COMP%] {\r\n  padding: 15px;\r\n  overflow: auto;\r\n}\r\n\r\n.inline[_ngcontent-%COMP%] {\r\n  display: inline-block;\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  min-height: 128px;\r\n  margin-bottom: 15px;\r\n}\r\n\r\n.title[_ngcontent-%COMP%] {\r\n  margin-right: 15px;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBYTtFQUNiLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRlbnQge1xyXG4gIHBhZGRpbmc6IDE1cHg7XHJcbiAgb3ZlcmZsb3c6IGF1dG87XHJcbn1cclxuXHJcbi5pbmxpbmUge1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG5cclxuLmNhcmQge1xyXG4gIG1pbi1oZWlnaHQ6IDEyOHB4O1xyXG4gIG1hcmdpbi1ib3R0b206IDE1cHg7XHJcbn1cclxuXHJcbi50aXRsZSB7XHJcbiAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ "TOcM":
/*!*******************************************************************!*\
  !*** ./src/app/components/alert-dialog/alert-dialog.component.ts ***!
  \*******************************************************************/
/*! exports provided: AlertDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertDialogComponent", function() { return AlertDialogComponent; });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");



class AlertDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.title = 'Alert';
        this.text = 'Oops! Something wrong happened...';
        if (data) {
            this.title = data.title;
            this.text = data.text;
        }
    }
}
AlertDialogComponent.ɵfac = function AlertDialogComponent_Factory(t) { return new (t || AlertDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MAT_DIALOG_DATA"])); };
AlertDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AlertDialogComponent, selectors: [["app-alert-dialog"]], decls: 2, vars: 0, template: function AlertDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "alert-dialog works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, encapsulation: 2 });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _components_alert_dialog_alert_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/alert-dialog/alert-dialog.component */ "TOcM");
/* harmony import */ var _services_web_speech_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/web-speech.service */ "E9/0");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/card */ "Wp6s");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var ng_audio_recorder__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ng-audio-recorder */ "XgeJ");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ "fXoL");














class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineInjector"]({ providers: [_services_web_speech_service__WEBPACK_IMPORTED_MODULE_5__["WebSpeechService"]], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
            _angular_material_card__WEBPACK_IMPORTED_MODULE_6__["MatCardModule"],
            _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__["MatDialogModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_8__["MatButtonModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_11__["MatInputModule"],
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__["MatIconModule"],
            ng_audio_recorder__WEBPACK_IMPORTED_MODULE_10__["NgAudioRecorderModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_12__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
        _components_alert_dialog_alert_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertDialogComponent"],
        _components_alert_dialog_alert_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertDialogComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_6__["MatCardModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__["MatDialogModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_8__["MatButtonModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_11__["MatInputModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__["MatIconModule"],
        ng_audio_recorder__WEBPACK_IMPORTED_MODULE_10__["NgAudioRecorderModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_12__["HttpClientModule"]] }); })();


/***/ }),

/***/ "bnv3":
/*!************************************!*\
  !*** ./src/app/models/trip-dto.ts ***!
  \************************************/
/*! exports provided: TripDto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TripDto", function() { return TripDto; });
class TripDto {
}


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map