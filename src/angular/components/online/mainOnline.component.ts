import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { RemoteControlService } from '../../services/remoteControl.service';

@Component({
  templateUrl: 'src/angular/components/online/mainOnline.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class MainOnlineComponent {

  constructor(
    private router: Router,
    private notificationService: NotificationsService,
    private remoteControlService: RemoteControlService
  ) { }

  //Possible Navigation Tabs
  private sideBarOptionList = [
    { name: "Configuration", route: "onlineRoute/configurationRoute", id: 'configurationID' },
    { name: "Strategies Lab", route: "onlineRoute/strategiesEditorRoute", id: 'strategiesEditorID' },
    { name: "Statistics", route: "onlineRoute/currenciesInfoRoute", id: 'statsID' }
  ];

  //Navigation Bar Values
  private selectedElement: any = {};
  private openRC = false;
  private address;
  private state;

  private ngOnInit() {
    this.notificationService.sendMessage("Successfully logged in!");
    this.onSelect(this.sideBarOptionList[0]);
    this.address = this.remoteControlService.getAddress();
    this.remoteControlService.retrieveBotState().subscribe(data => {
      this.state = data.state;
    }, err => {
      this.notificationService.sendMessage(err.json().error, "error");
    });
  }

  private toggleRC() {
    this.openRC = !this.openRC;
  }

  private logOff() {
    this.router.navigate(["offlineRoute"]);
    this.notificationService.sendMessage("You have been successfully logged off!");
  }

  private performRCAction(type) {
    switch (type) {
      case "start":
        this.remoteControlService.startBot(false, false).subscribe(data => {
          console.log(data);
        });
        break;
      case "restart":
        this.remoteControlService.restartBot(false, false).subscribe(data => {
          console.log(data);
        });
        break;
      case "stop":
        this.remoteControlService.stopBot(false, false, false).subscribe(data => {
          console.log(data);
        });
        break;
    }
  }

  private onSelect(sideBarListElement: any = {}): void {
    this.selectedElement = sideBarListElement;
    this.router.navigate([this.selectedElement.route]);
  }
}
