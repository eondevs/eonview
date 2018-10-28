import { Injectable } from '@angular/core';

@Injectable()
export class ConfigsParsingService {

  parseApiKeys(c) {
    for (let apiInfo of c) {
      if (apiInfo.key == null) return { status: "ERR", message: "Missing api key setting." };
      if (apiInfo.secret == null) return { status: "ERR", message: "Missing api secret setting." };
      if (typeof apiInfo.key != "string") return { status: "ERR", message: "Invalid api key type;" };
      if (typeof apiInfo.secret != "string") return { status: "ERR", message: "Invalid api secret type;" };
    }
    return { status: "OK" };
  }

  parseMain(c, intervals, strategies, pairs) {
    if (c["botConfig"] == null) return { status: "ERR", message: "Missing botConfig settings." };
    if (c["botConfig"]["activePairs"] == null) return { status: "ERR", message: "Missing activePairs setting." };
    if (c["botConfig"]["streamCount"] == null) return { status: "ERR", message: "Missing streamCount setting." };
    if (c["botConfig"]["sideTaskRestarts"] == null) return { status: "ERR", message: "Missing sideTaskRestarts setting." };
    if (c["pairsConfig"] == null) return { status: "ERR", message: "Missing pairsConfig settings." };
    if (c["pairsConfig"]["candleInterval"] == null) return { status: "ERR", message: "Missing candleInterval setting." };
    if (c["pairsConfig"]["orderHistoryDayCount"] == null) return { status: "ERR", message: "Missing orderHistoryDayCount setting." };
    if (c["pairsConfig"]["strategies"] == null) return { status: "ERR", message: "Missing strategies setting." };
    if (c["pairsConfig"]["cancelOpenOrders"] == null) return { status: "ERR", message: "Missing cancelOpenOrders setting." };
    if (c["pairsConfig"]["openOrdersLifespan"] == null) return { status: "ERR", message: "Missing openOrdersLifespan setting." };

    if (typeof c["botConfig"] == "object") {
      if (typeof c["botConfig"]["cycleDelay"] != "number") return { status: "ERR", message: "Main Config Cycle Delay is in invalid format." };
      if (typeof c["botConfig"]["activePairs"] == "object") {
        for (let currency of c["botConfig"]["activePairs"]) {
          if (typeof currency != "string") return { status: "ERR", message: "'" + currency + "' type is invalid." };
          else if (pairs.find(pair => pair.baseAsset + "_" + pair.counterAsset == currency) == null) return { status: "ERR", message: currency + " pair isn't supported by the exchange;" };
          else {
            let p = currency.split("_");
            if (p.length != 2) return { status: "ERR", message: "'" + currency + "' isn't a valid currency." };
          }
        }
      }
      else return { status: "ERR", message: "Main Config is missing activePairs settings;" };
      if (typeof c["botConfig"]["streamCount"] != "number") return { status: "ERR", message: "Invalid streamCount type;" };
      if (typeof c["botConfig"]["sideTaskRestarts"] != "number") return { status: "ERR", message: "Invalid sideTaskRestarts type;" };
    }
    else return { status: "ERR", message: "Invalid botConfig type;" }
    if (typeof c["pairsConfig"] == "object") {
      if (typeof c["pairsConfig"]["candleInterval"] != "number") return { status: "ERR", message: "Invalid candleInterval type;" };
      if (!intervals.includes(c["pairsConfig"]["candleInterval"])) return { status: "ERR", message: c["pairsConfig"]["candleInterval"] + " interval isn't supported by the exchange;" };
      if (typeof c["pairsConfig"]["orderHistoryDayCount"] != "number") return { status: "ERR", message: "Invalid orderHistoryDayCount type;" };
      if (typeof c["pairsConfig"]["strategies"] == "object") {
        for (let strategy of c["pairsConfig"]["strategies"]) {
          if (typeof strategy != "string") return { status: "ERR", message: "Invalid strategies type;" };
          if (!strategies.includes(strategy)) return { status: "ERR", message: strategy + " strategy doesn't exist in bot's directory;" };
        }
      }
      else return { status: "ERR", message: "Invalid strategies type;" };
      if (typeof c["pairsConfig"]["cancelOpenOrders"] != "boolean") return { status: "ERR", message: "Invalid cancelOpenOrders type;" };
      if (typeof c["pairsConfig"]["openOrdersLifespan"] != "number") return { status: "ERR", message: "Invalid openOrdersLifespan type;" };
    }
    else return { status: "ERR", message: "Invalid pairsConfig type;" };
    return { status: "OK" };
  }

