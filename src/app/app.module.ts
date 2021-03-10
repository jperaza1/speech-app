import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { WebSpeechService } from './services/web-speech.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgAudioRecorderModule } from 'ng-audio-recorder';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AlertDialogComponent,
    AlertDialogComponent
  ],
  entryComponents: [AlertDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    NgAudioRecorderModule,
    HttpClientModule
  ],
  providers: [WebSpeechService],
  bootstrap: [AppComponent],
})
export class AppModule { }
