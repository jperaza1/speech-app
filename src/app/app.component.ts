import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WebSpeechService } from './services/web-speech.service';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'speech-app';

  webSpeechSubscription: Subscription;
  webSpeechTranscript: string;
  synth = window.speechSynthesis;
  textToVoice: string;
  url: string;

  constructor(
    private webSpeechService: WebSpeechService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer
  ){ }

  async ngOnInit() {
  }

  speeck(){
    var utterThis = new SpeechSynthesisUtterance(this.textToVoice);
    utterThis.pitch = 1;
    utterThis.rate = 1;
    this.synth.speak(utterThis);
    let voices = this.synth.getVoices();
  }

  ngOnDestroy() {
    this.stopWebSpeech();
  }

  toggleWebSpeech() {
    if (this.webSpeechService.isRecognizing()) {
      this.stopWebSpeech();
    } else {
      this.startWebSpeech();
    }
  }

  stopWebSpeech() {
    this.webSpeechService.stop();
    if (this.webSpeechSubscription) {
      this.webSpeechSubscription.unsubscribe();
      this.webSpeechSubscription = null;
    }
  }

  startWebSpeech() {
    this.webSpeechTranscript = null;
    this.url = null;
    // this.webSpeechAnalysis = null;
    this.webSpeechSubscription = this.webSpeechService.start().subscribe((data: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(data));
      if (data.type === 'tag') {
        this.webSpeechTranscript = data.value;
        this.url = data.url;
        
        this.stopWebSpeech(); // we want to get the first result and stop listening...

        //this.webSpeechAnalyseTranscript();
      }
    }, (error: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(error));
      this.stopWebSpeech();
      this.showAlert('Oops! Something wrong happened:', error.value, this.startWebSpeech.bind(this));
    });
  }

  private showAlert(title: string, text: string, retryCallback: Function) {
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        text: text
      }
    });
    dialogRef.afterClosed().subscribe((retry) => {
      if (retry) {
        retryCallback();
      }
    });
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

}
