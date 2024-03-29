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
          case -2:
            this.youCanSay(data.value);
            break;
          case 2:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 3;
            this.TallQuestion();
            break;
          case 3:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 4;
            this.TallQuestion();
            break;
          case 4:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 5;
            this.TallQuestion();
            break;
          case 5:
            this.youCanSay(data.value);
            // this.backupConversation.push({ type: 'Client', conversation: data.value });
            // this.globalQuestionNumber = 6;
            // this.TallQuestion();
            break;
          case 6:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.model.delivery = data.value;
            this.globalQuestionNumber = 7;
            this.TallQuestion();
            break;
          case 7:
            this.anythingElseCanIHelpYou(data.value)
            break;
          case 8:
            this.anythingElseCanIHelpYou(data.value)
            break;
          case 9:
            this.youCanSay(data.value)
            break;
          case 11:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.model.truckNumber = data.value;
            this.globalQuestionNumber = 12;
            this.TallQuestion();
            break;
          case 12:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 13;
            this.TallQuestion();
            break;
          case 13:
            this.backupConversation.push({ type: 'Client', conversation: data.value });
            this.globalQuestionNumber = 14;
            this.TallQuestion();
            break;
          case 14:
            this.anythingElseCanIHelpYou(data.value);
            break;
          case 15:
            this.anythingElseCanIHelpYou(data.value);
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
      case 2:
        this.backupConversation.push({ type: "Angie", conversation: 'Ofcourse,' });
        await this.speeck('.... Ofcourse,');
        this.backupConversation.push({ type: "Angie", conversation: 'I understand that you have a Reefer trailer. Is that correct?' });
        await this.speeck('....  I understand that you have a Reefer trailer. Is that correct?');
        this.webSpeech();
        break;
      case 3:
        this.backupConversation.push({ type: "Angie", conversation: 'Pick Up Date ?' });
        await this.speeck('    Pick Up Date ?');
        this.webSpeech();
        break;
      case 4:
        this.backupConversation.push({ type: "Angie", conversation: 'Where to?' });
        await this.speeck('    Where to?');
        this.backupConversation.push({ type: "Angie", conversation: 'You can ask for particular State, or say "Anywhere"' });
        await this.speeck('    You can ask for particular State, or say "Anywhere"');
        this.webSpeech();
        break;
      case 5:
        this.backupConversation.push({ type: "Angie", conversation: 'I am looking' });
        await this.speeck('I am looking.....');
        this.backupConversation.push({ type: "Angie", conversation: 'I found some matches. I will offer the best 3 matches, based on your preferences of Destinations, Loaded Miles, and Rate Per Mile. Here they are:' });
        await this.speeck('I found some matches. I will offer the best 3 matches, based on your preferences of Destinations, Loaded Miles, and Rate Per Mile. Here they are:');
        this.backupConversation.push({ type: "Angie", conversation: '1, Broker: CH Robinson, Origen: Atlanta, GA, which is 32 miles from your last delivery. Reefer Load, Fish, Destination: Los Angeles, CA, 2183 Loaded Miles, Rate Offered is $ 5500, an average of $2.50 per mile.		' });
        await this.speeck('1, Broker: C H Robinson, Origen: Atlanta, Georgia, which is 32 miles from your last delivery. Reefer Load, Fish, Destination: Los Angeles, California, 2183 Loaded Miles, Rate Offered is $ 5500, an average of $2.50 per mile');
        this.backupConversation.push({ type: "Angie", conversation: 'If you Like it, you can say "Book It", or "Make an Offer"' });
        await this.speeck('If you Like it, you can say "Book It", or "Make an Offer"    ');
        this.backupConversation.push({ type: "Angie", conversation: 'Or you can say "Next", and I will tell you about the Next Match. ' });
        await this.speeck('Or you can say "Next", and I will tell you about the Next Match. ');
        this.webSpeech();
        break;
      case 6:
        this.backupConversation.push({ type: "Angie", conversation: 'Sure. How much?' });
        await this.speeck('Sure. How much?');
        this.webSpeech();
        break;
      case 7:
        this.backupConversation.push({ type: "Angie", conversation: 'I am making your offer now, it may take a few seconds while they consider your Offer' });
        await this.speeck('I am making your offer now, it may take a few seconds while they consider your Offer …');
        this.backupConversation.push({ type: "Angie", conversation: `Congratulations!. CH Robinson accepted your offer of the Truck for $ ${this.model.delivery}. I am texting you their Load Number, and Our Load Number.` });
        await this.speeck(`Congratulations!. C H Robinson accepted your offer of the Truck for $ ${this.model.delivery}. I am texting you their Load Number, and Our Load Number.`);
        this.backupConversation.push({ type: "Angie", conversation: 'We make a good team "Juan".' });
        await this.speeck('We make a good team "Juan".')
        this.backupConversation.push({ type: "Angie", conversation: 'Anything else I can do for you?' });
        await this.speeck('Anything else I can do for you?')
        this.webSpeech();
        break;
      case 8:
        this.backupConversation.push({ type: "Angie", conversation: 'This may take a few seconds. We are now looking for the best Fuel Prices along your Route, based on your Contracted Pricing' });
        await this.speeck('This may take a few seconds. We are now looking for the best Fuel Prices along your Route, based on your Contracted Pricing......');
        this.backupConversation.push({ type: "Angie", conversation: 'Done! I just texted you the Link with the Fuel Route' });
        await this.speeck(`Done! I just texted you the Link with the Fuel Route..... `);
        this.backupConversation.push({ type: "Angie", conversation: 'Anything else I can do for you?' });
        await this.speeck('Anything else I can do for you?.....')
        this.webSpeech();
        break;
      case 9:
        this.backupConversation.push({ type: "Angie", conversation: '2, Broker: C H Robinson, Origen is College Park, Georgia, which is 35 miles from your Last Delivery. It is a Reefer Load, Fish, and the destination is Houston, Texas. It has 784 Loaded Miles, and the rate offered is $ 2200, an average of $ 2.80 per mile. ' });
        await this.speeck('2, Broker: C H Robinson, Origen is College Park, Georgia, which is 35 miles from your Last Delivery. It is a Reefer Load, Fish, and the destination is Houston, Texas. It has 784 Loaded Miles, and the rate offered is $ 2200, an average of $ 2.80 per mile. ');
        this.backupConversation.push({ type: "Angie", conversation: 'If you Like it, you can say "Book It", or "Make an Offer"' });
        await this.speeck('If you Like it, you can say "Book It", or "Make an Offer"    ');
        this.backupConversation.push({ type: "Angie", conversation: 'Or you can say "Next", and I will tell you about the Next Match. ' });
        await this.speeck('Or you can say "Next", and I will tell you about the Next Match. ');
        this.webSpeech();
        break;
      case 11: 
        this.backupConversation.push({ type: "Angie", conversation: 'Yes we do have the POD and Lumper Receipt for the Last Delivery in Los Angeles, CA. However, Billing is Pending. Do you want me to take care of the Billing Now?' });
        await this.speeck('Yes we do have the P O D and Lumper Receipt for the Last Delivery in Los Angeles, California. However, Billing is Pending. Do you want me to take care of the Billing Now?');
        this.webSpeech();
        break;
      case 12: 
        this.backupConversation.push({ type: "Angie", conversation: 'Do you have any other charges that you want me to add? I noticed that based on our Geo Fencing Monitoring, we spent 3 hours at the pick up Location and 6 hours at the Delivery. My calculations tell me that you should charge $ 50 for Waiting time at the Pick Up Location and $ 250 for Waiting Time at the Delivery Location. Should I add those charges?' });
        await this.speeck('Do you have any other charges that you want me to add? I noticed that based on our Geo Fencing Monitoring, we spent 3 hours at the pick up Location and 6 hours at the Delivery. My calculations tell me that you should charge $ 50 for Waiting time at the Pick Up Location and $ 250 for Waiting Time at the Delivery Location. Should I add those charges?');
        this.webSpeech();
        break;
      case 13: 
        this.backupConversation.push({ type: "Angie", conversation: 'OK. The Load Confirmation was for $ 5500, plus $ $ 150 for Lumper Fees, and $ 50 Waiting Time at the Pick Up Location, and $ 250 Waiting Time at the Delivery Location. The Invoice Total is now $ 5,950. Please confirm if this sounds correct to you, and I will take care of it right now. Should I proceed?' });
        await this.speeck('OK. The Load Confirmation was for $ 5500, plus $ $ 150 for Lumper Fees, and $ 50 Waiting Time at the Pick Up Location, and $ 250 Waiting Time at the Delivery Location. The Invoice Total is now $ 5,950. Please confirm if this sounds correct to you, and I will take care of it right now. Should I proceed?');
        this.webSpeech();
        break;
      case 14: 
        this.backupConversation.push({ type: "Angie", conversation: 'Done. Can I help you with anything else?' });
        await this.speeck('Done. Can I help you with anything else?');
        this.webSpeech();
        break;
      case 15: 
        this.backupConversation.push({ type: "Angie", conversation: 'I will start working on that. I will monitor all Loads every 15 minutes, and the moment that I find one that you may like, I will text you. OK?' });
        await this.speeck('I will start working on that. I will monitor all Loads every 15 minutes, and the moment that I find one that you may like, I will text you. OK?');
        this.backupConversation.push({ type: "Angie", conversation: 'Done. Can I help you with anything else?' });
        await this.speeck('Done. Can I help you with anything else?');
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
      case -2:
        this.backupConversation.push({ type: "Angie", conversation: "Sorry, I can't find anything" });
        await this.speeck("Sorry, I can't find anything");
        this.backupConversation.push({ type: "Angie", conversation: 'If you Like it, you can say "Book It", or "Make an Offer"' });
        await this.speeck('If you Like it, you can say "Book It", or "Make an Offer"');
        this.backupConversation.push({ type: "Angie", conversation: 'Or you can say "Next", and I will tell you about the Next Match.' });
        await this.speeck('Or you can say "Next", and I will tell you about the Next Match.');
        this.webSpeech();
        break;
    }
  }


  private howCanIHelpYou(data: string) {
    this.backupConversation.push({ type: 'Client', conversation: data });
    if(data.toLowerCase().includes('look for a load') || data.toLowerCase().includes('look for a new load') || data.toLowerCase().includes('find me a load')) {
      this.globalQuestionNumber = 2;
    } else if (data.toLowerCase().includes('pod and') || data.toLocaleLowerCase().includes('lumper receipt')){
      this.globalQuestionNumber = 11;
    } else {
      this.globalQuestionNumber = -1;
    }
    this.TallQuestion();
  }

  private youCanSay(data: string) {
    this.backupConversation.push({ type: 'Client', conversation: data });
    if(data.toLowerCase().includes("next match")) {
      this.globalQuestionNumber = 9;
    } else if (data.toLowerCase().includes("make an offer")) {
      this.globalQuestionNumber = 6;
    } else {
      this.globalQuestionNumber = -2;
    }
    this.TallQuestion();
  }

  private anythingElseCanIHelpYou(data: string) {
    this.backupConversation.push({ type: 'Client', conversation: data });
    if(data.toLowerCase().includes("no") || data.toLowerCase().includes("no thanks") || data.toLowerCase().includes("no thank you")) {
      this.globalQuestionNumber = 100;
      this.TallQuestion();
    } else if(data.toLowerCase().includes("make me the fuel route")) {
      this.globalQuestionNumber = 8;
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