  parseRC(c) {
    if (c["exchangeDriverAddress"] == null) return { status: "ERR", message: "Missing exchangeDriverAddress setting." };
    if (c["internal"] == null) return { status: "ERR", message: "Missing internal settings." };
    if (c["internal"]["username"] == null) return { status: "ERR", message: "Missing username setting." };
    if (c["internal"]["password"] == null) return { status: "ERR", message: "Missing password setting." };
    if (c["telegram"] == null) return { status: "ERR", message: "Missing telegram settings." };
    if (c["telegram"]["enable"] == null) return { status: "ERR", message: "Missing enable setting." };
    if (c["telegram"]["token"] == null) return { status: "ERR", message: "Missing token setting." };
    if (c["telegram"]["owner"] == null) return { status: "ERR", message: "Missing owner setting." };
    if (typeof c["exchangeDriverAddress"] != "string") return { status: "ERR", message: "Invalid exchangeDriverAddress type;" };
    if (typeof c["internal"] == "object") {
      if (typeof c["internal"]["username"] != "string") return { status: "ERR", message: "Invalid username type;" };
      if (typeof c["internal"]["password"] != "string") return { status: "ERR", message: "Invalid password type;" };
    }
    else return { status: "ERR", message: "Invalid internal type;" };
    if (typeof c["telegram"] == "object") {
      if (typeof c["telegram"]["enable"] != "boolean") return { status: "ERR", message: "Invalid enable type;" };
      if (typeof c["telegram"]["token"] != "string") return { status: "ERR", message: "Invalid token type;" };
      if (typeof c["telegram"]["owner"] != "string") return { status: "ERR", message: "Invalid owner type;" };
    }
    else return { status: "ERR", message: "Invalid telegram type;" };
    return { status: "OK" };
  }

  parseSub(c, intervals, strategies, pairs) {
    if (c["active"] == null) return { status: "ERR", message: "Missing active setting." };
    if (c["pairs"] == null) return { status: "ERR", message: "Missing pairs setting." };
    if (c["pairsConfig"] == null) return { status: "ERR", message: "Missing pairsConfig settings." };
    if (c["pairsConfig"]["candleInterval"] == null) return { status: "ERR", message: "Missing candleInterval setting." };
    if (c["pairsConfig"]["orderHistoryDayCount"] == null) return { status: "ERR", message: "Missing orderHistoryDayCount setting." };
    if (c["pairsConfig"]["strategies"] == null) return { status: "ERR", message: "Missing strategies setting." };
    if (c["pairsConfig"]["cancelOpenOrders"] == null) return { status: "ERR", message: "Missing cancelOpenOrders setting." };
    if (c["pairsConfig"]["openOrdersLifespan"] == null) return { status: "ERR", message: "Missing openOrdersLifespan setting." };
    if (typeof c["active"] != "boolean") return { status: "ERR", message: "Invalid active type;" };
    if (typeof c["pairs"] == "object") {
      for (let currency of c["pairs"]) {
        if (typeof currency != "string") return { status: "ERR", message: "'" + currency + "' type is invalid." };
        else if (pairs.find(pair => pair.baseAsset + "_" + pair.counterAsset == currency) == null) return { status: "ERR", message: currency + " pair isn't supported by the exchange;" };
        else {
          let p = currency.split("_");
          if (p.length != 2) return { status: "ERR", message: "'" + currency + "' isn't a valid currency." };
        }
      }
    }
    if (typeof c["pairsConfig"] == "object") {
      if (typeof c["pairsConfig"]["candleInterval"] != "number") return { status: "ERR", message: "Invalid candleInterval type;" };
      if (!intervals.includes(c["pairsConfig"]["candleInterval"])) return { status: "ERR", message: c["pairsConfig"]["candleInterval"] + " interval isn't supported by the exchange;" };
      if (typeof c["pairsConfig"]["orderHistoryDayCount"] != "number") return { status: "ERR", message: "Invalid orderHistoryDayCount type;" };
      if (typeof c["pairsConfig"]["strategies"] == "object") {
        for (let strategy of c["pairsConfig"]["strategies"]) {
          if (typeof strategy != "string") return { status: "ERR", message: "Invalid strategies type;" };
          if (!strategies.includes(strategy)) return { status: "ERR", message: strategy + " strategy doesn't exist in bot's directory;" };
        }
      }
      else return { status: "ERR", message: "Invalid strategies type;" };
      if (typeof c["pairsConfig"]["cancelOpenOrders"] != "boolean") return { status: "ERR", message: "Invalid cancelOpenOrders type;" };
      if (typeof c["pairsConfig"]["openOrdersLifespan"] != "number") return { status: "ERR", message: "Invalid openOrdersLifespan type;" };
    }
    else return { status: "ERR", message: "Invalid pairsConfig type;" };
    return { status: "OK" };
  }

