import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';

import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetTransactionRequest,
  Transaction as TransactionResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../Grpc/model/transaction_pb';
import {
  GetMempoolTransactionsRequest,
  GetMempoolTransactionsResponse,
} from '../Grpc/model/mempool_pb';
import { TransactionService as TransactionServ } from '../Grpc/service/transaction_pb_service';
import { MempoolService } from '../Grpc/service/mempool_pb_service';

import { environment } from '../../environments/environment';
import { Pagination, OrderBy } from '../Grpc/model/pagination_pb';
import { readInt64, makeShortAddress } from 'src/app/Helpers/converters';
import { GetAccountBalanceRequest, GetAccountBalanceResponse } from '../Grpc/model/accountBalance_pb';
import { AccountBalanceService } from '../Grpc/service/accountBalance_pb_service';
import { AddressBookService } from './address-book.service';
import { Subject } from 'rxjs';


export interface Transaction {
  id: string;
  alias: string;
  address: string;
  sender: string;
  recipient: string;
  timestamp: number;
  fee: number;
  type: string;
  amount: number;
  blockId: string;
  height: number;
  transactionIndex: number;
}

export interface Transactions {
  total: number;
  transactions: Transaction[];
}


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  srvClient: TransactionService;
  mempoolClient: MempoolService;
  alladdress: any;
  private rpcUrl = environment.grpcUrl;

  public sendMoneySubject: Subject<any> = new Subject<any>();

  constructor(private addressBookSrv: AddressBookService) {

  }


  getRpcUrl() {
    return this.rpcUrl;
  }

  getUnconfirmTransaction(address: string) {

    const addresses = this.addressBookSrv.getAll();
    console.log(' ===== addresses: ', addresses);

    return new Promise((resolve, reject) => {
      const request = new GetMempoolTransactionsRequest();
      const pagination = new Pagination();
      pagination.setOrderby(OrderBy.DESC);
      request.setAddress(address);
      request.setPagination(pagination);

      grpc.invoke(MempoolService.GetMempoolTransactions, {
        request,
        host: this.rpcUrl,
        onMessage: (message: GetMempoolTransactionsResponse) => {
          // recreate list of transactions
          const transactions = message
            .toObject()
            .mempooltransactionsList.map(tx => {
              const bytes = Buffer.from(
                tx.transactionbytes.toString(),
                'base64'
              );

              const amount = readInt64(bytes, 121);
              const fee = readInt64(bytes, 109);

              const friendAddress =
                tx.senderaccountaddress === address
                  ? tx.recipientaccountaddress
                  : tx.senderaccountaddress;
              const type =
                tx.senderaccountaddress === address ? 'send' : 'receive';
              const alias = '';

              return {
                alias,
                sender: tx.senderaccountaddress,
                recipient: tx.recipientaccountaddress,
                name: this.getNameByAddress(friendAddress, addresses),
                shortaddress: makeShortAddress(friendAddress),
                address: friendAddress,
                type,
                timestamp: parseInt(tx.arrivaltimestamp, 10) * 1000,
                fee,
                amount,
              };
            });

          resolve(transactions);
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code !== grpc.Code.OK) { reject(msg); }
        },
      });
    });
  }

  getAccountTransaction(
    page: number,
    limit: number,
    address: string
  ) {

    const addresses = this.addressBookSrv.getAll();
    console.log(' ===== addresses: ', addresses);

    // const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      const pagination = new Pagination();
      pagination.setLimit(limit);
      pagination.setPage(page);
      pagination.setOrderby(OrderBy.DESC);
      request.setAccountaddress(address);
      request.setPagination(pagination);
      request.setTransactiontype(1);

      grpc.invoke(TransactionServ.GetTransactions, {
        request,
        host: this.rpcUrl,
        onMessage: (message: GetTransactionsResponse) => {
          // recreate list of transactions
          const transactions: Transaction[] = message
            .toObject()
            .transactionsList.map(tx => {
              const bytes = Buffer.from(
                tx.transactionbodybytes.toString(),
                'base64'
              );
              const amount = readInt64(bytes, 0);
              const friendAddress =
                tx.senderaccountaddress === address
                  ? tx.recipientaccountaddress
                  : tx.senderaccountaddress;
              const type =
                tx.senderaccountaddress === address ? 'send' : 'receive';
              const alias = '';


              return {
                id: tx.id,
                alias,
                name: this.getNameByAddress(friendAddress, addresses),
                shortaddress: makeShortAddress(friendAddress),
                address: friendAddress,
                type,
                timestamp: parseInt(tx.timestamp, 10) * 1000,
                fee: Number(tx.fee),
                amount,
                blockId: tx.blockid,
                height: tx.height,
                transactionIndex: tx.transactionindex,
                sender: '',
                recipient: '',
              };
            });

          resolve({
            total: message.toObject().total,
            transactions,
          });
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code !== grpc.Code.OK) { reject(msg); }
        },
      });
    });
  }

  getNameByAddress(address: string, alldress: any) {
    let name = '';
    if (alldress && alldress.__zone_symbol__value) {
      console.log('=== Name: ', alldress.__zone_symbol__value);

      alldress.__zone_symbol__value.forEach((obj: { name: any; address: string; }) => {
        if (String(address).valueOf() === String(obj.address).valueOf()) {
          name = obj.name;
        }
      });
    }
    return name;
  }

  getTransaction(id) {

    const addresses = this.addressBookSrv.getAll();

    return new Promise((resolve, reject) => {
      const request = new GetTransactionRequest();
      request.setId(id);

      grpc.invoke(TransactionServ.GetTransaction, {
        request,
        host: this.rpcUrl,
        onMessage: (message: TransactionResponse) => {
          const tx = message.toObject();

          const bytes = Buffer.from(
            tx.transactionbodybytes.toString(),
            'base64'
          );
          const amount = readInt64(bytes, 0);

          resolve({
            id: tx.id,
            alias: '',
            address: '',
            type: tx.transactiontype,
            timestamp: parseInt(tx.timestamp, 10) * 1000,
            fee: Number(tx.fee),
            amount,
            blockId: tx.blockid,
            height: tx.height,
            transactionIndex: tx.transactionindex,
            sender: this.getNameByAddress(tx.senderaccountaddress, addresses),
            recipient: this.getNameByAddress(tx.recipientaccountaddress, addresses),
          });
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code !== grpc.Code.OK) { reject(msg); }
        },
      });
    });
  }

  postTransaction(txBytes: any ) {

    console.log('============ postTransaction rpcURL:', this.rpcUrl);

    return new Promise((resolve, reject) => {
      const request = new PostTransactionRequest();
      request.setTransactionbytes(txBytes);
      grpc.invoke(TransactionServ.PostTransaction, {
        request,
        host: this.rpcUrl,
        onMessage: (message: PostTransactionResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code !== grpc.Code.OK) { 
            reject(msg);
          }
        },
      });
    }).finally( () => {
        console.log('=========== finally on post Transaction');
        this.sendMoneySubject.next();
      }
    );
    // .catch((error) => {
    //     console.log('===== eroor:', error);
    // });
  }

  getAccountBalance(address: string) {
    // const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress(address);
      grpc.invoke(AccountBalanceService.GetAccountBalance, {
        request,
        host: this.rpcUrl,
        onMessage: (message: GetAccountBalanceResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code === grpc.Code.Unknown) {
            reject(msg);
          } else if (code !== grpc.Code.OK) { reject(msg); }
        },
      });
    });
  }

  convertTransaction() { }

}
