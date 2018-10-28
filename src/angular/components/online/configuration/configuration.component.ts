import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'src/angular/components/online/configuration/configuration.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class ConfigurationComponent {
  constructor(
    private router: Router,
  ) { }

  //Navigation bar
  private navBarOptionList = [
    { name: "API Keys", route: "/onlineRoute/configurationRoute/apiKeysEditorRoute" },
    { name: "Main Config", route: "/onlineRoute/configurationRoute/mainConfigEditorRoute" },
    { name: "Sub Configs", route: "/onlineRoute/configurationRoute/subConfigsEditorRoute" },
    { name: "Remote Control Config", route: "/onlineRoute/configurationRoute/remoteControlSettingsEditorRoute" }
  ];
  private selectedElement: any = {};

  private ngOnInit() {
    this.onSelect(this.navBarOptionList[0])
  }

  private onSelect(navBarListElement) {
    this.selectedElement = navBarListElement;
    this.router.navigate([this.selectedElement.route]);
  }
}
