import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RestapiService {

  apiUrl = 'http://54.254.196.180:8000';

  constructor(private http: HttpClient) { }

  getAccountTransactions(publicKey: string): Observable<any> {
    const response1 = this.http.get(this.apiUrl + '/getAccountTransactions' + '/' + publicKey);
    return forkJoin([response1]);
  }

  getBalance(pKey: string): Observable<any> {
    const response1 = this.http.get(this.apiUrl + '/getBalance' + '/' + pKey);
    // const response2 = this.http.get(this.apiUrl2 + '/getBalance' + '/' + pKey);
    return forkJoin([response1]);
  }

  sendMoney(data: string){

  }


}
