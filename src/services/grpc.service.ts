import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountBalancesServiceClient } from '../grpc/generated/service/accountBalanceServiceClientPb';
import { TransactionServiceClient } from '../grpc/generated/service/transactionServiceClientPb';

import {
  GetAccountBalanceRequest,
  AccountBalance
} from '../grpc/generated/model/accountBalance_pb';
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from '../grpc/generated/model/transaction_pb';

@Injectable({
  providedIn: 'root'
})
export class GrpcapiService {
  client: AccountBalancesServiceClient;
  txServ: TransactionServiceClient;

  AccountTransaction = [];
  PublicKey: any;

  apiUrl = 'http://54.254.196.180:8000';
  grpcUrl = 'http://18.139.3.139:8080';

  constructor(private http: HttpClient) {
  }

  getAccountTransaction() {
    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsByAccountPublicKeyRequest();
      request.setAccountpublickey(this.PublicKey);

      this.txServ.getTransactionsByAccountPublicKey(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  getAccountBalance() {
    const account = "242,71,255,92,144,93,48,182,91,196,152,28,137,238,74,71,200,58,142,46,223,176,10,137,139,243,246,29,169,46,114,107"
    this.PublicKey = new Uint8Array(account.split(",").map(Number));

    this.client = new AccountBalancesServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      console.log(this.PublicKey);
      request.setPublickey(this.PublicKey);

      this.client.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  postTransaction(txBytes) {
    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
    // return this.http.post(`${this.apiUrl}/sendMoney`, data);

    return new Promise((resolve, reject) => {
      // const {
      //   recipient,
      //   amount,
      //   fee,
      //   from,
      //   senderPublicKey,
      //   signatureHash,
      //   timestamp
      // } = data;
      // let dataString = `${recipient}${amount}${fee}${from}${senderPublicKey}${signatureHash}${timestamp}`;
      // let dataSHA = sha512.sha512(dataString);

      // const binary_string = window.atob(dataSHA);
      // const len = binary_string.length;
      // const dataBytes = new Uint8Array(len);
      // for (let i = 0; i < len; i++) {
      //   dataBytes[i] = binary_string.charCodeAt(i);
      // }

      const request = new PostTransactionRequest();
      request.setTransactionbytes(txBytes);

      this.txServ.postTransaction(
        request,
        null,
        (err, response: PostTransactionResponse) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }
}
