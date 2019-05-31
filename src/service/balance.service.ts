'use strict';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

//import {fetch} from 'node-fetch';

const apiUrl = 'http://api.zippopotam.us/';
@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) {
  }

  getData(): Observable<any> {
    const response1 = this.http.get(apiUrl + 'US/00210');
    const response2 = this.http.get(apiUrl + 'IN/110001');
    const response3 = this.http.get(apiUrl + 'BR/01000-000');
    const response4 = this.http.get(apiUrl + 'FR/01000');
    return forkJoin([response1, response2, response3, response4]);
  }


}
