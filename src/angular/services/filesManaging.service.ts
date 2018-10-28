import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class FilesManagingService {

  constructor(
  ) { }

  //Required node-modules
  private fs = System._nodeRequire('fs');
  private appSettings: any = {}

  getLoadedAppSettings() {
    return this.appSettings;
  }

  uploadAppSettings(appSettings) {
    this.appSettings = appSettings;
    this.uploadCustomFile('./src/resources/requiredFiles/app-settings.json', appSettings);
  }

  async loadFiles() {
    let that = this;
    this.appSettings = this.loadCustomFile('./src/resources/requiredFiles/app-settings.json').file;
    return;
  }

  loadCustomFile(fullPath) {
    try {
      let temp = JSON.parse(this.fs.readFileSync(fullPath, 'UTF-8'));
      return { status: "OK", file: temp };
    }
    catch (err) {
      return { status: "ERR", message: "Invalid file format." };
    }
  }

  uploadCustomFile(fullPath, file) {
    try {
      let temp = this.fs.writeFileSync(fullPath, JSON.stringify(file, null, 2));
      return { status: "OK", file: temp };
    }
    catch (err) {
      return { status: "ERR", message: "Something went wrong when trying to upload the file." };
    }
  }
}
