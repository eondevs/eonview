import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents, routingComponentsProviders } from './app.routes';


@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpModule],
  declarations: [AppComponent, routingComponents],
  providers: [routingComponentsProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
