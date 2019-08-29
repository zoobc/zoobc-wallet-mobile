import { Injectable } from "@angular/core";
import { TransactionServiceClient } from "../grpc/service/transactionServiceClientPb";

import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
  GetTransactionRequest,
  Transaction
} from "../grpc/model/transaction_pb";
import { readInt64 } from "src/helpers/converters";

@Injectable({
  providedIn: "root"
})
export class TransactionService {
  grpcUrl = "http://18.139.3.139:7001";

  srvClient: TransactionServiceClient;

  constructor() {
    this.srvClient = new TransactionServiceClient(this.grpcUrl, null, null);
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
