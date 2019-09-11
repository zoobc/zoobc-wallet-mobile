import { Injectable } from "@angular/core";
import { TransactionServiceClient } from "../grpc/service/transactionServiceClientPb";
import { MempoolServiceClient } from "../grpc/service/mempoolServiceClientPb";

import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
  GetTransactionRequest,
  Transaction
} from "../grpc/model/transaction_pb";

import { MempoolTransaction, GetMempoolTransactionsRequest, GetMempoolTransactionsResponse } from '../grpc/model/mempool_pb';

import { readInt64 } from "src/helpers/converters";

@Injectable({
  providedIn: "root"
})
export class TransactionService {
  grpcUrl = "http://18.139.3.139:7001";

  srvClient: TransactionServiceClient;
  mempoolClient: MempoolServiceClient;

  constructor() {
    this.srvClient = new TransactionServiceClient(this.grpcUrl, null, null);
    this.mempoolClient = new MempoolServiceClient(this.grpcUrl, null, null);
  }


  getUnconfirmTransaction(address: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = new GetMempoolTransactionsRequest();
      request.setLimit(10);
      request.setPage(1);
      request.setAddress(address);

      this.mempoolClient.getMempoolTransactions(
        request,
        null,
        (err, response: GetMempoolTransactionsResponse) => {
          if (err) {
            return reject(err);
          }

          const originTx = response.toObject().mempooltransactionsList;

          const transactions = originTx.map(tx => {
            const bytes = Buffer.from(
              tx.transactionbytes.toString(),
              'base64'
            );

            const trxAmount = readInt64(bytes, 121);
            const trxFee = readInt64(bytes, 109);

            const friendAddress =
            tx.senderaccountaddress === address
              ? tx.recipientaccountaddress
              : tx.senderaccountaddress;

            const trxType = tx.senderaccountaddress === address ? 'send' : 'receive';
            const trxAlias = 'Alias-';
            //  this.contactServ.getContact(friendAddress).alias || '';

            return {
                alias: trxAlias,
                address: friendAddress,
                type: trxType,
                timestamp: parseInt(tx.arrivaltimestamp, 10) * 1000,
                fee: trxFee,
                amount: trxAmount,
              };

          });

          resolve(transactions);
        }
      );

    });
  }

  getAll(account: string): Promise<any[]> {

    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      request.setLimit(10);
      request.setPage(1);
      request.setAccountaddress(account);

      this.srvClient.getTransactions(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) return reject(err);

          let originTx = response.toObject().transactionsList;

          let transactions = originTx.map(tx => {
            const bytes = Buffer.from(
              tx.transactionbodybytes.toString(),
              "base64"
            );
            const amount = readInt64(bytes, 0);
            const friendAddress =
              tx.senderaccountaddress == account
                ? tx.recipientaccountaddress
                : tx.senderaccountaddress;
            const type =
              tx.senderaccountaddress == account ? "send" : "receive";

            return {
              id: tx.id,
              type: type,
              sender: tx.senderaccountaddress,
              recipient: tx.recipientaccountaddress,
              amount: amount,
              fee: parseInt(tx.fee),
              transactionDate: new Date(parseInt(tx.timestamp) * 1000)
            };
          });

          resolve(transactions);
        }
      );
    });
  }

  getOne(transId: string, account: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new GetTransactionRequest();
      request.setId(transId);

      this.srvClient.getTransaction(
        request,
        null,
        (err, response: Transaction) => {
          if (err) return reject(err);

          const _transaction = response.toObject();

          const bytes = Buffer.from(
            _transaction.transactionbodybytes.toString(),
            "base64"
          );

          const type =
            _transaction.senderaccountaddress == account ? "send" : "receive";

          const amount = readInt64(bytes, 0);

          const transaction = {
            id: _transaction.id,
            type: type,
            fee: parseInt(_transaction.fee),
            amount: amount,
            sender: _transaction.senderaccountaddress,
            recipient: _transaction.recipientaccountaddress,
            transactionDate: new Date(parseInt(_transaction.timestamp) * 1000)
          };

          resolve(transaction);
        }
      );
    });
  }
}
