import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

const apiUrl = 'http://54.254.196.180:8000/getAccountTransactions/';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  getData(publicKey: string): Observable<any> {
    const response1 = this.http.get(apiUrl + publicKey);
    // const response2 = this.http.get(apiUrl + 'IN/110001');
    // const response3 = this.http.get(apiUrl + 'BR/01000-000');
    // const response4 = this.http.get(apiUrl + 'FR/01000');
    //return forkJoin([response1, response2, response3, response4]);
    return forkJoin([response1]);
  }

}
