import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ACTIVE_ACCOUNT } from "src/environments/variable.const";
import { Storage } from "@ionic/storage";
import { AccountService } from "./account.service";
import { readInt64 } from "src/app/helpers/converters";
import { AccountBalanceServiceClient } from "externals/grpc/service/accountBalanceServiceClientPb";
import { TransactionServiceClient } from "externals/grpc/service/transactionServiceClientPb";
import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from "externals/grpc/model/transaction_pb";
import { Pagination } from "externals/grpc/model/pagination_pb";
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse
} from "externals/grpc/model/accountBalance_pb";

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
    const account = await this.storage.get("active_account");
    console.log(account);

    const address = this.accountService.getAccountAddress(account);
    console.log("address: ", address);

    // const account = await this.storage.get("active_account");
    // const publicKey = this.accountService.getAccountPublicKey(
    //   account.accountProps
    // );

    this.txServ = new TransactionServiceClient(this.grpcUrl, null);
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      const pagination = new Pagination();
      pagination.setLimit(10);
      pagination.setPage(1);
      request.setPagination(pagination);
      request.setAccountaddress(address);

      this.txServ.getTransactions(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) {
            if (err.code == 2) {
              return resolve({
                accountbalance: {
                  balance: 0,
                  spendablebalance: 0
                }
              });
            } else return reject(err);
          }
          console.log(response.toObject());

          if (err) return reject(err);
          let originTx = response.toObject().transactionsList;
          let transactions = originTx.map(tx => {
            const bytes = Buffer.from(
              tx.transactionbodybytes.toString(),
              "base64"
            );
            const amount = readInt64(bytes, 0);
            const friendAddress =
              tx.senderaccountaddress == address
                ? tx.recipientaccountaddress
                : tx.senderaccountaddress;
            const type =
              tx.senderaccountaddress == address ? "send" : "receive";
            return {
              alias: "",
              address: friendAddress,
              type: type,
              timestamp: parseInt(tx.timestamp) * 1000,
              fee: parseInt(tx.fee),
              amount: amount
            };
          });

          resolve(transactions);
        }
      );
    });
  }

  async getAccountBalance() {
    const account = await this.storage.get("active_account");
    console.log(account);

    const address = this.accountService.getAccountAddress(account);
    console.log("address: ", address);
    // const publicKey = this.accountService.getAccountPublicKey(
    //   account.accountProps
    // );

    this.client = new AccountBalanceServiceClient(this.grpcUrl, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress(address);

      this.client.getAccountBalance(
        request,
        null,
        (err, response: GetAccountBalanceResponse) => {
          if (err) {
            if (err.code == 2) {
              return resolve({
                accountbalance: {
                  balance: 0,
                  spendablebalance: 0
                }
              });
            } else return reject(err);
          }
          console.log(response.toObject());

          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  postTransaction(txBytes) {
    this.txServ = new TransactionServiceClient(this.grpcUrl, null);
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

          console.log(response.toObject());
          resolve(response.toObject());
        }
      );
    });
  }
}
