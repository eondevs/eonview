import { Component } from '@angular/core';
import { FilesManagingService } from '../../../../services/filesManaging.service';
import { RemoteControlService } from '../../../../services/remoteControl.service';
import { NotificationsService } from '../../../../services/notifications.service';
import { ConfigsParsingService } from '../../../../services/files/configsParsing.service';

@Component({
  templateUrl: 'src/angular/components/online/configuration/subConfigEditor/subConfigEditor.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class SubConfigEditorComponent {
  constructor(
    private filesManagingService: FilesManagingService,
    private remoteControlService: RemoteControlService,
    private notificationsService: NotificationsService,
    private configsParsingService: ConfigsParsingService
  ) { }

  private isLoading = true;
  private displayWarning = false;

  //Data
  private availableStrategies: any = [];
  private usedStrategies: any = [];

  private subConfig: any;
  private importableSubConfigs = [];
  private selectedSubConfigToImport: String;

  //Currencies
  private pairs = [];
  private markets: any = {};
  private candles = [];

  //Sorting currrencies
  private filterName: String = "";
  private sortBy: String = "baseCurrency";
  private selectedMarket: String;

  //File managing
  private exportOptions = ['To bot', 'To file'];
  private selectedExportOption: String = "To bot";
  private exportLocation: String;

  private importOptions = ['From bot', 'From local folder'];
  private selectedImportOption: String = "From bot";
  private importLocation: String;
  private importFileName: String;

  private fileLocationDesc: String;

  private selectedStrategy: any = {};

  private ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.pairs = this.remoteControlService.retrievePairs();
    this.markets = this.remoteControlService.retrieveMarketAssets();
    this.candles = this.remoteControlService.retrieveIntervals();
    this.selectedMarket = (this.markets.includes("BTC")) ? "BTC" : this.markets[0];
    this.remoteControlService.retrieveConfigSummary().subscribe(data => {
      this.availableStrategies = data.strategies;
      this.importableSubConfigs = data.subConfigs;
      if (data.subConfigs.length > 0) {
        this.selectedSubConfigToImport = this.importableSubConfigs[0];
        this.importSub();
      }
    });
  }

  private loadStrategiesData() {
    this.availableStrategies = this.availableStrategies.concat(this.usedStrategies);
    this.usedStrategies = this.subConfig.data.pairsConfig.strategies;
    for (let strategy of this.usedStrategies) {
      let index = this.availableStrategies.indexOf(strategy)
      this.availableStrategies.splice(index, 1);
    }
  }

  private addStrategy(index) {
    this.usedStrategies.push(this.availableStrategies[index]);
    this.availableStrategies.splice(index, 1);
  }

  private removeStrategy(index) {
    this.availableStrategies.push(this.usedStrategies[index]);
    this.usedStrategies.splice(index, 1);
  }

  private selectSubConfig(i) {
    this.selectedSubConfigToImport = this.importableSubConfigs[i];
  }

  private exportLocationChange(event) {
    this.exportLocation = event.srcElement.files[0].path;
  }

  private importLocationChange(event) {
    this.importLocation = event.srcElement.files[0].path;
    this.importFileName = event.srcElement.files[0].name;
  }

  private checkPairs() {
    for (let pair of this.pairs) {
      if (this.subConfig.data.pairs.includes(pair.baseAsset + "_" + pair.counterAsset)) pair.checked = true;
      else pair.checked = false;
    }
  }

  private importSub() {
    this.isLoading = true;
    if (this.selectedImportOption == 'From local folder') {
      let temp = this.filesManagingService.loadCustomFile(this.importLocation);
      if (temp.status == "OK") {
        let response = this.configsParsingService.parseSub(temp.file, this.candles, this.usedStrategies.concat(this.availableStrategies), this.pairs);
        if (response.status == "OK") {
          this.subConfig = {};
          this.subConfig.data = temp.file;
          this.subConfig.name = this.importFileName.split('-')[0];
          this.fileLocationDesc = "Imported sub config from : " + this.importLocation + ".";
          this.notificationsService.sendMessage("Successfully imported sub config from : " + this.importLocation + ".");
          this.displayWarning = true;
          this.checkPairs();
          this.loadStrategiesData();
        }
        else {
          this.notificationsService.sendMessage(response.message, "error");
        }
      }
      else {
        this.notificationsService.sendMessage(temp.message, "error");
      }
      this.isLoading = false;
    }
    else {
      this.remoteControlService.retrieveConfigSummary().subscribe(
        data => {
          this.importableSubConfigs = data.subConfigs;
          this.availableStrategies = data.strategies;
          if (data.subConfigs.length > 0 && data.subConfigs.includes(this.selectedSubConfigToImport)) {
            this.remoteControlService.retrieveSubconfig(this.selectedSubConfigToImport + "-sub").subscribe(
              sub => {
                this.subConfig = {};
                this.subConfig.data = sub;
                this.subConfig.name = this.selectedSubConfigToImport;
                this.fileLocationDesc = "Sub config from the bot directory.";
                this.notificationsService.sendMessage("Successfully imported sub config from the bot's directory!");
                this.checkPairs();
                this.loadStrategiesData();
                this.isLoading = false;
              },
              err => {
                this.notificationsService.sendMessage(err.json().error, "error");
                this.isLoading = false;
              }
            );
          }
          else {
            this.notificationsService.sendMessage("Such config wasn't found in bots directory.", "error");
            this.isLoading = false;
          }
        }
      );
    }
  }

  private createDefaultSubConfig() {
    this.isLoading = true;
    this.remoteControlService.retrieveConfigSummary().subscribe(data => {
      this.importableSubConfigs = data.subConfigs;
      this.availableStrategies = data.strategies;
      let subConf = {
        name: "DefaultSub#" + this.importableSubConfigs.length,
        data: {
          active: true,
          pairs: [],
          pairsConfig: {
            candleInterval: 300,
            orderHistoryDayCount: 20,
            strategies: [],
            cancelOpenOrders: true,
            openOrdersLifespan: 30
          }
        }
      };
      this.fileLocationDesc = "Default sub config;";
      this.displayWarning = true;
      this.subConfig = subConf;
      this.isLoading = false;
    });
  }

  private exportSub() {
    this.subConfig.data.pairs = [];
    this.subConfig.data.pairsConfig.strategies = this.usedStrategies;
    this.subConfig.data.pairsConfig.candleInterval = parseInt(this.subConfig.data.pairsConfig.candleInterval);
    for (let pair of this.pairs) {
      if (pair.checked) {
        this.subConfig.data.pairs.push(pair.baseAsset + "_" + pair.counterAsset);
      }
    }
    if (this.selectedExportOption == 'To file') {
      let response = this.filesManagingService.uploadCustomFile(this.exportLocation + "/" + this.subConfig.name + "-sub.json", this.subConfig.data);
      if (response.status == "OK") {
        this.fileLocationDesc = "Imported sub config from : " + this.exportLocation + ".";
        this.notificationsService.sendMessage("Successfully exported sub config to : " + this.exportLocation + ".");
      }
      else this.notificationsService.sendMessage(response.message, "error");
    }
    else {
      this.remoteControlService.uploadSubconfig(this.subConfig.name + "-sub", this.subConfig.data).subscribe(
        data => {
          this.importableSubConfigs.push(this.subConfig.name);
          this.fileLocationDesc = "Imported sub config directly from bot.";
          this.notificationsService.sendMessage("Successfully exported sub config directly to the bot.");
        },
        error => {
          this.notificationsService.sendMessage(error.json().error, "error");
        }
      );
    }
  }
}
