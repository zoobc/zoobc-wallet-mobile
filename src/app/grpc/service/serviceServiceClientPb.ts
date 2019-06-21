/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_model_pb from '../model/model_pb';

export class TransactionServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; }) {
    if (!options) options = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetTransactionsByAccountPublicKey = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.GetTransactionsResponse,
    (request: model_model_pb.GetTransactionsByAccountPublicKeyRequest) => {
      return request.serializeBinary();
    },
    model_model_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsByAccountPublicKey(
    request: model_model_pb.GetTransactionsByAccountPublicKeyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.GetTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransactionsByAccountPublicKey',
      request,
      metadata || {},
      this.methodInfoGetTransactionsByAccountPublicKey,
      callback);
  }

  methodInfoGetTransactionsByBlockID = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.GetTransactionsResponse,
    (request: model_model_pb.GetTransactionsByBlockIDRequest) => {
      return request.serializeBinary();
    },
    model_model_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsByBlockID(
    request: model_model_pb.GetTransactionsByBlockIDRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.GetTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransactionsByBlockID',
      request,
      metadata || {},
      this.methodInfoGetTransactionsByBlockID,
      callback);
  }

}

export class AccountBalancesServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; }) {
    if (!options) options = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetAccountBalances = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.GetAccountBalancesResponse,
    (request: model_model_pb.Empty) => {
      return request.serializeBinary();
    },
    model_model_pb.GetAccountBalancesResponse.deserializeBinary
  );

  getAccountBalances(
    request: model_model_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.GetAccountBalancesResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountBalancesService/GetAccountBalances',
      request,
      metadata || {},
      this.methodInfoGetAccountBalances,
      callback);
  }

  methodInfoGetAccountBalance = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.AccountBalance,
    (request: model_model_pb.GetAccountBalanceRequest) => {
      return request.serializeBinary();
    },
    model_model_pb.AccountBalance.deserializeBinary
  );

  getAccountBalance(
    request: model_model_pb.GetAccountBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.AccountBalance) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountBalancesService/GetAccountBalance',
      request,
      metadata || {},
      this.methodInfoGetAccountBalance,
      callback);
  }

}

export class AccountServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; }) {
    if (!options) options = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetAccounts = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.GetAccountsResponse,
    (request: model_model_pb.Empty) => {
      return request.serializeBinary();
    },
    model_model_pb.GetAccountsResponse.deserializeBinary
  );

  getAccounts(
    request: model_model_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.GetAccountsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountService/GetAccounts',
      request,
      metadata || {},
      this.methodInfoGetAccounts,
      callback);
  }

  methodInfoGetAccountByPublicKey = new grpcWeb.AbstractClientBase.MethodInfo(
    model_model_pb.Account,
    (request: model_model_pb.GetAccountByPublicKeyRequest) => {
      return request.serializeBinary();
    },
    model_model_pb.Account.deserializeBinary
  );

  getAccountByPublicKey(
    request: model_model_pb.GetAccountByPublicKeyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_model_pb.Account) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountService/GetAccountByPublicKey',
      request,
      metadata || {},
      this.methodInfoGetAccountByPublicKey,
      callback);
  }

}

