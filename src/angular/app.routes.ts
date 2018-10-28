import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainOnlineComponent } from './components/online/mainOnline.component';
import { MainOfflineComponent } from './components/offline/mainOffline.component';

import { ConfigurationComponent } from './components/online/configuration/configuration.component';
import { MainConfigEditorComponent } from './components/online/configuration/mainConfigEditor/mainConfigEditor.component';
import { ApiKeysEditorComponent } from './components/online/configuration/apiKeysEditor/apiKeysEditor.component';
import { SubConfigEditorComponent } from './components/online/configuration/subConfigEditor/subConfigEditor.component';
import { RemoteControlSettingsEditorComponent } from './components/online/configuration/remoteControlSettingsEditor/remoteControlSettingsEditor.component';

import { NotificationsComponent } from './components/service/notifications/notifications.component';

import { CurrenciesInfoComponent } from './components/online/currenciesInfo/currenciesInfo.component';

import { StrategiesEditorComponent } from './components/online/strategiesConfiguration/strategiesEditor.component';

import { DataLoaderService } from './services/dataLoader.service';

import { ConfigsParsingService } from './services/files/configsParsing.service';

import { FilesManagingService } from './services/filesManaging.service';
import { NotificationsService } from './services/notifications.service';
import { RemoteControlService } from './services/remoteControl.service';

import { PairsSorting } from './pipes/pairsSorting.pipe';


export const routingComponentsProviders = [FilesManagingService, RemoteControlService, NotificationsService, DataLoaderService, ConfigsParsingService]
export const routingComponents = [MainOnlineComponent, MainOfflineComponent, StrategiesEditorComponent, PairsSorting, NotificationsComponent, CurrenciesInfoComponent, ApiKeysEditorComponent, ConfigurationComponent, MainConfigEditorComponent, SubConfigEditorComponent, RemoteControlSettingsEditorComponent];

const routes: Routes = [
  { path: 'offlineRoute', component: MainOfflineComponent },
  {
    path: 'onlineRoute', component: MainOnlineComponent, children: [
      {
        path: 'configurationRoute', component: ConfigurationComponent,
        children: [
          { path: 'apiKeysEditorRoute', component: ApiKeysEditorComponent },
          { path: 'mainConfigEditorRoute', component: MainConfigEditorComponent },
          { path: 'subConfigsEditorRoute', component: SubConfigEditorComponent },
          { path: 'remoteControlSettingsEditorRoute', component: RemoteControlSettingsEditorComponent },
          { path: '**', redirectTo: 'authenticationEditorRoute' }
        ]
      },
      {
        path: 'strategiesEditorRoute', component: StrategiesEditorComponent
      },
      {
        path: 'currenciesInfoRoute', component: CurrenciesInfoComponent
      },
      { path: '**', redirectTo: 'appSettingsRoute' }
    ]
  },
  { path: '**', redirectTo: 'offlineRoute' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }