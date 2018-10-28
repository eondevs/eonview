import { Component } from '@angular/core';
import { FilesManagingService } from '../../../services/filesManaging.service';
import { RemoteControlService } from '../../../services/remoteControl.service';
import { ConfigsParsingService } from '../../../services/files/configsParsing.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  templateUrl: 'src/angular/components/online/strategiesConfiguration/strategiesEditor.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css', 'src/resources/styleSheets/css/pages/strategiesEditor.css']
})

export class StrategiesEditorComponent {
  constructor(
    private filesManagingService: FilesManagingService,
    private remoteControlService: RemoteControlService,
    private configsParsingService: ConfigsParsingService,
    private notificationsService: NotificationsService
  ) { }
  private isLoading = true;
  private displayWarning = true;

  //Possible Tool Select Options
  private otherTypes = [
    {
      name: '24hr percent',
      value: '24hrpercent'
    },
    {
      name: 'base volume',
      value: 'basevolume'
    },
    {
      name: 'counter volume',
      value: 'basevolume'
    }
  ]
  private movingAverageTypes = [
    {
      name: 'simple ma',
      value: 'sma'
    },
    {
      name: 'exponential ma',
      value: 'ema'
    },
    {
      name: 'weighted ma',
      value: 'wma'
    }
  ];

  private tickerPriceTypes = ['last', 'ask', 'bid'];
  private candlestickPriceTypes = ['open', 'high', 'low', 'close'];
  private bollingerBandTypes = ['lower', 'upper']

  private rollercoasterPointTypes = ['lowest', 'highest'];

  private nonFixedCalcTypes = ['percent', 'units']
  private dcaCalcTypes = [
    {
      name: 'counter percent',
      value: 'counterpercent'
    },
    {
      name: 'counter units',
      value: 'counterunits'
    },
    {
      name: 'base percent',
      value: 'basepercent'
    },
    {
      name: 'base units',
      value: 'baseunits'
    }
  ];
  private buyCalcTypes = [
    {
      name: 'counter percent',
      value: 'counterpercent'
    },
    {
      name: 'counter units',
      value: 'counterunits'
    },
    {
      name: 'base units',
      value: 'baseunits'
    }
  ];
  private allCalcTypes = ['percent', 'units', 'fixed'];

  private toolConditions = [
    {
      name: 'equal',
      value: 'equal'
    },
    {
      name: 'above',
      value: 'above'
    },
    {
      name: 'above or equal',
      value: 'aboveorequal'
    },
    {
      name: 'below',
      value: 'below'
    },
    {
      name: 'below or equal',
      value: 'beloworequal'
    },
    {
      name: 'above or below',
      value: 'aboveorbelow'
    }
  ];

  private selectionTypes = ['rotating', 'random'];

  private availableOutcomesList = ['buy', 'sell', 'dca', 'telegram', 'sandbox']

  //Possible Connector Options
  private connectionOptions = ["AND", "OR"];

  //Possible Tool Options
  private possibleTools = [
    { //Buy Price
      name: "Buy Price", type: 'buyprice', properties: {
        cond: "equal",
        obj: "last",
        shiftVal: 5.5,
        calcType: "units",
      }
    },
    { //Simple Change
      name: "Simple Change", type: 'simplechange', properties: {
        obj: "sma",
        objConf: {
          period: 3,
          price: "close"
        },
        calcType: "units",
        shiftVal: 5.5,
        cond: "equal"
      }
    },
    { //Rollercoaster
      name: "Roller Coaster", type: 'rollercoaster', properties: {
        obj: "sma",
        objConf: {
          period: 3,
          price: "close"
        },
        pointType: "lowest",
        calcType: "units",
        shiftVal: 5.5
      }
    },
    { //RSI
      name: "RSI", type: 'rsi', properties: {
        period: 14,
        price: "close",
        levelVal: 45,
        cond: "equal"
      }
    },
    { //MACD
      name: "MACD", type: 'macd', properties: {
        ema1Period: 3,
        ema2Period: 2,
        signalPeriod: 3,
        price: "close",
        diff: 3.5,
        calcType: "percent",
        cond: "equal"
      }
    },
    { //Stochastic
      name: "Stochastic", type: 'stoch', properties: {
        KPeriod: 14,
        DPeriod: 3,
        levelVal: 30,
        cond: "equal"
      }
    },
    { //Bollinger Band
      name: "BB", type: 'bb', properties: {
        obj: "last",
        band: "lower",
        period: 3,
        stdev: 2.0,
        price: "close",
        maType: "sma",
        shiftVal: 10,
        calcType: "units",
        cond: "equal"
      }
    },
    { //Moving Averages Spread
      name: "MA Spread", type: 'maspread', properties: {
        baseMA: 2,
        ma1: {
          maType: "sma",
          period: 3,
          price: "close"
        },
        ma2: {
          maType: "sma",
          period: 4,
          price: "close"
        },
        spread: 3.0,
        calcType: "percent",
        cond: "equal"
      }
    },
    { //Trailing Trends
      name: "Trailing Trends", type: 'trailingtrends', properties: {
        obj: "sma",
        objConf: {
          period: 3,
          price: "close"
        },
        backIndex: 2,
        diff: 15,
        calcType: "units",
        cond: "equal"
      }
    }
  ];

