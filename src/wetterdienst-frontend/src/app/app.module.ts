import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UiRainfallGraphComponent } from './ui-rainfall-graph/ui-rainfall-graph.component';
import { APP_CONFIG, app_config } from './config';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UiRainfallGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [{ provide: APP_CONFIG, useValue: app_config }],
  bootstrap: [AppComponent]
})
export class AppModule { }
