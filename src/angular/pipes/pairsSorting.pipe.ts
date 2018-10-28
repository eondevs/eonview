import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pairsSort'
})
export class PairsSorting implements PipeTransform {

  transform(pairs: any[], name, market, sortBy): any {
    switch (sortBy) {
      case 'baseCurrency':
        pairs.sort((n1, n2) => (n1.baseAsset > n2.baseAsset) ? 1 : -1);
        break;
      case 'change':
        pairs.sort((n1, n2) => n2.dayPercentChange - n1.dayPercentChange);
        break;
      case 'last':
        pairs.sort((n1, n2) => n2.lastPrice - n1.lastPrice);
        break;
      case 'volume':
        pairs.sort((n1, n2) => n2.baseVolume - n1.baseVolume);
        break;
      case 'status':
        pairs.sort((n1, n2) => (n1.checked === n2.checked) ? 0 : n1.checked ? -1 : 1);
        break;
    }
    return pairs.filter(pair => pair.baseAsset.toLowerCase().includes(name.toLowerCase()) && pair.counterAsset.toLowerCase().includes(market.toLowerCase()));
  }
} 