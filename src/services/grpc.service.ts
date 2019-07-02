import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AccountBalancesServiceClient } from "../grpc/generated/service/accountBalanceServiceClientPb";
import { TransactionServiceClient } from "../grpc/generated/service/transactionServiceClientPb";

import {
  GetAccountBalanceRequest,
  AccountBalance
} from "../grpc/generated/model/accountBalance_pb";
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from "../grpc/generated/model/transaction_pb";
import { ACTIVE_ACCOUNT } from "src/environments/variable.const";
import { Storage } from "@ionic/storage";
import { AccountService } from "./account.service";

@Injectable({
  providedIn: "root"
})
export class GRPCService {
  client: AccountBalancesServiceClient;
  txServ: TransactionServiceClient;

  AccountTransaction = [];
  PublicKey: any;

  apiUrl = "https://54.254.196.180:8000";
  grpcUrl = "http://18.139.3.139:8080";

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private accountService: AccountService
  ) {}

  async getAccountTransaction() {
    const account = await this.storage.get("active_account");
    const publicKey = this.accountService.getAccountPublicKey(
      account.accountProps
    );

    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsByAccountPublicKeyRequest();
      request.setAccountpublickey(publicKey);

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

  async getAccountBalance() {
    const account = await this.storage.get("active_account");
    const publicKey = this.accountService.getAccountPublicKey(
      account.accountProps
    );

    this.client = new AccountBalancesServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setPublickey(publicKey);

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
