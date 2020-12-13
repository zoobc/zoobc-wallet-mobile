import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  apiKey = 'a83286c854d012d8c5e3d02c225abba04b8a4ce11f0373ca234509f2a48f33b0';
     url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&excludeCategories=Sponsored';
  result: any;

  constructor(private http: HttpClient) { }


  getNews(): Observable<object> {
    const endpoint = `${this.url}&api_key=${this.apiKey}`;
    console.log('== endpoint', endpoint);
    return this.http.get(endpoint);
  }
}
