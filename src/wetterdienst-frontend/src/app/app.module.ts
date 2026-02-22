import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { UiRainfallGraphComponent } from '../components/ui-rainfall-graph/ui-rainfall-graph.component';
import { APP_CONFIG, app_config } from './config';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiRainfallGraphComponent
  ],
  providers: [{ provide: APP_CONFIG, useValue: app_config }],
  bootstrap: [AppComponent]
})
export class AppModule { }
