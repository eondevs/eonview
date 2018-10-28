import { Component } from '@angular/core';
import { FilesManagingService } from '../../../../services/filesManaging.service';
import { RemoteControlService } from '../../../../services/remoteControl.service';
import { ConfigsParsingService } from '../../../../services/files/configsParsing.service';
import { NotificationsService } from '../../../../services/notifications.service';

@Component({
  templateUrl: 'src/angular/components/online/configuration/remoteControlSettingsEditor/remoteControlSettingsEditor.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})

export class RemoteControlSettingsEditorComponent {

  constructor(
    private filesManagingService: FilesManagingService,
    private remoteControlService: RemoteControlService,
    private configsParsingService: ConfigsParsingService,
    private notificationsService: NotificationsService
  ) { }

  private isLoading = true;

  //Required files
  private remote: any = {}

  //File managing
  private exportOptions = ['To bot', 'To file'];
  private selectedExportOption: String = "To bot";
  private exportLocation: String;

  private importOptions = ['From bot', 'From local folder'];
  private selectedImportOption: String = "From bot";
  private importLocation: String;

  private fileLocationDesc: String = "UNDEFINED";

  private ngOnInit() {
    this.importRC();
  }

  private exportLocationChange(event) {
    this.exportLocation = event.srcElement.files[0].path;
  }

  private importLocationChange(event) {
    this.importLocation = event.srcElement.files[0].path;
  }

  private importRC() {
    this.isLoading = true;
    if (this.selectedExportOption == 'From local folder') {
      let temp = this.filesManagingService.loadCustomFile(this.importLocation);
      if (temp.status == "OK") {
        let response = this.configsParsingService.parseRC(temp.file)
        if (response.status == "OK") {
          this.remote = temp.file;
          this.fileLocationDesc = "Imported remote config from : " + this.importLocation + ".";
          this.notificationsService.sendMessage("Successfully imported remote config from : " + this.importLocation + ".");
        }
        else {
          this.notificationsService.sendMessage(response.message);
        }
      }
      else this.notificationsService.sendMessage(temp.message, "error");
      this.isLoading = false;
    }
    else {
      this.remoteControlService.retrieveConfigSummary().subscribe(
        data => {
          if (data.remote) {
            this.remoteControlService.retrieveRemote().subscribe(
              data => {
                this.remote = data;
                this.fileLocationDesc = "Imported remote config directly from bot.";
                this.notificationsService.sendMessage("Successfully imported remote config directly from bot.");
                this.isLoading = false;
              },
              err => {
                err = err.json();
                this.notificationsService.sendMessage(err.error);
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
                this.notificationsService.sendMessage("Remote config file wasn't found in bots directory. The default version of Remote file has been loaded.", "error");
                this.fileLocationDesc = "Default remote config.";
                this.isLoading = false;
              }
            );
          }
          else {
            this.notificationsService.sendMessage("Remote config file wasn't found in bots directory. The default version of Remote file has been loaded.", "error");
            this.fileLocationDesc = "Default remote config.";
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
            this.isLoading = false;
          }
        }
      );
    }
  }

  private exportRC() {
    if (this.selectedExportOption == 'To file') {
      let response = this.filesManagingService.uploadCustomFile(this.exportLocation + "/remote.json", this.remote);
      if (response.status == "OK") {
        this.fileLocationDesc = "Imported remote config from : " + this.exportLocation + ".";
        this.notificationsService.sendMessage("Successfully exported remote config to : " + this.exportLocation + ".");
      }
      else this.notificationsService.sendMessage(response.message, "error");
    }
    else {
      this.remoteControlService.uploadRemote(this.remote).subscribe(
        data => {
          this.fileLocationDesc = "Imported remote config directly from bot.";
          this.notificationsService.sendMessage("Successfully exported remote config directly to the bot.");
        },
        err => {
          this.notificationsService.sendMessage(err.json().error, "error");
        }
      );
    }
  }
}
