import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ACTIVE_ACCOUNT } from "src/environments/variable.const";
import { Storage } from "@ionic/storage";
import { AccountService } from "./account.service";
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse
} from "src/app/grpc/model/accountBalance_pb";
import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from "src/app/grpc/model/transaction_pb";
import { readInt64 } from "src/app/helpers/converters";

@Injectable({
  providedIn: "root"
})
export class GRPCService {
  
  AccountTransaction = [];
  PublicKey: any;

  apiUrl = "https://54.254.196.180:8000";
  grpcUrl = "http://18.139.3.139:7001";

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private accountService: AccountService
  ) {}

}
