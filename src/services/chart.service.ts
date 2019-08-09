import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  private CRYPTO_KEY = "a83286c854d012d8c5e3d02c225abba04b8a4ce11f0373ca234509f2a48f33b0";
  private CRYPTO_API_URL = "https://min-api.cryptocompare.com/data";


  public holdings: Holding[] = [];
  constructor(private http: HttpClient, private storage: Storage) {

  }


  getHistoryData(): Observable<any> {
    const url = this.CRYPTO_API_URL + "/histoday?fsym=BTC&tsym=USD&limit=10&api_key=" + this.CRYPTO_KEY;

    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
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
