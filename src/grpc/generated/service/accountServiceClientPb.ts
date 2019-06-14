/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_account_pb from '../model/account_pb';
import * as model_empty_pb from '../model/empty_pb';

export class AccountServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; }) {
    if (!options) options = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetAccounts = new grpcWeb.AbstractClientBase.MethodInfo(
    model_account_pb.GetAccountsResponse,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_account_pb.GetAccountsResponse.deserializeBinary
  );

  getAccounts(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_account_pb.GetAccountsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountService/GetAccounts',
      request,
      metadata || {},
      this.methodInfoGetAccounts,
      callback);
  }

  methodInfoGetAccountByPublicKey = new grpcWeb.AbstractClientBase.MethodInfo(
    model_account_pb.Account,
    (request: model_account_pb.GetAccountByPublicKeyRequest) => {
      return request.serializeBinary();
    },
    model_account_pb.Account.deserializeBinary
  );

  getAccountByPublicKey(
    request: model_account_pb.GetAccountByPublicKeyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_account_pb.Account) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountService/GetAccountByPublicKey',
      request,
      metadata || {},
      this.methodInfoGetAccountByPublicKey,
      callback);
  }

}

