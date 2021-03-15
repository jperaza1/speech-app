import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WebSpeechService } from './services/web-speech.service';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ServiceHttp } from './service';
import { TripDto } from './models/trip-dto';
import { NgAudioRecorderService, OutputFormat } from 'ng-audio-recorder';
import { DomSanitizer } from '@angular/platform-browser';

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
  safeblobUrl:string;
  constructor(
    private webSpeechService: WebSpeechService,
    private dialog: MatDialog,
    public _serviceHttp: ServiceHttp,
    private audioRecorderService: NgAudioRecorderService,
    private domSanitizer: DomSanitizer
  ){ 
    this.audioRecorderService.recorderError.subscribe(recorderErrorCase => {
      // Handle Error
    })
  }

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
    this.audioRecorderService.startRecording();
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
          case 100:
            this.update(data.value);
            break;
          case 102:
            this.searchTruck(data.value);
            break;
          case 103:
            this.globalQuestionNumber = 104;
            this.TallQuestion();
            break;
          case 104:
            this.globalQuestionNumber = 105;
            this.TallQuestion();
            break;
        }
      } else if(data.type === 'hint' && (this.globalQuestionNumber === 1 || this.globalQuestionNumber === 100) && data.value === 'Stopped capturing audio.'){
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
        this.audioRecorderService.stopRecording(OutputFormat.WEBM_BLOB).then((output) => {
          this.safeblobUrl = URL.createObjectURL(output);
       }).catch(errrorCase => {
           // Handle Error
       });
        break;
      case 10:
        await this.speeck('Sorry');
        await this.speeck('Please edit the necessary fields and click save');
        break;
      case 100:
        await this.speeck('How can I help you?');
        this.webSpeech();
        break;
      case 101:
        this.help();
        break;
      case 102:
        await this.speeck('Sure. For which truck number?');
        this.webSpeech();
        break;
      case 103:
        await this.speeck('Was that the information you wanted?');
        this.webSpeech();
        break;
      case 104:
        await this.speeck('Do you want this update sent to the Broker Notification email?');
        this.webSpeech();
        break;
      case 105:
        await this.speeck('email send. thanks');
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
    this.audioRecorderService.stopRecording(OutputFormat.WEBM_BLOB).then((output) => {
      this.safeblobUrl = URL.createObjectURL(output);
    }).catch(errrorCase => {
       // Handle Error
    });
    await this.speeck('Thank you. Give me a moment to process that information');
    await this.speeck(`
    Done! Your New Trip # is 2 3 4 3 2. I just texted you the confirmation. Bye.
    `);
  }


  async help(){
    this.globalQuestionNumber = 100;
    this.TallQuestion();
  }

  async update(data: string){
    if(data.toLocaleLowerCase() === 'i need an update'){
      this.globalQuestionNumber = 102;
      this.TallQuestion();
    }else {
      this.globalQuestionNumber = 101;
      this.TallQuestion();
    }
  }

  async searchTruck(data: string){
    await this.speeck('Let me check. SOS System shows that Truck 5 4 4 5 6 is currently on a Load from TQL, From Boston, MA To San Diego, CA, delivering today at 1 pm. The latest GPS update shows the truck 123 miles away from the destination.')
    this.globalQuestionNumber = 103
    this.TallQuestion();
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

}
