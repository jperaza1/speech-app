import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WebSpeechService } from './services/web-speech.service';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ServiceHttp } from './service';
import { TripDto } from './models/trip-dto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'speech-app';

  webSpeechSubscription: Subscription;
  
  model:TripDto = new TripDto();

  webSpeechTranscript: string;
  synth = window.speechSynthesis;
  globalQuestionNumber: number = 1;
  constructor(
    private webSpeechService: WebSpeechService,
    private dialog: MatDialog,
    public _serviceHttp: ServiceHttp
  ){ }

  async ngOnInit() {
  }

  async speeck(text: string){
    return new Promise((resolve, reject) => {
      var utterThis = new SpeechSynthesisUtterance(text);
      utterThis.pitch = 1;
      utterThis.rate = 1;
      utterThis.lang = 'en-US';
      this.synth.speak(utterThis);
      utterThis.onend = () => resolve('Listo');
    });
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

  async startWebSpeech() {
    await this.TallInstructions();
  }

  async webSpeech(){
    this.webSpeechSubscription = this.webSpeechService.start().subscribe((data: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(data));
      if (data.type === 'tag') {
        this.stopWebSpeech();
        switch(this.globalQuestionNumber){
          case 1:
            this.model.truckNumber = data.value;
            this.globalQuestionNumber = 2;
            this.TallQuestion();
            break;
          case 2:
            this.model.customer = data.value;
            this.globalQuestionNumber = 3;
            this.TallQuestion();
            break;
          case 3:
            this.model.origin = data.value;
            this.globalQuestionNumber = 4;
            this.TallQuestion();
            break;
          case 4:
            this.model.pickUp = data.value;
            this.globalQuestionNumber = 5;
            this.TallQuestion();
            break;
          case 5:
            this.model.destination = data.value;
            this.globalQuestionNumber = 6;
            this.TallQuestion();
            break;
          case 6:
            this.model.delivery = data.value;
            this.globalQuestionNumber = 7;
            this.TallQuestion();
            break;
          case 7:
            this.model.customerRate = data.value;
            this.globalQuestionNumber = 8;
            this.TallQuestion();
            break;
          case 8:
              this.question(data.value);
              break;
        }
      } else if(data.type === 'hint' && this.globalQuestionNumber === 1 && data.value === 'Stopped capturing audio.'){
        this.stopWebSpeech();
        this.noSpeeckTall();
      }
    }, (error: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(error));
      this.stopWebSpeech();
      this.noSpeeckTall();
      //this.showAlert('Oops! Something wrong happened:', error.value, this.startWebSpeech.bind(this));
    });
  }

  async noSpeeckTall(){
    await this.speeck("I'm sorry, you have not said anything, the question will be asked again");
    this.TallQuestion();
  }

  async TallInstructions(){
    await this.speeck('Lets create a New Trip');
    await this.speeck('Please listen carefully to these questions');
    this.TallQuestion();
  }

  async TallQuestion(){
    console.log(this.globalQuestionNumber);
    switch(this.globalQuestionNumber){
      case 1:
        await this.speeck('Number 1');
        await this.speeck('Which is the truck number for this Trip?');       
        this.webSpeech();
        break;
      case 2:
        await this.speeck('Number 2');
        await this.speeck('Who is the Customer?');
        this.webSpeech();
        break;
      case 3:
        await this.speeck('Number 3');
        await this.speeck('What is the Origin?');
        this.webSpeech();
        break;
      case 4:
        await this.speeck('Number 4');
        await this.speeck('When is the Pick Up?');
        this.webSpeech();
        break;
      case 5:
        await this.speeck('Number 5');
        await this.speeck('What is the Destination?');
        this.webSpeech();
        break;
      case 6:
        await this.speeck('Number 6');
        await this.speeck('When is the Delivery?');
        this.webSpeech();
        break;
      case 7:
        await this.speeck('Number 7');
        await this.speeck('What is the Customer Rate?');
        this.webSpeech();
        break;
      case 8:
        await this.speeck('Great. To confirm');
        await this.speeck(`
          This is a Load for Truck # ${this.model.truckNumber}, the customer is ${this.model.customer}, picking up in ${this.model.origin} on ${this.model.pickUp}, 
          delivering to ${this.model.destination} on ${this.model.delivery}. And the Customer Rate is ${this.model.customerRate} Is this correct?
        `);
        this.webSpeech();
        break;
      case 9:
        await this.speeck('Thank you. Give me a moment to process that information');
        await this.speeck(`
        Done! Your New Trip # is 2 3 4 3 2. I just texted you the confirmation. Bye.
        `);
        break;
      case 10:
        await this.speeck('Sorry');
        await this.speeck('Please edit the necessary fields and click save');
        break;
    }
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

  private transformNumber(){

  }

  private question(data: string){
    console.log(data);
    this.model.isCorrect = data.toLocaleLowerCase() as string;

    if(data === 'yes' || data === 'ok'){
      this.globalQuestionNumber = 9
    }else{
      this.globalQuestionNumber = 10;
    }
    this.TallQuestion();
  }

  async saveManualLoans(){
    await this.speeck('Thank you. Give me a moment to process that information');
    await this.speeck(`
    Done! Your New Trip # is 2 3 4 3 2. I just texted you the confirmation. Bye.
    `);
  }

}
