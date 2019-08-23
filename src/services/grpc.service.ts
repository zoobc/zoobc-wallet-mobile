import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ACTIVE_ACCOUNT } from "src/environments/variable.const";
import { Storage } from "@ionic/storage";
import { AccountService } from "./account.service";
import { AccountBalanceServiceClient } from 'src/app/grpc/service/accountBalanceServiceClientPb';
import { GetAccountBalanceRequest, GetAccountBalanceResponse } from 'src/app/grpc/model/accountBalance_pb';
import { TransactionServiceClient } from 'src/app/grpc/service/transactionServiceClientPb';
import { GetTransactionsRequest, GetTransactionsResponse, PostTransactionRequest, PostTransactionResponse } from 'src/app/grpc/model/transaction_pb';
import { readInt64 } from 'src/helpers/converters';

@Injectable({
  providedIn: "root"
})
export class GRPCService {
  client: AccountBalanceServiceClient;
  txServ: TransactionServiceClient;

  AccountTransaction = [];
  PublicKey: any;

  apiUrl = "https://54.254.196.180:8000";
  grpcUrl = "http://18.139.3.139:7001";

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private accountService: AccountService
  ) {}

  async getAccountTransaction() {
    // const account = await this.storage.get("active_account");
    // const publicKey = this.accountService.getAccountPublicKey(
    //   account.accountProps
    // );

    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      request.setLimit(10);
      request.setPage(1)
      request.setAccountaddress('nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd')

      this.txServ.getTransactions(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) return reject(err);

          let originTx = response.toObject().transactionsList
          let transactions = originTx.map(tx => {
            const bytes = Buffer.from(
              tx.transactionbodybytes.toString(),
              'base64'
            );
            const amount = readInt64(bytes, 0);
            const friendAddress =
              tx.senderaccountaddress == 'nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd'
                ? tx.recipientaccountaddress
                : tx.senderaccountaddress;
            const type =
              tx.senderaccountaddress == 'nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd' ? 'send' : 'receive';
​
            return {
              alias: '',
              address: friendAddress,
              type: type,
              timestamp: parseInt(tx.timestamp) * 1000,
              fee: parseInt(tx.fee),
              amount: amount,
            };
          });

          resolve(transactions);
        }
      );
    });
  }

  async getAccountBalance() {
    // const account = await this.storage.get("active_account");
    // const publicKey = this.accountService.getAccountPublicKey(
    //   account.accountProps
    // );

    this.client = new AccountBalanceServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress('nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd')

      this.client.getAccountBalance(
        request,
        null,
        (err, response: GetAccountBalanceResponse) => {
          console.log(response.toObject());
          
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
