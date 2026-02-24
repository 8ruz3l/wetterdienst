import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiRainfallGraphComponent } from '../components/ui-rainfall-graph/ui-rainfall-graph.component';
import { APP_CONFIG, app_config } from '../config/config';
import { TemperatureWidgetComponent } from 'src/components/temperature-widget/temperature-widget.component';
import { NavbarComponent } from 'src/components/navbar/navbar.component';
import { DashboardPageComponent } from 'src/containers/dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiRainfallGraphComponent,
    TemperatureWidgetComponent,
    NavbarComponent,
    DashboardPageComponent
  ],
  providers: [{ provide: APP_CONFIG, useValue: app_config }],
  bootstrap: [AppComponent]
})
export class AppModule { }

