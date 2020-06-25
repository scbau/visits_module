/*
ng build --prod --base-href https://scbau.github.io/dashboard/
ngh --dir=dist/visits-app --repo=https://github.com/scbau/dashboard.git
*/


import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { MainviewComponent } from './modules/mainview/mainview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './shared/material.module';
// import { MatTableDataSource } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { ChartsModule } from 'ng2-charts';
// import { OverlayModule } from '@angular/cdk/overlay'

// for local data
import { InMemoryDataService } from './services/in-memory/in-memory-data.service';
import { InMemoryDataListService } from './services/in-memory/in-memory-datalist.service';

import { PersistenceService } from './services/persistence/persistence.service';

import { VisitService } from './services/visit/visit.service';
import { ChecklistService } from './services/checklist/checklist.service';

import { DownloadComponent } from './modules/download/download.component';
import { LandingComponent } from './modules/landing/landing.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotVisitedComponent } from './modules/notvisited/not.visited.component';
import { ChecklistComponent } from './modules/checklist/checklist.component';
import { VSRChecklistComponent } from './modules/checklist/vsr.checklist.component';
import { ForkliftChecklistComponent } from './modules/checklist/forklift.checklist.component';
import { WarehouseChecklistComponent } from './modules/checklist/warehouse.checklist.component';
import { SettingsComponent } from './modules/settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MainviewComponent,
    DownloadComponent,
    LandingComponent,
    DashboardComponent,
    NotVisitedComponent,
    ChecklistComponent,
    WarehouseChecklistComponent,
    ForkliftChecklistComponent,
    VSRChecklistComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ChartsModule,
    /*HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataListService, { dataEncapsulation: false }
    ),*/
    MaterialModule,
    // OverlayModule,
    // MatTableDataSource,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [ 
    VisitService,
    ChecklistService, {
    provide: APP_INITIALIZER,
    useFactory: (persistenceService: PersistenceService) => () => persistenceService.connect(),
    deps: [PersistenceService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