  parseStrategy(tools, outcomes, sequence) {
    let parsedTools = [];
    for (let tool in tools) {
      if (typeof tools[tool]["type"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "'type type;" };
      if (typeof tools[tool]["properties"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties type;" };
      tools[tool].type = tools[tool].type.toLowerCase()
      let toolName;
      switch (tools[tool].type) {
        case 'buyprice':
          toolName = "Buy Price";
          if (typeof tools[tool]["properties"]["obj"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["shiftVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties shiftVal type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["obj"] != "last" && tools[tool]["properties"]["obj"] != "ask" && tools[tool]["properties"]["obj"] != "bid") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond value;" };
          break;
        case 'simplechange':
          toolName = "Simple Change";
          if (typeof tools[tool]["properties"]["obj"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj type;" };
          if (typeof tools[tool]["properties"]["objConf"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf type;" };
          if (typeof tools[tool]["properties"]["objConf"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period type;" };
          if (typeof tools[tool]["properties"]["objConf"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["shiftVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties shiftVal type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["obj"] != "last" && tools[tool]["properties"]["obj"] != "ask" && tools[tool]["properties"]["obj"] != "bid" && tools[tool]["properties"]["obj"] != "24hrpercent" && tools[tool]["properties"]["obj"] != "basevolume" && tools[tool]["properties"]["obj"] != "countervolume" && tools[tool]["properties"]["obj"] != "sma" && tools[tool]["properties"]["obj"] != "ema" && tools[tool]["properties"]["obj"] != "wma" && tools[tool]["properties"]["obj"] != "open" && tools[tool]["properties"]["obj"] != "high" && tools[tool]["properties"]["obj"] != "low" && tools[tool]["properties"]["obj"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj value;" };
          if (tools[tool]["properties"]["objConf"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period value;" };
          if (tools[tool]["properties"]["objConf"]["price"] != "open" && tools[tool]["properties"]["objConf"]["price"] != "high" && tools[tool]["properties"]["objConf"]["price"] != "low" && tools[tool]["properties"]["objConf"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units" && tools[tool]["properties"]["calcType"] != "fixed") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond value;" };
          break;
        case 'rollercoaster':
          toolName = "Rollercoaster";
          if (typeof tools[tool]["properties"]["obj"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj type;" };
          if (typeof tools[tool]["properties"]["objConf"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf type;" };
          if (typeof tools[tool]["properties"]["objConf"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period type;" };
          if (typeof tools[tool]["properties"]["objConf"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price type;" };
          if (typeof tools[tool]["properties"]["pointType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties pointType type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["shiftVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties shiftVal type;" };
          if (tools[tool]["properties"]["obj"] != "last" && tools[tool]["properties"]["obj"] != "ask" && tools[tool]["properties"]["obj"] != "bid" && tools[tool]["properties"]["obj"] != "24hrpercent" && tools[tool]["properties"]["obj"] != "basevolume" && tools[tool]["properties"]["obj"] != "countervolume" && tools[tool]["properties"]["obj"] != "sma" && tools[tool]["properties"]["obj"] != "ema" && tools[tool]["properties"]["obj"] != "wma" && tools[tool]["properties"]["obj"] != "open" && tools[tool]["properties"]["obj"] != "high" && tools[tool]["properties"]["obj"] != "low" && tools[tool]["properties"]["obj"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj value;" };
          if (tools[tool]["properties"]["objConf"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period value;" };
          if (tools[tool]["properties"]["objConf"]["price"] != "open" && tools[tool]["properties"]["objConf"]["price"] != "high" && tools[tool]["properties"]["objConf"]["price"] != "low" && tools[tool]["properties"]["objConf"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price value;" };
          if (tools[tool]["properties"]["pointType"] != "lowest" && tools[tool]["properties"]["pointType"] != "highest") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties pointType value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          break;
        case 'rsi':
          toolName = "RSI";
          if (typeof tools[tool]["properties"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties period type;" };
          if (typeof tools[tool]["properties"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price type;" };
          if (typeof tools[tool]["properties"]["levelVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties levelVal type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties period value;" };
          if (tools[tool]["properties"]["price"] != "open" && tools[tool]["properties"]["price"] != "high" && tools[tool]["properties"]["price"] != "low" && tools[tool]["properties"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price value;" };
          if (tools[tool]["properties"]["levelVal"] > 100 || tools[tool]["properties"]["levelVal"] < 0) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties levelVal value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          break;
        case 'macd':
          toolName = "MACD";
          if (typeof tools[tool]["properties"]["ema1Period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ema1Period type;" };
          if (typeof tools[tool]["properties"]["ema2Period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ema2Period type;" };
          if (typeof tools[tool]["properties"]["signalPeriod"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties signalPeriod type;" };
          if (typeof tools[tool]["properties"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price type;" };
          if (typeof tools[tool]["properties"]["diff"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties diff type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["ema1Period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ema1Period value;" };
          if (tools[tool]["properties"]["ema2Period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ema2Period value;" };
          if (tools[tool]["properties"]["signalPeriod"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties signalPeriod value;" };
          if (tools[tool]["properties"]["price"] != "open" && tools[tool]["properties"]["price"] != "high" && tools[tool]["properties"]["price"] != "low" && tools[tool]["properties"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          break;
        case 'stoch':
          toolName = "Stochastic"
          if (typeof tools[tool]["properties"]["KPeriod"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties KPeriod type;" };
          if (typeof tools[tool]["properties"]["DPeriod"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties DPeriod type;" };
          if (typeof tools[tool]["properties"]["levelVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties levelVal type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["KPeriod"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties KPeriod value;" };
          if (tools[tool]["properties"]["DPeriod"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties DPeriod value;" };
          if (tools[tool]["properties"]["levelVal"] > 100 || tools[tool]["properties"]["levelVal"] < 0) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties levelVal value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          break;
        case 'bb':
          toolName = "BB";
          if (typeof tools[tool]["properties"]["obj"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj type;" };
          if (typeof tools[tool]["properties"]["band"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties band type;" };
          if (typeof tools[tool]["properties"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties KPeriod type;" };
          if (typeof tools[tool]["properties"]["stdev"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties KPeriod type;" };
          if (typeof tools[tool]["properties"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price type;" };
          if (typeof tools[tool]["properties"]["maType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties maType type;" };
          if (typeof tools[tool]["properties"]["shiftVal"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties shiftVal type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["obj"] != "last" && tools[tool]["properties"]["obj"] != "ask" && tools[tool]["properties"]["obj"] != "bid") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj value;" };
          if (tools[tool]["properties"]["band"] != "lower" && tools[tool]["properties"]["band"] != "upper") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties band value;" };
          if (tools[tool]["properties"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties period value;" };
          if (tools[tool]["properties"]["price"] != "open" && tools[tool]["properties"]["price"] != "high" && tools[tool]["properties"]["price"] != "low" && tools[tool]["properties"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties price value;" };
          if (tools[tool]["properties"]["maType"] != "sma" && tools[tool]["properties"]["maType"] != "ema" && tools[tool]["properties"]["maType"] != "wma") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties maType value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond value;" };
          break;
        case 'maspread':
          toolName = "MA Spread";
          if (typeof tools[tool]["properties"]["baseMA"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties baseMA type;" };
          if (typeof tools[tool]["properties"]["ma1"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 type;" };
          if (typeof tools[tool]["properties"]["ma1"]["maType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 maType type;" };
          if (typeof tools[tool]["properties"]["ma1"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 period type;" };
          if (typeof tools[tool]["properties"]["ma1"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 price type;" };
          if (typeof tools[tool]["properties"]["ma2"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 type;" };
          if (typeof tools[tool]["properties"]["ma2"]["maType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 maType type;" };
          if (typeof tools[tool]["properties"]["ma2"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 period type;" };
          if (typeof tools[tool]["properties"]["ma2"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 price type;" };
          if (typeof tools[tool]["properties"]["spread"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties spread type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["baseMA"] != 1 && tools[tool]["properties"]["baseMA"] != 2) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties baseMA value;" };
          if (tools[tool]["properties"]["ma1"]["maType"] != "sma" && tools[tool]["properties"]["ma1"]["maType"] != "ema" && tools[tool]["properties"]["ma1"]["maType"] != "wma") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 maType value;" };
          if (tools[tool]["properties"]["ma1"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 period value;" };
          if (tools[tool]["properties"]["ma1"]["price"] != "open" && tools[tool]["properties"]["ma1"]["price"] != "high" && tools[tool]["properties"]["ma1"]["price"] != "low" && tools[tool]["properties"]["ma1"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma1 price value;" };
          if (tools[tool]["properties"]["ma2"]["maType"] != "sma" && tools[tool]["properties"]["ma2"]["maType"] != "ema" && tools[tool]["properties"]["ma2"]["maType"] != "wma") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 maType value;" };
          if (tools[tool]["properties"]["ma2"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 period value;" };
          if (tools[tool]["properties"]["ma2"]["price"] != "open" && tools[tool]["properties"]["ma2"]["price"] != "high" && tools[tool]["properties"]["ma2"]["price"] != "low" && tools[tool]["properties"]["ma2"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties ma2 price value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond value;" };
          break;
        case 'trailingtrends':
          toolName = "Trailing Trends";
          if (typeof tools[tool]["properties"]["obj"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj type;" };
          if (typeof tools[tool]["properties"]["objConf"] != "object") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf type;" };
          if (typeof tools[tool]["properties"]["objConf"]["period"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period type;" };
          if (typeof tools[tool]["properties"]["objConf"]["price"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price type;" };
          if (typeof tools[tool]["properties"]["backIndex"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties backIndex type;" };
          if (typeof tools[tool]["properties"]["diff"] != "number") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties diff type;" };
          if (typeof tools[tool]["properties"]["calcType"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType type;" };
          if (typeof tools[tool]["properties"]["cond"] != "string") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond type;" };
          if (tools[tool]["properties"]["obj"] != "sma" && tools[tool]["properties"]["obj"] != "ema" && tools[tool]["properties"]["obj"] != "wma" && tools[tool]["properties"]["obj"] != "open" && tools[tool]["properties"]["obj"] != "high" && tools[tool]["properties"]["obj"] != "low" && tools[tool]["properties"]["obj"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties obj value;" };
          if (tools[tool]["properties"]["objConf"]["period"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf period value;" };
          if (tools[tool]["properties"]["objConf"]["price"] != "open" && tools[tool]["properties"]["objConf"]["price"] != "high" && tools[tool]["properties"]["objConf"]["price"] != "low" && tools[tool]["properties"]["objConf"]["price"] != "close") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties objConf price value;" };
          if (tools[tool]["properties"]["backIndex"] < 1) return { status: "ERR", message: "Invalid tool's '" + tool + "' properties backIndex value;" };
          if (tools[tool]["properties"]["calcType"] != "percent" && tools[tool]["properties"]["calcType"] != "units") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties calcType value;" };
          if (tools[tool]["properties"]["cond"] != "equal" && tools[tool]["properties"]["cond"] != "above" && tools[tool]["properties"]["cond"] != "aboveorequal" && tools[tool]["properties"]["cond"] != "below" && tools[tool]["properties"]["cond"] != "beloworequal" && tools[tool]["properties"]["cond"] != "aboveorbelow") return { status: "ERR", message: "Invalid tool's '" + tool + "' properties cond value;" };
          break;
        default:
          return { status: "ERR", message: "Invalid tool's '" + tool + "' type;" };
          break;
      }
      let newTool = {
        name: tool,
        usedTool: {
          name: toolName,
          properties: tools[tool].properties,
          type: tools[tool].type
        }
      }
      parsedTools.push(newTool);
    }

    let parsedOutcomes = [];
    for (let outcome in outcomes) {
      outcomes[outcome].properties = this.lowerCaseObjectStrings(outcomes[outcome].properties);
      parsedOutcomes.push(outcomes[outcome]);
    }

    let seqPieces = sequence.split(" ");
    let sequenceList = [];

    let sequenceItem: any = {
      tool: null,
      bracketsLeft: 0,
      bracketsRight: 0,
      connectionTypeInFront: "AND"
    };

    for (let i = 0; i < seqPieces.length; i++) {
      if (seqPieces[i] == "{") {
        sequenceItem.bracketsLeft++;
      }
      else if (seqPieces[i] == "}") {
        sequenceItem.bracketsRight++;
      }
      else if (seqPieces[i] == "||" || seqPieces[i] == "or" || seqPieces[i] == "OR") {
        sequenceItem.connectionTypeInFront = "OR";
        sequenceList.push(sequenceItem);
        sequenceItem = {
          tool: null,
          bracketsLeft: 0,
          bracketsRight: 0,
          connectionTypeInFront: "AND"
        };
      }
      else if (seqPieces[i] == "&&" || seqPieces[i] == "and" || seqPieces[i] == "AND") {
        sequenceItem.connectionTypeInFront = "AND";
        sequenceList.push(sequenceItem);
        sequenceItem = {
          tool: null,
          bracketsLeft: 0,
          bracketsRight: 0,
          connectionTypeInFront: "AND"
        };
      }
      else {
        for (let tool of parsedTools) {
          if (seqPieces[i] == tool.name) {
            sequenceItem.tool = tool;
            break;
          }
        }
      }
      if (i == seqPieces.length - 1) {
        sequenceItem.connectionTypeInFront = "NONE";
        sequenceList.push(sequenceItem);
      }
    }
    return { status: "OK", tools: parsedTools, outcomes: parsedOutcomes, sequence: sequenceList };
  }

  private lowerCaseObjectStrings(obj) {
    let that = this;
    for (let key in obj) {
      if (typeof obj[key] == "object" && key != 'messages') {
        obj[key] = that.lowerCaseObjectStrings(obj[key]);
      }
      if (typeof obj[key] == "string") {
        obj[key] = obj[key].toLowerCase();
      }
    }
    return obj;
  }
}