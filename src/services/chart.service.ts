import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const cc = require('cryptocompare');
cc.setApiKey('a83286c854d012d8c5e3d02c225abba04b8a4ce11f0373ca234509f2a48f33b0');

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


  getHistoryData(periode: string): Observable<any> {

    this.getCoinList();

    let url = this.CRYPTO_API_URL + "/histominute?fsym=BTC&tsym=USD&limit=20&api_key=" + this.CRYPTO_KEY;
    if (periode=="day"){
      url = this.CRYPTO_API_URL + "/histominute?fsym=BTC&tsym=USD&limit=20&api_key=" + this.CRYPTO_KEY;
    }else if (periode=="week"){
      url = this.CRYPTO_API_URL + "/histohour?fsym=BTC&tsym=USD&limit=20&api_key=" + this.CRYPTO_KEY;
    }else if (periode=="month"){
      url = this.CRYPTO_API_URL + "/histoday?fsym=BTC&tsym=USD&limit=20&api_key=" + this.CRYPTO_KEY;
    }


    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
  }
 

  getCoinList(){

      console.log('will get coin list----------');
      // Usage:
      cc.coinList()
      .then(coinList => {
        console.log(coinList)
        // ->
        // {
        //   BTC: {
        //    Id: "1182",
        //    Url: "/coins/btc/overview",
        //    ImageUrl: "/media/19633/btc.png",
        //    Name: "BTC",
        //    Symbol: "BTC",
        //    CoinName: "Bitcoin",
        //    FullName: "Bitcoin (BTC)",
        //    Algorithm: "SHA256",
        //    ProofType: "PoW",
        //    FullyPremined: "0",
        //    TotalCoinSupply: "21000000",
        //    PreMinedValue: "N/A",
        //    TotalCoinsFreeFloat: "N/A",
        //    SortOrder: "1",
        //    Sponsored: false
        // },
        //   ETH: {...},
        // }
      })
      .catch(console.error);
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
