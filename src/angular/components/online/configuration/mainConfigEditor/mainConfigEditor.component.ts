import { Component } from '@angular/core';
import { FilesManagingService } from '../../../../services/filesManaging.service';
import { RemoteControlService } from '../../../../services/remoteControl.service';
import { ConfigsParsingService } from '../../../../services/files/configsParsing.service';
import { NotificationsService } from '../../../../services/notifications.service';

@Component({
  templateUrl: 'src/angular/components/online/configuration/mainConfigEditor/mainConfigEditor.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css', 'src/resources/styleSheets/css/pages/currenciesInfo.css', 'src/resources/styleSheets/css/pages/mainConfigEditor.css']
})

export class MainConfigEditorComponent {

  constructor(
    private filesManagingService: FilesManagingService,
    private remoteControlService: RemoteControlService,
    private configsParsingService: ConfigsParsingService,
    private notificationsService: NotificationsService
  ) { }

  private isLoading = true;

  //Required files
  private main: any = {};

  //Data
  private pairs = [];
  private markets: any = [];
  private candles = [];

  private availableStrategies: any = [];
  private usedStrategies: any = [];

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

  private fileLocationDesc: String = "UNDEFINED";

  private ngOnInit() {
    this.importMain();
  }

  private loadData() {
    this.pairs = this.remoteControlService.retrievePairs();
    this.markets = this.remoteControlService.retrieveMarketAssets();
    this.candles = this.remoteControlService.retrieveIntervals();
    this.selectedMarket = (this.markets.includes("BTC")) ? "BTC" : this.markets[0];
  }

  private exportLocationChange(event) {
    this.exportLocation = event.srcElement.files[0].path;
  }

  private importLocationChange(event) {
    this.importLocation = event.srcElement.files[0].path;
  }

  private checkPairs() {
    for (let pair of this.pairs) {
      if (this.main.botConfig.activePairs.includes(pair.baseAsset + "_" + pair.counterAsset)) pair.checked = true;
      else pair.checked = false;
    }
  }

  private loadStrategiesData() {
    this.availableStrategies = this.availableStrategies.concat(this.usedStrategies);
    this.usedStrategies = this.main.pairsConfig.strategies;
    for (let strategy of this.usedStrategies) {
      let index = this.availableStrategies.find(strat => strat == strategy)
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

  private importMain() {
    this.isLoading = true;
    if (this.selectedExportOption == 'From local folder') {
      let temp = this.filesManagingService.loadCustomFile(this.importLocation);
      if (temp.status == "OK") {
        let response = this.configsParsingService.parseMain(temp.file, this.candles, this.usedStrategies.concat(this.availableStrategies), this.pairs);
        if (response.status == "OK") {
          this.main = temp.file;
          this.fileLocationDesc = "Imported main config from : " + this.importLocation + ".";
          this.notificationsService.sendMessage("Successfully imported main config from : " + this.importLocation + ".");
          this.checkPairs();
        }
        else {
          this.notificationsService.sendMessage(response.message, "error");
        }
      }
      else this.notificationsService.sendMessage(temp.message, "error");
      this.isLoading = false;
    }
    else {
      this.remoteControlService.retrieveConfigSummary().subscribe(
        data => {
          this.availableStrategies = data.strategies;
          if (data.main) {
            this.remoteControlService.retrieveMain().subscribe(
              main => {
                this.main = main;
                this.loadData();
                this.loadStrategiesData();
                this.checkPairs();
                this.fileLocationDesc = "Imported main config directly from bot.";
                this.notificationsService.sendMessage("Successfully imported main config directly from bot.");
                this.isLoading = false;
              },
              err => {
                err = err.json();
                this.notificationsService.sendMessage(err.error);
                this.loadDefaultMainConfig();
                this.loadStrategiesData();
                this.checkPairs();
                this.isLoading = false;
              }
            );
          }
          else {
            this.loadDefaultMainConfig();
            this.loadStrategiesData();
            this.checkPairs();
            this.isLoading = false;
          }
        }
      );
    }
  }

  private loadDefaultMainConfig() {
    this.main = {
      botConfig: {
        cycleDelay: 15,
        activePairs: [],
        streamCount: 6,
        sideTaskRestarts: 3
      },
      pairsConfig: {
        candleInterval: 60,
        orderHistoryDayCount: 30,
        strategies: [],
        cancelOpenOrders: true,
        openOrdersLifespan: 60
      }
    }
    this.loadData();
    this.notificationsService.sendMessage("Main config file wasn't found in bots directory. The default version of main config file has been loaded.", 'error');
    this.fileLocationDesc = "Default main config.";
    this.isLoading = false;
  }

  private exportMain() {
    this.main.botConfig.activePairs = [];
    this.main.pairsConfig.strategies = this.usedStrategies;
    this.main.pairsConfig.candleInterval = parseInt(this.main.pairsConfig.candleInterval);
    for (let pair of this.pairs) {
      if (pair.checked) {
        this.main.botConfig.activePairs.push(pair.baseAsset + "_" + pair.counterAsset);
      }
    }
    if (this.selectedExportOption == 'To file') {
      let response = this.filesManagingService.uploadCustomFile(this.exportLocation + "/main.json", this.main);
      if (response.status == "OK") {
        this.fileLocationDesc = "Imported main config from : " + this.exportLocation + ".";
        this.notificationsService.sendMessage("Successfully exported main config to : " + this.exportLocation + ".");
      }
      else this.notificationsService.sendMessage(response.message, "error");
    }
    else {
      this.remoteControlService.uploadMain(this.main).subscribe(
        data => {
          this.fileLocationDesc = "Imported main config directly from bot.";
          this.notificationsService.sendMessage("Successfully exported main config directly to the bot.");
        },
        err => {
          this.notificationsService.sendMessage(err.json().error, "error");
        }
      );
    }
  }
}