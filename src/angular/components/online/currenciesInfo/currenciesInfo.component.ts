import { Component } from '@angular/core';
import { RemoteControlService } from '../../../services/remoteControl.service';
import { ConfigsParsingService } from '../../../services/files/configsParsing.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  templateUrl: 'src/angular/components/online/currenciesInfo/currenciesInfo.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css', 'src/resources/styleSheets/css/pages/currenciesInfo.css'],
})

export class CurrenciesInfoComponent {

  // constructor(
  //   private remoteControlService: RemoteControlService,
  //   private notificationsService: NotificationsService,
  //   private configsParsingService: ConfigsParsingService
  // ) { }
  // private isLoading = true;

  // private Highcharts = System._nodeRequire('highcharts/highstock');
  // private coinChart: any;

  // private availableCandleSizes = []
  // private candleSize: any;
  // private chartSize = 200;

  // private currenciesList = [];
  // private selectedCurrency: any = {};
  // private currencyOverallData: any = {};
  // private currencyStrategies = [];
  // private selectedStrategy: any = {};
  // private selectedSequenceElement: any = {};

  // private ngOnInit() {
  //   this.availableCandleSizes = this.remoteControlService.retrieveIntervals();
  //   this.candleSize = this.availableCandleSizes[0];
  //   this.remoteControlService.retrieveConfigSummary().subscribe(data => {
  //     if (data.main) {
  //       this.remoteControlService.retrieveMain().subscribe(main => {
  //         if (main.botConfig.activePairs.length > 0) {
  //           let pairs = this.remoteControlService.retrievePairs();
  //           for (let pair of pairs) {
  //             if (main.botConfig.activePairs.includes(pair.baseAsset + "_" + pair.counterAsset)) this.currenciesList.push(pair);
  //           }
  //           this.selectedCurrency = this.currenciesList[0];
  //           this.loadData();
  //         }
  //         else this.notificationsService.sendMessage("There are no active currencies!", "error");
  //       });
  //     }
  //     else {
  //       this.notificationsService.sendMessage("Main config wasn't found!", "error");
  //     }
  //     this.isLoading = false;
  //   });
  // }

  // private loadData() {
  //   this.remoteControlService.retrieveCycleSnapshot(this.selectedCurrency.baseAsset + "_" + this.selectedCurrency.counterAsset).subscribe(data => {
  //     this.parseSnapshotData(data);
  //   }, err => {
  //     this.notificationsService.sendMessage("Snapshot wasn't found.", "error");
  //   });
  //   this.loadChart();
  //   this.loadOrders();
  // }

  // private loadChart() {
  //   this.remoteControlService.retrieveExchangeCandleData(this.selectedCurrency.baseAsset + "_" + this.selectedCurrency.counterAsset, this.candleSize, this.chartSize).subscribe(data => {
  //     this.parseChartData(data);
  //   }, err => {
  //     this.notificationsService.sendMessage("Couldn't retrieve candlestick data from exchange.", "error");
  //   });
  // }

  // private loadOrders() {
  //   this.remoteControlService.retrieveBotOrders(this.selectedCurrency.baseAsset + "_" + this.selectedCurrency.counterAsset).subscribe(data => {
  //     this.currencyOverallData.orders = data;
  //     for (let order in this.currencyOverallData.orders) {
  //       this.currencyOverallData.orders[order].timestamp = this.convertDate('yearly', this.currencyOverallData.orders[order].timestamp);
  //     }
  //   }, err => {
  //     this.notificationsService.sendMessage("No bot orders were found.", "error");
  //   });
  //   this.remoteControlService.retrieveExchangeOpenOrders(this.selectedCurrency.baseAsset + "_" + this.selectedCurrency.counterAsset).subscribe(data => {
  //     this.currencyOverallData.openOrders = data;
  //     for (let order in this.currencyOverallData.openOrders) {
  //       this.currencyOverallData.openOrders[order].timestamp = this.convertDate('yearly', this.currencyOverallData.openOrders[order].timestamp);
  //     }
  //   }, err => {
  //     this.notificationsService.sendMessage("No open orders were found.", "error");
  //   });
  // }

