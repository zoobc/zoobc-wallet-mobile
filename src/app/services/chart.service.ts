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


  getDailyData(): Observable<any> {
    let url = this.CRYPTO_API_URL + "/histominute?fsym=XRP&tsym=USD&limit=30&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
  }
 

  getWeeklyData(): Observable<any> { 
    let url = this.CRYPTO_API_URL + "/histohour?fsym=XRP&tsym=USD&limit=30&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
  }

  getMonthlyData(): Observable<any> {
    let url = this.CRYPTO_API_URL + "/histoday?fsym=XRP&tsym=USD&limit=30&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
  }

  getCoinPrice(): Observable<any> {
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ripple&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d';
    return this.http.get(url).pipe(
      map(results => results)
    );
  }
   
  getCoinMarketPrice(arg): Observable<any> {
    let url = this.CRYPTO_API_URL + "/histominute?fsym=XRP&tsym=USD&limit=90&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    if (arg==='week'){
      url = this.CRYPTO_API_URL + "/histohour?fsym=XRP&tsym=USD&limit=30&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    }else if (arg=='month'){
      url = this.CRYPTO_API_URL + "/histoday?fsym=XRP&tsym=USD&limit=30&aggregate=3&e=CCCAGG&api_key=" + this.CRYPTO_KEY;
    }

    //let url = 'https://api.coingecko.com/api/v3/coins/stellar/market_chart?vs_currency=usd&days=30';
    return this.http.get(url).pipe(
      map(results => results['Data'])
    );
  }
}
