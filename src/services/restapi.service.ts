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

  // get hash of transaction
  getHashTransaction(data: string): any{
    const trxHash = 'hashed=' + data;
    console.log('trxHash: ', trxHash)
    return trxHash;
  }

  signingHashTrx(hash: string){
    return hash + 'signet';
  }

  sendMoney(from: string, to: string, amount: any, fee: any): Observable<any> {

    const trxHash = this.getHashTransaction(from + to + amount + fee);
    const signature = this.signingHashTrx(trxHash);
    const postData = {From: from, Recipient: to, Amount: amount, Fee:fee, SignatureHash: signature,  TransactionHash: trxHash}

    console.log(postData);

    let response: any;
    this.http.post(this.apiUrl + '/sendMoney', postData)
    .subscribe(data => {
      console.log(data);
      response = data;
    }, error => {
      response = error;
      console.log(error);
    });

    return forkJoin([response]);
  }

}