  // private parseSnapshotData(snapshot) {
  //   this.currencyOverallData.isSuccessful = snapshot.isSuccessful;
  //   if (this.currencyOverallData.isSuccessful) {
  //     for (let strategyName in snapshot.result.strategies) {
  //       this.remoteControlService.retrieveStrategy(strategyName + "-strat.json").subscribe(data => {
  //         let response = this.configsParsingService.parseStrategy(data.tools, data.outcomes, data.seq);
  //         let strategy: any = {};
  //         strategy.name = strategyName;
  //         strategy.tools = response.tools;
  //         strategy.outcomes = response.outcomes;
  //         strategy.sequenceElements = response.sequence;
  //         this.currencyStrategies.push(strategy);
  //         this.selectedStrategy = this.currencyStrategies[0];
  //         this.selectedSequenceElement = this.selectedStrategy.sequenceElements[0];
  //       }, err => {
  //         this.notificationsService.sendMessage("Strategy: '" + strategyName + "' couldn't be retrieved!", "error");
  //       })
  //     }
  //   }
  // }

  // private parseChartData(candles) {
  //   let ohlcData = [];
  //   let volumeData = [];
  //   for (let candle of candles) {
  //     candle.timestamp = this.convertDate('hourly', candle.timestamp);
  //     ohlcData.push([
  //       candle.timestamp,
  //       parseFloat(candle.open),
  //       parseFloat(candle.high),
  //       parseFloat(candle.low),
  //       parseFloat(candle.close)
  //     ]);
  //     volumeData.push([
  //       candle.timestamp,
  //       parseFloat(candle.counterVolume)
  //     ]);
  //   }
  //   this.createChart(ohlcData, volumeData);
  // }

  // private convertDate(type, date) {
  //   let d = new Date(date);
  //   let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  //   let year = d.getFullYear();
  //   let month = (months[d.getMonth()] < 10 ? '0' : '') + months[d.getMonth()];
  //   let day = (d.getDate() < 10 ? '0' : '') + d.getDate();
  //   let hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
  //   let min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  //   if (type == "hourly") {
  //     return day + " " + hour + ":" + min;
  //   }
  //   else {
  //     return (year + '-' + month + '-' + day + ' ' + hour + ':' + min).toString();
  //   }
  // }

  // private createChart(ohlc, volume) {
  //   if (this.coinChart != null) {
  //     this.coinChart.destroy()
  //   }
  //   let that = this;
  //   this.coinChart = this.Highcharts.chart('assetChart', {
  //     chart: {
  //       backgroundColor: '#21252B',
  //       plotBackgroundColor: '#21252B',
  //     },
  //     rangeSelector: {
  //       selected: 1
  //     },
  //     title: {
  //       text: ''
  //     },
  //     xAxis: [
  //       {
  //         type: "category",
  //         labels: {
  //           style: {
  //             color: 'rgba(255,255,255, 1)'
  //           }
  //         },
  //         gridLineColor: 'transparent',
  //         gridTextColor: '#ffffff',
  //         lineColor: 'transparent',
  //         tickColor: 'transparent'
  //       }
  //     ],
  //     yAxis: [{
  //       labels: {
  //         formatter: function () {
  //           return this.value + ' ' + that.selectedCurrency.counterAsset;
  //         },
  //         style: {
  //           color: 'rgba(255,255,255, 1)'
  //         }
  //       },
  //       title: {
  //         text: ''
  //       },
  //       gridLineColor: 'rgba(255,255,255,0.03)',
  //       gridLineWidth: 1,
  //     }, {
  //       labels: {
  //         formatter: function () {
  //           return this.value + ' ' + that.selectedCurrency.counterAsset;
  //         },
  //         style: {
  //           color: 'rgba(255,255,255, 1)'
  //         }
  //       },
  //       title: {
  //         text: ''
  //       },
  //       gridLineColor: 'rgba(255,255,255,0.03)',
  //       gridLineWidth: 1,
  //       opposite: true,
  //     }
  //     ],
  //     plotOptions: {
  //       candlestick: {
  //         lineColor: "rgba(0, 0, 0, 0.6)",
  //         lineWidth: 0.5,
  //         groupPadding: 0.05,
  //         upColor: '#27AE60',
  //         color: '#DB3A34'
  //       },
  //       column: {
  //         borderColor: "transparent",
  //         groupPadding: 0.05,
  //         color: 'rgba(39, 174, 96, 0.2)',
  //       }
  //     },
  //     tooltip: {
  //       split: true,
  //       borderWidth: 0,
  //       backgroundColor: '#1a1d22',
  //       style: {
  //         color: 'rgba(255,255,255,1)'
  //       }
  //     },
  //     series: [
  //       {
  //         type: 'candlestick',
  //         name: 'Candlestick',
  //         showInLegend: false,
  //         data: ohlc
  //       },
  //       {
  //         type: 'column',
  //         name: 'Volume',
  //         showInLegend: false,
  //         data: volume,
  //         yAxis: 1
  //       }
  //     ]
  //   });
  // }
}