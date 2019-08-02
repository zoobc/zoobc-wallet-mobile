import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

interface Holding {
  crypto: string;
  currency: string;
  amount: number;
  value?: number;
}

@Injectable({
  providedIn: 'root'
})

export class ChartService {

  public holdings: Holding[] = [];

  constructor(private http: HttpClient, private storage: Storage) {

  }

  addHolding(holding: Holding): void {
    this.holdings.push(holding);
    this.fetchPrices();
    this.saveHoldings();
  }

  removeHolding(holding): void {
    this.holdings.splice(this.holdings.indexOf(holding), 1);
    this.fetchPrices();
    this.saveHoldings();
  }

  saveHoldings(): void {
    this.storage.set('cryptoHoldings', this.holdings);
  }

  verifyHolding(holding): Observable<any> {
    return this.http.get('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency);
  }

  fetchPrices(refresher?): void {
    const requests = [];
    for (const holding of this.holdings){
        const request = this.http.get('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency);
        requests.push(request);
    }

    forkJoin(requests).subscribe(results => {
        results.forEach((result: any, index) => {
            this.holdings[index].value = result.ticker.price;
        });

        if(typeof(refresher) !== 'undefined'){
            refresher.complete();
        }

        this.saveHoldings();

    }, err => {

        if(typeof(refresher) !== 'undefined'){
            refresher.complete();
        }

    });

  }

}
