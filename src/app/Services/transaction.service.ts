import { Injectable } from "@angular/core";

import { readInt64 } from "src/helpers/converters";
import { environment } from "src/environments/environment";
import { TransactionServiceClient } from "externals/grpc/service/transactionServiceClientPb";
import { Pagination, OrderBy } from "externals/grpc/model/pagination_pb";
import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetTransactionRequest,
  Transaction
} from "externals/grpc/model/transaction_pb";
import {
  GetMempoolTransactionRequest,
  GetMempoolTransactionsRequest,
  GetMempoolTransactionsResponse
} from "externals/grpc/model/mempool_pb";
import { MempoolServiceClient } from "externals/grpc/service/mempoolServiceClientPb";

@Injectable({
  providedIn: "root"
})
export class TransactionService {
  transactionSrvClient: TransactionServiceClient;
  mempoolSrvClient: MempoolServiceClient;

  getAll(
    account: string,
    limit: number = 10,
    page: number = 1
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const pagination = new Pagination();
      pagination.setLimit(limit);
      pagination.setPage(page);

      const request = new GetTransactionsRequest();
      request.setPagination(pagination);
      request.setAccountaddress(account);
      request.setTransactiontype(1);

      const transactionSrvClient = new TransactionServiceClient(
        environment.grpcUrl
      );

      transactionSrvClient.getTransactions(
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

      const transactionSrvClient = new TransactionServiceClient(
        environment.grpcUrl
      );

      transactionSrvClient.getTransaction(
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
            blockId: _transaction.blockid,
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

  getPendingTransaction(address: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const pagination = new Pagination();
      pagination.setOrderby(OrderBy.DESC);

      const request = new GetMempoolTransactionsRequest();
      request.setPagination(pagination);
      request.setAddress(address);

      const mempoolSrvClient = new MempoolServiceClient(environment.grpcUrl);

      mempoolSrvClient.getMempoolTransactions(
        request,
        null,
        (err, response: GetMempoolTransactionsResponse) => {
          if (err) return reject(err);

          let originTx = response.toObject().mempooltransactionsList;

          let transactions = originTx.map(tx => {
            const bytes = Buffer.from(tx.transactionbytes.toString(), "base64");

            const friendAddress =
              tx.senderaccountaddress == address
                ? tx.recipientaccountaddress
                : tx.senderaccountaddress;
            const type =
              tx.senderaccountaddress == address ? "send" : "receive";

            const amount = readInt64(bytes, 121);
            const fee = readInt64(bytes, 109);

            return {
              id: tx.id,
              type: type,
              sender: tx.senderaccountaddress,
              recipient: tx.recipientaccountaddress,
              amount,
              fee,
              transactionDate: new Date(parseInt(tx.arrivaltimestamp) * 1000)
            };
          });

          resolve(transactions);
        }
      );
    });
  }
}
