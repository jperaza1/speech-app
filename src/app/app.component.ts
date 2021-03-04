import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WebSpeechService } from './services/web-speech.service';
import { DialogAlertComponent } from './components/dialog-alert/dialog-alert.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'speech-app';

  webSpeechSubscription: Subscription;
  webSpeechTranscript: string;

  constructor(
    private webSpeechService: WebSpeechService,
    private dialog: MatDialog
  ){ }

  ngOnInit() {
    
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
    // this.webSpeechAnalysis = null;
    this.webSpeechSubscription = this.webSpeechService.start().subscribe((data: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(data));
      if (data.type === 'tag') {
        this.webSpeechTranscript = data.value;
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
    let dialogRef = this.dialog.open(DialogAlertComponent, {
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

}
