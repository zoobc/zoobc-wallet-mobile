'use strict';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

const apiUrl = 'http://54.254.196.180:8000/getBalance/';
@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) {
  }

  getData(pKey: string): Observable<any> {
    const response1 = this.http.get(apiUrl + pKey);
    // const response2 = this.http.get(apiUrl + 'IN/110001');
    return forkJoin([response1]);
  }

}
