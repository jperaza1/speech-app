import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { WebSpeechService } from './services/web-speech.service';
import { ServiceHttp } from './service';
import { TripDto } from './models/trip-dto';
import { ConversationDto } from './models/conversation-dto';


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
  globalQuestionNumber: number = 0;
  safeblobUrl:string;
  backupConversation:ConversationDto[] = [];
  constructor(
    private webSpeechService: WebSpeechService,
    public _serviceHttp: ServiceHttp,
  ){ 
  }

  async ngOnInit() {
    const voices = this.synth.getVoices();
    console.log(voices);
  }

  async speeck(text: string){
    return new Promise((resolve, reject) => {
      var utterThis = new SpeechSynthesisUtterance(text);
      utterThis.pitch = 0;
      utterThis.rate = 1;
      utterThis.lang = 'en-US';
      this.synth.speak(utterThis);
      utterThis.onend = () => resolve('Listo');
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

  async startWebSpeech() {
    // this.audioRecorderService.startRecording();
    this.globalQuestionNumber = 1;
    await this.TallInstructions();
    
  }

  async webSpeech(){
    this.webSpeechSubscription = this.webSpeechService.start().subscribe((data: any) => {
      console.log('WebSpeechAPI: ' + JSON.stringify(data));
      if (data.type === 'tag') {
        this.stopWebSpeech();
        switch(this.globalQuestionNumber){
          case 1:
            this.howCanIHelpYou(data.value);
            break;
          case -1:
            this.howCanIHelpYou(data.value);
            break;
          case 11:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 12;
            this.TallQuestion();
            break;
          case 12:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 13;
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
    this.backupConversation.push({ type: "Angie", conversation:'Hi, I am Angie, an SOS Virtual Dispatcher'});
    await this.speeck("  Hi, I am Angie, an SOS Virtual Dispatcher....");
    this.TallQuestion();
  }

  async TallQuestion(){
    console.log(this.globalQuestionNumber);
    switch(this.globalQuestionNumber){
      case 1:
        this.backupConversation.push({ type: "Angie", conversation: 'How can i help You ?' });
        await this.speeck('...   How can i help You ?');    
        this.webSpeech();
        break;
      case 11: 
        this.backupConversation.push({ type: "Angie", conversation: 'Nice to meet you too Brian. How are you today?' });
        await this.speeck('Nice to meet you too Brian. How are you today?');
        this.webSpeech();
        break;
      case 12: 
        this.backupConversation.push({ type: "Angie", conversation: 'Good, How can i help You ?' });
        await this.speeck('Good, How can i help You?');
        this.webSpeech();
        break;
      case 13: 
        this.backupConversation.push({ type: "Angie", conversation: 'My creators name is Juan Basanez. But you can call him JJ' });
        await this.speeck('My creators name is Juan Basanez. But you can call him JJ');
        this.webSpeech();
        break;
      case 100:
        this.backupConversation.push({ type: "Angie", conversation: 'If you need me, just touch my face on your Mobile App' });
        await this.speeck('If you need me, just touch my face on your Mobile App');
        break;
      case -1:
        this.backupConversation.push({ type: "Angie", conversation: "Sorry, I can't find anything. How can i help You ?" });
        await this.speeck("Sorry, I can't find anything. How can i help You ?");
        this.webSpeech();
        break;
    }
  }


  private howCanIHelpYou(data: string) {
    this.backupConversation.push({ type: 'Client', conversation: data });
    if (data.toLowerCase().includes('i am')){
      this.globalQuestionNumber = 11;
    } else {
      this.globalQuestionNumber = -1;
    }
    this.TallQuestion();
  }

  // private youCanSay(data: string) {
  //   this.backupConversation.push({ type: 'Client', conversation: data });
  //   if(data.toLowerCase().includes("next match")) {
  //     this.globalQuestionNumber = 9;
  //   } else if (data.toLowerCase().includes("make an offer")) {
  //     this.globalQuestionNumber = 6;
  //   } else {
  //     this.globalQuestionNumber = -2;
  //   }
  //   this.TallQuestion();
  // }

  private anythingElseCanIHelpYou(data: string) {
    this.backupConversation.push({ type: 'Client', conversation: data });
    if(data.toLowerCase().includes("no") || data.toLowerCase().includes("no thanks") || data.toLowerCase().includes("no thank you")) {
      this.globalQuestionNumber = 100;
      this.TallQuestion();
    } else if (data.toLowerCase().includes("please keep looking for a good load")) {
      this.globalQuestionNumber = 15;
      this.TallQuestion();
    } else {
      this.webSpeech();
    }
    
  }


  async help(){
    this.globalQuestionNumber = 100;
    this.TallQuestion();
  }

}
