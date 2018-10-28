import { Component } from '@angular/core';
import { FilesManagingService } from '../../../../services/filesManaging.service';
import { RemoteControlService } from '../../../../services/remoteControl.service';
import { ConfigsParsingService } from '../../../../services/files/configsParsing.service';
import { NotificationsService } from '../../../../services/notifications.service';

@Component({
  templateUrl: 'src/angular/components/online/configuration/apiKeysEditor/apiKeysEditor.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css', 'src/resources/styleSheets/css/pages/authConfigEditor.css']
})

export class ApiKeysEditorComponent {
  constructor(
    private filesManagingService: FilesManagingService,
    private notificationsService: NotificationsService,
    private configsParsingService: ConfigsParsingService,
    private remoteControlService: RemoteControlService
  ) { }
  private isLoading = true;

  //Required files
  private apiKeys: any = [];

  //File managing
  private exportOptions = ['To bot', 'To file'];
  private selectedExportOption: String = "To bot";
  private exportLocation: String;

  private importOptions = ['From bot', 'From local folder'];
  private selectedImportOption: String = "From bot";
  private importLocation: String;

  private ngOnInit() {
    this.importApiKeys();
  }

  private exportLocationChange(event) {
    this.exportLocation = event.srcElement.files[0].path;
  }

  private importLocationChange(event) {
    this.importLocation = event.srcElement.files[0].path;
  }

  private importApiKeys() {
    this.isLoading = true;
    if (this.selectedExportOption == 'From local folder') {
      let temp = this.filesManagingService.loadCustomFile(this.importLocation);
      if (temp.status == "OK") {
        let response = this.configsParsingService.parseApiKeys(temp.file)
        if (response.status == "OK") {
          this.apiKeys = temp.file;
          this.notificationsService.sendMessage("Successfully imported api keys from : " + this.importLocation + ".");
        }
        else {
          this.notificationsService.sendMessage(response.message);
        }
      }
      else {
        this.notificationsService.sendMessage(temp.message);
      }
      this.isLoading = false;
    }
    else {
      this.remoteControlService.retrieveAPI().subscribe(
        data => {
          this.apiKeys = data;
          this.notificationsService.sendMessage("Successfully imported api keys directly from bot.");
          this.isLoading = false;
        },
        err => {
          this.notificationsService.sendMessage(err.json().error, "error");
        }
      );
    }
  }


  private exportApiKeys() {
    if (this.selectedExportOption == 'To file') {
      let response = this.filesManagingService.uploadCustomFile(this.exportLocation + "/apiKeys.json", this.apiKeys);
      if (response.status == "OK") this.notificationsService.sendMessage("Successfully exported api keys to : " + this.exportLocation + ".");
      else this.notificationsService.sendMessage(response.message, "error");
    }
    else {
      this.remoteControlService.updateAPI(this.apiKeys).subscribe(
        data => {
          this.notificationsService.sendMessage("Successfully exported api keys directly to bot.");
        }, err => {
          this.notificationsService.sendMessage(err.json().error, "error");
        }
      );
    }
  }
}
