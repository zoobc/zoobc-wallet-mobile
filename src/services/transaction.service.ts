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
    return forkJoin([response1]);
  }

}
