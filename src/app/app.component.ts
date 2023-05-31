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

  async webSpeech(): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.webSpeechSubscription = this.webSpeechService.start().subscribe((data: any) => {
        if(data.type === 'tag') {
          console.log('WebSpeechAPI: ' + JSON.stringify(data));
          resolve(data);
        }
      }, error => {
          reject(error);
      })
    });
  }

  async noSpeeckTall(){
    await this.speeck("I'm sorry, you have not said anything, the question will be asked again");
  }

  async TallInstructions(){
    this.backupConversation.push({ type: "Angie", conversation:'Hi, I am Angie, an SOS Virtual Dispatcher'});
    await this.speeck("  Hi, I am Angie, an SOS Virtual Dispatcher....");
    this.backupConversation.push({ type: "Angie", conversation: 'How can i help You ?' });
    await this.speeck('...   How can i help You ?');
    const response = await this.webSpeech();
    this.stopWebSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });

    await this.UpdateLoad(response.value);
  }

  async UpdateLoad(sentence: string) {
    const keywords = ["update", "load"];

    const matches = this.keywordCount(sentence, keywords);

    if(matches > 0) {
      await this.getTruckNumber();
    }else {
      this.backupConversation.push({ type: "Angie", conversation:"I'm sorry, you have not said anything, the question will be asked again"});
      this.backupConversation.push({ type: "Angie", conversation:'How can i help You ?'});
      await this.speeck("I'm sorry, you have not said anything, the question will be asked again");
      await this.speeck('How can i help You ?');
      const response = await this.webSpeech();
      this.stopWebSpeech();
      this.backupConversation.push({ type: 'Client', conversation: response.value });
      await this.UpdateLoad(response.value)
    }
  }

  async getTruckNumber() {
    this.backupConversation.push({ type: "Angie", conversation: 'Tell me the truck number' });
    await this.speeck("Tell me the truck number.....");
    const response = await this.webSpeech();
    this.stopWebSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });

    this.validateTruckNumber(response.value);
  }

  async validateTruckNumber(sentence: string) {
    const truckNumber = this.extractTruckNumber(sentence);
    console.log(truckNumber);
    if(truckNumber == null) {
      this.backupConversation.push({ type: "Angie", conversation: 'Please repeat the truck number again' });
      await this.speeck("  Please repeat the truck number again.....");
      const response = await this.webSpeech();
      this.stopWebSpeech();
      this.backupConversation.push({ type: 'Client', conversation: response.value });
      await this.validateTruckNumber(response.value);
    } else {
      await this.getLoadInformation(truckNumber);
    }
  }

  async getLoadInformation(truckNumber: string) {
    this.backupConversation.push({ type: "Angie", conversation: 'Looking for information about the last load, please wait a moment.' });
    await this.speeck("  Looking for information about the last load, please wait a moment.....");
    
    await this.readLoadInformation();
  }

  async readLoadInformation() {
    this.backupConversation.push({ type: "Angie", conversation: 'We do have the POD and Lumper Receipt for the Last Delivery in Los Angeles, CA. However, Billing is Pending. Do you want me to take care of the Billing Now?' });
    await this.speeck("  We do have the POD and Lumper Receipt for the Last Delivery in Los Angeles, CA. However, Billing is Pending. Do you want me to take care of the Billing Now?.....");
    
    const response = await this.webSpeech();
    this.stopWebSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });
    await this.validateLoadInformation(response.value);

  }

  async validateLoadInformation(sentence: string) {
    const keywordsNegative = ["no"];
    const keywordsPositive = ["yes"]

    const matchesNegative = this.keywordCount(sentence, keywordsNegative);

    if(matchesNegative > 0) {
      await this.showNegativeResponse()
      return;
    }
      

    const matchesPositive = this.keywordCount(sentence, keywordsPositive);

    if(matchesPositive > 0) {
      await this.validatingForOtherActions();
    } else {
      this.backupConversation.push({ type: "Angie", conversation: "I'm sorry, you have not said anything, can you repeat your answer" });
      await this.speeck("I'm sorry, you have not said anything, can you repeat your answer");
      const response = await this.webSpeech();
      this.stopWebSpeech();
      this.validateLoadInformation(response.value)
    }

  }


  async showNegativeResponse() {
    this.backupConversation.push({ type: "Angie", conversation: 'It was a pleasure to help you, if you need anything else do not hesitate to press the help button.' });
    await this.speeck("  It was a pleasure to help you, if you need anything else do not hesitate to press the help button......");
  }



  keywordCount(sentence: string, keywords: string[]): number {
    const words = sentence.toLowerCase().split(' ');
    const keywordMatches = words.filter(word => keywords.includes(word));
    return keywordMatches.length;
  }

  extractTruckNumber(sentence: string): string | null {
    const match = sentence.match(/ ((\d+\s*)+)/i);
    return match ? match[1].replace(/\s+/g, '') : null;
  }

  async validatingForOtherActions() {
    this.backupConversation.push({ type: "Angie", conversation: 'If you need to add a charge tell me add, if you need to bill tell me bill.' });
    await this.speeck("If you need to add a charge tell me add the amount for the name of the charge, if you need to bill tell me bill the load.");
    const response = await this.webSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });
    this.stopWebSpeech();

    if(response.value.includes('add')){
      await this.nameOfCharge();
      return;
    }

    if(response.value.includes('bill')) {
      await this.bill();
      return;
    }

    this.backupConversation.push({ type: "Angie", conversation: "I'm sorry I don't understand your answer" });
    await this.speeck("I'm sorry I don't understand your answer");
    this.validatingForOtherActions();
  }

  async nameOfCharge() {
    this.backupConversation.push({ type: "Angie", conversation: "Please tell me the name of the charge you want to add." });
    await this.speeck("Please tell me the name of the charge you want to add.");
    const response = await this.webSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });
    this.stopWebSpeech();

    if(response.value.length > 0) {
      this.valueOfCharge();
     return; 
    }

    this.backupConversation.push({ type: "Angie", conversation: "I'm sorry I don't understand your answer" });
    await this.speeck("I'm sorry I don't understand your answer");
    this.nameOfCharge();

  }

  async valueOfCharge() {
    this.backupConversation.push({ type: "Angie", conversation: "Tell me the value of the charge" });
    await this.speeck("Tell me the value of the charge");
    const response = await this.webSpeech();
    this.backupConversation.push({ type: 'Client', conversation: response.value });
    this.stopWebSpeech();

    const truckNumber = this.extractTruckNumber(response.value);
    
    if(truckNumber === null) {
      this.backupConversation.push({ type: "Angie", conversation: "I'm sorry I don't understand your answer" });
      await this.speeck("I'm sorry I don't understand your answer");
      this.valueOfCharge();
    }
    
    await this.validatingForOtherActions();
  }

  async bill() {
    this.backupConversation.push({ type: "Angie", conversation: "We will process your order" });
    await this.speeck("We will process your order");
    this.backupConversation.push({ type: "Angie", conversation: 'It was a pleasure to help you, if you need anything else do not hesitate to press the help button.' });
    await this.speeck("  It was a pleasure to help you, if you need anything else do not hesitate to press the help button......");
  }

  async help(){
    this.TallInstructions();
  }

}
