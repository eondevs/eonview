import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RemoteControlService {
  constructor(
    private http: Http
  ) { }

  private options: RequestOptions;
  private address: String;

  private intervals: String[] = [];
  private pairs: any[] = [];
  private marketAssets: String[] = [];

  getAddress() {
    return this.address;
  }

  connect(username, password, ip, port): Observable<any[]> {
    let headers = new Headers({ "Authorization": "Basic " + btoa(username + ":" + password) });
    this.options = new RequestOptions({ headers: headers });
    this.address = "http:" + ip + ":" + port;
    return this.http.get(this.address + "/bot/version", this.options).map(res => { return res.json() });
  }

  loadExchangeData() {
    this.retrieveExchangeCandleIntervals().subscribe(data => this.intervals = data);
    this.retrieveExchangeAssetPairs().subscribe(data => {
      let pairs = data;
      this.retrieveExchangeTickerData().subscribe(data => {
        for (let p of pairs) {
          let pairData: any = {};
          let splitted = p.split('_');
          pairData.baseAsset = splitted[0];
          pairData.counterAsset = splitted[1];
          pairData.lastPrice = data[p].lastPrice;
          pairData.dayPercentChange = data[p].dayPercentChange;
          pairData.baseVolume = data[p].baseVolume;
          pairData.counterVolume = data[p].counterVolume;
          this.pairs.push(pairData);
        }
      })
      for (let pair of data) {
        let splitted = pair.split('_');
        if (!this.marketAssets.includes(splitted[1])) {
          this.marketAssets.push(splitted[1]);
        }
      }
    });
  }


  retrieveIntervals() {
    return this.intervals;
  }

  retrievePairs() {
    return this.pairs;
  }

  retrieveMarketAssets() {
    return this.marketAssets;
  }

  retrieveBotTime() {
    return this.http.get(this.address + "/bot/time", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveBotOrdersCount(pair?) {
    if (pair == null) return this.http.get(this.address + "/bot/orders/since-start", this.options).map(response => response.json()).catch(error => Observable.throw(error));
    else return this.http.get(this.address + "/bot/orders/count?pair=" + pair, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveBotOrders(pair?, start?: Date, end?: Date) {
    let tempPair = (pair != null) ? "pair=" + pair + "&" : "";
    if (start == null) start = new Date(Date.now() - 86400);
    if (end == null) end = new Date();
    return this.http.get(this.address + "/bot/orders?" + tempPair + "start=" + start.toISOString() + "&end=" + end.toISOString(), this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveBotActivity(pair?, days?, end?) {
    if (days == null) days = 7;
    if (end == null) end = new Date();
    return this.http.get(this.address + "/bot/orders/hours-activity?" + ((pair != null) ? "pair=" + pair + "&" : "") + "days=" + days + "&end=" + end.toISOString(), this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveCycleSnapshot(pair, cycleID?) {
    let id = (cycleID != null) ? "&id=" + cycleID : "";
    return this.http.get(this.address + "/bot/cycles?pair=" + pair + id, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveCycleIDs(pair) {
    return this.http.get(this.address + "/bot/cycles/ids?pair=" + pair, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveBotState() {
    return this.http.get(this.address + "/workflow/state", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveConfigSummary() {
    return this.http.get(this.address + "/configs/summary", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  uploadAuth(auth) {
    return this.http.put(this.address + "/configs/auth", auth, this.options).map(response => response).catch(error => Observable.throw(error));
  }

  retrieveAuth() {
    return this.http.get(this.address + "/configs/auth", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  uploadMain(main) {
    return this.http.put(this.address + "/configs/main", main, this.options).map(response => response).catch(error => Observable.throw(error));
  }

  retrieveMain() {
    return this.http.get(this.address + "/configs/main", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  uploadRemote(remote) {
    return this.http.put(this.address + "/configs/remote", remote, this.options).map(response => response).catch(error => Observable.throw(error));
  }

  retrieveRemote() {
    return this.http.get(this.address + "/configs/remote", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  uploadSubconfig(fileName, config) {
    let body = { "fileName": fileName, "config": config };
    return this.http.put(this.address + "/configs/sub", body, this.options).map(response => response).catch(error => Observable.throw(error));
  }

  retrieveSubconfig(fileName) {
    return this.http.get(this.address + "/configs/sub?fileName=" + fileName, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  removeSubconfig(fileName) {
    return this.http.delete(this.address + "/configs/sub?fileName=" + fileName, this.options).map(res => { return res.json() });
  }

  uploadStrategy(fileName, config) {
    let body = { "fileName": fileName, "strategy": config };
    console.log(body);
    return this.http.put(this.address + "/configs/strategy", body, this.options).map(response => response).catch(error => Observable.throw(error));
  }

  retrieveStrategy(fileName) {
    return this.http.get(this.address + "/configs/strategy?fileName=" + fileName, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  removeStrategy(fileName) {
    this.http.delete(this.address + "/configs/strategy?fileName=" + fileName, this.options).map(res => { return res.json() });
  }

  updateAPI(api) {
    return this.http.post(this.address + "/exchange/api-info", api, this.options).map(res => { return res.json() });
  }

  retrieveAPI() {
    return this.http.get(this.address + "/exchange/api-info", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveCooldownState() {
    return this.http.get(this.address + "/exchange/cooldown-info", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  private retrieveExchangeAssetPairs() {
    return this.http.get(this.address + "/exchange/pairs", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  private retrieveExchangeCandleIntervals() {
    return this.http.get(this.address + "/exchange/intervals", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveExchangeTickerData(pair?) {
    if (pair == null) return this.http.get(this.address + "/exchange/ticker", this.options).map(response => response.json()).catch(error => Observable.throw(error));
    else return this.http.get(this.address + "/exchange/ticker?pair=" + pair, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveExchangeCandleData(pair, interval, limit?, end?: Date) {
    if (end == null) end = new Date();
    return this.http.get(this.address + "/exchange/candles?pair=" + pair + "&interval=" + interval + "&end=" + end.toISOString() + "&limit=" + limit, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveExchangeOpenOrders(pair) {
    return this.http.get(this.address + "/exchange/open-orders?pair=" + pair, this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveExchangeOrderHistory(pair, start?: Date, end?: Date) {
    if (start == null) start = new Date(Date.now() - 86400);
    if (end == null) end = new Date();
    return this.http.get(this.address + "/exchange/order-history?pair=" + pair + (start != null) ? "&start=" + start.toISOString() : "" + (end != null) ? "&end=" + end.toISOString() : "", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  retrieveUserBalance() {
    return this.http.get(this.address + "/exchange/balances", this.options).map(response => response.json()).catch(error => Observable.throw(error));
  }

  startBot(sellAll, cancelAll) {
    let body = { "sellAll": sellAll, "cancelAll": cancelAll };
    return this.http.post(this.address + "/workflow/start", body, this.options).map(res => { return res.json() });
  }

  stopBot(sellAll, cancelAll, kill) {
    let body = { "sellAll": sellAll, "cancelAll": cancelAll, "kill": kill };
    return this.http.post(this.address + "/workflow/stop", body, this.options).map(res => { return res.json() });
  }

  restartBot(sellAll, cancelAll) {
    let body = { "sellAll": sellAll, "cancelAll": cancelAll };
    return this.http.post(this.address + "/workflow/restart", body, this.options).map(res => { return res.json() });
  }

}