  //Possible Outcome options
  private possibleOutcomes = [
    { //Buy
      type: 'buy', properties: {
        price: "ask",
        calcType: "counterpercent",
        amount: 10
      }
    },
    { //Sell
      type: "sell", properties: {
        price: "bid"
      }
    }, //DCA
    {
      type: "dca",
      properties: {
        repeat: 5,
        price: "ask",
        calcType: "counterpercent",
        amount: 3
      }
    },
    { //Telegram
      type: "telegram",
      properties: {
        selection: "rotating",
        messages: ["Hello, I've just made a trade!", "I've a great news for you! I've just made a trade!"]
      }
    },
    { //Sandbox
      type: "sandbox"
    }
  ]

  private fileLocationDesc: String = "UNDEFINED";
  private selectedStrategyToImport: String;

  //File managing
  private exportOptions = ['To bot', 'To file'];
  private selectedExportOption: String = "To bot";
  private exportLocation: String;

  private importOptions = ['From bot', 'From local folder'];
  private selectedImportOption: String = "From bot";
  private importLocation: String;
  private importFileName: String;

  private importableStrategies = [];
  private strategy: any;

  private selectedTool: any = {};
  private selectedAvailableTool: any = {};
  private selectedSequenceElement: any = {};
  private selectedOutcome: any = {};
  private selectedOutcomesListItem = 'buy';

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.selectAvailableTool(this.possibleTools[0]);
    this.remoteControlService.retrieveConfigSummary().subscribe(data => {
      this.importableStrategies = data.strategies;
      if (data.strategies.length > 0) {
        this.fileLocationDesc = "Sub config from the bot directory.";
        this.remoteControlService.retrieveStrategy(this.importableStrategies[0] + '-strat').subscribe(strategy => {
          let response = this.configsParsingService.parseStrategy(strategy.tools, strategy.outcomes, strategy.seq);
          if (response.status == "OK") {
            this.strategy = {};
            this.strategy.name = this.importableStrategies[0];
            this.strategy.tools = response.tools;
            this.strategy.outcomes = response.outcomes;
            this.strategy.sequenceElements = response.sequence;
            this.fileLocationDesc = "Imported strategy config from the bots directory.";
            this.notificationsService.sendMessage("Successfully imported strategy config from the bot.");
            (this.strategy.outcomes != null && this.strategy.outcomes.length > 0) ? this.selectOutcome(this.strategy.outcomes[0]) : null;
            (this.strategy.tools != null && this.strategy.tools.length > 0) ? this.selectTool(this.strategy.tools[0]) : null;
            (this.strategy.sequenceElements != null && this.strategy.sequenceElements.length > 0) ? this.selectSequenceElement(this.strategy.sequenceElements[0]) : null;
          }
          else {
            this.notificationsService.sendMessage(response.message, "error");
          }
          this.isLoading = false;
        }, err => {
          this.notificationsService.sendMessage(err.json().error, "error");
        });
      } else this.isLoading = false;
    });
  }

  private createDefaultStrategy() {
    this.isLoading = true;
    this.remoteControlService.retrieveConfigSummary().subscribe(data => {
      this.importableStrategies = data.strategies;
      let strat: any = {
        name: "DefaultStrat#" + this.importableStrategies.length,
        sequenceElements: [],
        tools: [],
        outcomes: []
      };
      this.fileLocationDesc = "Default sub config;";
      this.displayWarning = true;
      this.strategy = strat;
      this.addTool();
      this.isLoading = false;
    });
  }

  private addTool() {
    let tool: any = {
      name: "DefaultTool" + this.strategy.tools.length,
      usedTool: null
    };
    this.strategy.tools.push(tool);
    this.selectTool(this.strategy.tools[this.strategy.tools.length - 1]);
    this.replaceTool();

    let sequenceItem: any = {
      tool: this.strategy.tools[this.strategy.tools.length - 1],
      bracketsLeft: 0,
      bracketsRight: 0,
      connectionTypeInFront: "AND"
    };
    this.strategy.sequenceElements.push(sequenceItem);
    this.selectSequenceElement(this.strategy.sequenceElements[this.strategy.sequenceElements.length - 1]);
  }

  private deleteTool(id) {
    for (let i = 0; i < this.strategy.sequenceElements.length; i++) {
      if (this.strategy.sequenceElements[i].tool.name == this.strategy.tools[id].name) {
        if (id > 0) {
          this.strategy.sequenceElements[i].tool.name = this.strategy.tools[0].name;
        }
        else {
          (this.strategy.tools > 0) ? this.strategy.sequenceElements[i].tool.name = this.strategy.tools[1].name : this.strategy.sequenceElements[i].tool.name = "";
        }
      }
    }
    this.strategy.tools.splice(id, 1);
    this.strategy.sequenceElements.splice(this.strategy.sequenceElements.length - 1, 1);
    (this.strategy.sequenceElements > 0) ? this.strategy.sequenceElements[this.strategy.sequenceElements.length - 1].connectorRequired = false : null;
  }

  private replaceTool() {
    this.selectedTool.usedTool = JSON.parse(JSON.stringify(this.selectedAvailableTool));
  }

  private selectTool(tool) {
    this.selectedTool = tool;
  }

  private selectAvailableTool(tool) {
    this.selectedAvailableTool = tool;
  }

  private selectSequenceElement(sequenceElement) {
    this.selectedSequenceElement = sequenceElement;
  }

  private selectOutcome(outcome) {
    this.selectedOutcome = outcome;
  }

  private manageBracket(bracketSide, action) {
    if (bracketSide == "left") {
      if (action == "add") this.selectedSequenceElement.bracketsLeft += 1;
      if (action == "remove") this.selectedSequenceElement.bracketsLeft -= 1;
    }
    else if (bracketSide == "right") {
      if (action == "add") this.selectedSequenceElement.bracketsRight += 1;
      if (action == "remove") this.selectedSequenceElement.bracketsRight -= 1;
    }
  }

  private updateSelects() {
    if (this.strategy.tools.length > 0) {
      this.selectTool(this.strategy.tools[0]);
      this.selectSequenceElement(this.strategy.sequenceElements[0]);
    }
    if (this.strategy.outcomes.length > 0) {
      this.selectOutcome(this.strategy.outcomes[0]);
    }
    this.checkAvailableOutcomes();
  }

  private exportLocationChange(event) {
    this.exportLocation = event.srcElement.files[0].path;
  }

  private importLocationChange(event) {
    this.importLocation = event.srcElement.files[0].path;
    this.importFileName = event.srcElement.files[0].name;
  }

  private checkAvailableOutcomes() {
    switch (this.strategy.outcomes.length) {
      case 1:
        if (this.strategy.outcomes[0].type == 'dca' || this.strategy.outcomes[0].type == 'buy' || this.strategy.outcomes[0].type == 'sell') {
          this.availableOutcomesList = ['telegram'];
          this.selectedOutcomesListItem = "telegram";
        }
        else if (this.strategy.outcomes[0].type == 'telegram') {
          this.availableOutcomesList = ['buy', 'sell', 'dca'];
          this.selectedOutcomesListItem = "buy";
        }
        else if (this.strategy.outcomes[0].type == 'sandbox') {
          this.availableOutcomesList = [];
          this.selectedOutcomesListItem = "Out of options";
        }
        break;
      case 2:
        this.availableOutcomesList = [];
        this.selectedOutcomesListItem = "Out of options";
        break;
      default:
        this.availableOutcomesList = ['buy', 'sell', 'dca', 'telegram', 'sandbox'];
        this.selectedOutcome = [];
        this.selectedOutcomesListItem = "buy";
        break;
    }
  }

  private selectStrategy(i) {
    this.selectedStrategyToImport = this.importableStrategies[i];
  }

  private addOutcome() {
    for (let i = 0; i < this.possibleOutcomes.length; i++) {
      if (this.selectedOutcomesListItem == this.possibleOutcomes[i].type) {
        this.strategy.outcomes.push(this.possibleOutcomes[i])
      }
    }
    this.selectOutcome(this.strategy.outcomes[this.strategy.outcomes.length - 1])
    this.checkAvailableOutcomes();
  }

  private deleteOutcome(id) {
    this.strategy.outcomes.splice(id, 1);
    if (this.strategy.outcomes.length > 0) {
      this.selectOutcome(this.strategy.outcomes[this.strategy.outcomes.length - 1])
    }
    this.checkAvailableOutcomes();
  }

  importStrategy() {
    this.isLoading = true;
    this.displayWarning = true;
    if (this.selectedImportOption == 'From local folder') {
      let temp = this.filesManagingService.loadCustomFile(this.importLocation);
      if (temp.status == "OK") {
        let response = this.configsParsingService.parseStrategy(temp.file.tools, temp.file.outcomes, temp.file.seq);
        if (response.status == "OK") {
          this.strategy = {};
          this.strategy.name = this.importFileName.split('-')[0];
          this.strategy.tools = response.tools;
          this.strategy.outcomes = response.outcomes;
          this.strategy.sequenceElements = response.sequence;
          this.fileLocationDesc = "Imported strategy config from : " + this.importLocation + ".";
          this.notificationsService.sendMessage("Successfully imported strategy config from : " + this.importLocation + ".");
          (this.strategy.outcomes.length > 0) ? this.selectOutcome(this.strategy.outcomes[0]) : null;
          (this.strategy.tools.length > 0) ? this.selectTool(this.strategy.tools[0]) : null;
          (this.strategy.sequenceElements.length > 0) ? this.selectSequenceElement(this.strategy.sequenceElements[0]) : null;
          this.isLoading = false;
        }
        else {
          this.notificationsService.sendMessage(response.message, "error");
          this.isLoading = false;
        }
      }
      else {
        this.notificationsService.sendMessage(temp.message, "error");
        this.isLoading = false;
      }
    }
    else {
      this.remoteControlService.retrieveConfigSummary().subscribe(
        data => {
          this.importableStrategies = data.strategies;
          if (data.strategies.length > 0 && data.strategies.includes(this.selectedStrategyToImport)) {
            this.remoteControlService.retrieveStrategy(this.selectedStrategyToImport + "-strat").subscribe(
              strategy => {
                let response = this.configsParsingService.parseStrategy(strategy.tools, strategy.outcomes, strategy.seq);
                this.strategy = {};
                this.strategy.name = this.importableStrategies[0];
                this.strategy.tools = response.tools;
                this.strategy.outcomes = response.outcomes;
                this.strategy.sequenceElements = response.sequence;
                this.fileLocationDesc = "Imported strategy config from the bots directory.";
                this.notificationsService.sendMessage("Successfully imported strategy config from the bot.");
                (this.strategy.outcomes.length > 0) ? this.selectOutcome(this.strategy.outcomes[0]) : null;
                (this.strategy.tools.length > 0) ? this.selectTool(this.strategy.tools[0]) : null;
                (this.strategy.sequenceElements.length > 0) ? this.selectSequenceElement(this.strategy.sequenceElements[0]) : null;
                this.isLoading = false;
              },
              err => {
                err = err.json();
                this.notificationsService.sendMessage(err.error);
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

  private exportStrategy() {
    let response = this.checkStrategy();
    if (response.status == "OK") {
      if (this.selectedExportOption == 'To file') {
        this.filesManagingService.uploadCustomFile(this.exportLocation + "/" + this.strategy.name + "-strat.json", response.data);
        this.fileLocationDesc = "Imported strategy config from : " + this.exportLocation + ".";
        this.notificationsService.sendMessage("Successfully exported strategy config to : " + this.exportLocation + ".");
      }
      else {
        this.remoteControlService.uploadStrategy(this.strategy.name + "-strat", response.data).subscribe(
          data => {
            this.importableStrategies.push(this.strategy.name);
            this.fileLocationDesc = "Imported strategy config directly from bot.";
            this.notificationsService.sendMessage("Successfully exported strategy config directly to the bot.");
          },
          err => {
            this.notificationsService.sendMessage(err.json().error, "error");
          }
        );
      }
    }
  }

  private checkStrategy() {
    let regex = new RegExp('^[a-zA-Z0-9_./#+-]*$');
    if (!regex.test(this.strategy.name)) {
      this.notificationsService.sendMessage("Strategy name contains illegal characters;", "error");
      return { status: "ERR" };
    }
    let seq = "";
    let openingBrackets = 0;
    let closingBrackets = 0;
    for (let i = 0; i < this.strategy.sequenceElements.length; i++) {
      for (let b = i + 1; b < this.strategy.sequenceElements.length; b++) {
        if (this.strategy.sequenceElements[i].tool.name == this.strategy.sequenceElements[b].tool.name) {
          this.notificationsService.sendMessage("Not all tools have been used;", "error");
          return { status: "ERR" };
        }
      }
      for (let a = 0; a < this.strategy.sequenceElements[i].bracketsLeft; a++) {
        openingBrackets++;
        seq += "{ ";
      }
      seq += this.strategy.sequenceElements[i].tool.name + " ";
      for (let a = 0; a < this.strategy.sequenceElements[i].bracketsRight; a++) {
        closingBrackets++;
        if (closingBrackets > openingBrackets) {
          this.notificationsService.sendMessage("Too many closing brackets;", "error");
          return { status: "ERR" };
        }
        seq += "} ";
      }
      if (i < this.strategy.sequenceElements.length - 1) {
        seq += this.strategy.sequenceElements[i].connectionTypeInFront + " ";
      }
    }
    seq = seq.substring(0, seq.length - 1);
    if (openingBrackets > closingBrackets) {
      this.notificationsService.sendMessage("Too many opening brackets;", "error");
      return { status: "ERR" };
    }
    let tools = {};
    for (let i = 0; i < this.strategy.tools.length; i++) {
      for (let b = i + 1; b < this.strategy.tools.length; b++) {
        if (this.strategy.tools[i].name == this.strategy.tools[b].name) {
          this.notificationsService.sendMessage("Tools can't have matching names;", "error");
          return { status: "ERR" };
        }
      }
      let properties = this.strategy.tools[i].usedTool.properties;
      if (properties.baseMA != null) properties.baseMA = parseInt(properties.baseMA);
      tools[this.strategy.tools[i].name] = {
        type: this.strategy.tools[i].usedTool.type,
        properties: properties
      }
      if (!regex.test(this.strategy.tools[i].name)) {
        this.notificationsService.sendMessage(this.strategy.tools[i].name + " contains illegal characters;", "error");
        return { status: "ERR" };
      }
    }
    let outcomes = [];
    for (let i = 0; i < this.strategy.outcomes.length; i++) {
      let outcome = JSON.parse(JSON.stringify(this.strategy.outcomes[i]))
      outcome.properties = outcome.properties;
      outcomes.push(outcome);
    }
    let strategy: any = {};
    strategy.tools = tools;
    strategy.seq = seq;
    strategy.outcomes = outcomes;
    return { status: "OK", data: strategy };
  }

  private trackByIndex(index: number, obj: any): any {
    return index;
  }
}
