import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'src/angular/app.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class AppComponent {

  constructor(
  ) { }

  private electron = System._nodeRequire('electron');

  private takeAppAction(action) {
    if (action == "exit") {
      this.electron.remote.app.exit(0)
    }
    if (action == "minimize") {
      this.electron.remote.BrowserWindow.getFocusedWindow().minimize();
    }
    if (action == "maximize") {
      this.electron.remote.BrowserWindow.getFocusedWindow().maximize();
    }
  }
}
