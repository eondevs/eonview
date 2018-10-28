import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RemoteControlService } from '../../services/remoteControl.service';
import { FilesManagingService } from '../../services/filesManaging.service';
import { DataLoaderService } from '../../services/dataLoader.service';

@Component({
  templateUrl: 'src/angular/components/offline/mainOffline.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class MainOfflineComponent {

  constructor(
    private router: Router,
    private dataLoaderService: DataLoaderService,
    private filesManagingService: FilesManagingService,
    private remoteControlService: RemoteControlService
  ) { }

  private connectionErrorMessage: String;

  //Files
  private settings: any = {};
  private remote: any = {};

  private saveLocation: String;
  private loadingApp: Boolean = true;

  private ngOnInit() {
    this.dataLoaderService.loadData().then(data => {
      let temp = this.filesManagingService.getLoadedAppSettings();
      this.settings = temp;
      this.loadingApp = false;
    });
    this.remote = {
      exchangeDriverAddress: "127.0.0.1",
      internal: {
        username: "",
        password: ""
      },
      telegram: {
        enable: true,
        token: "",
        owner: ""
      }
    }
  }

  private connect() {
    this.loadingApp = true;
    this.remoteControlService.connect(this.settings.remoteControl.username, this.settings.remoteControl.password, this.settings.remoteControl.address, this.settings.remoteControl.port).subscribe(
      data => {
        this.remoteControlService.loadExchangeData();
        if (this.settings.remoteControl.rememberCred) {
          this.filesManagingService.uploadAppSettings(this.settings);
        }
        this.router.navigate(["onlineRoute"]);
      },
      err => {
        err = err.json();
        this.connectionErrorMessage = err.error;
        this.loadingApp = false;
      }
    );
  }

  private pathChange(event) {
    this.saveLocation = event.srcElement.files[0].path;;
  }

  private exportRC() {
    this.filesManagingService.uploadCustomFile(this.saveLocation + '/remote.json', this.remote);
  }
}
