import * as jspb from "google-protobuf"

import * as model_accountBalance_pb from '../model/accountBalance_pb';

export class Account extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  getAccountbalance(): model_accountBalance_pb.AccountBalance | undefined;
  setAccountbalance(value?: model_accountBalance_pb.AccountBalance): void;
  hasAccountbalance(): boolean;
  clearAccountbalance(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    id: number,
    publickey: Uint8Array | string,
    accountbalance?: model_accountBalance_pb.AccountBalance.AsObject,
  }
}

export class GetAccountsResponse extends jspb.Message {
  getAccountsList(): Array<Account>;
  setAccountsList(value: Array<Account>): void;
  clearAccountsList(): void;
  addAccounts(value?: Account, index?: number): Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountsResponse): GetAccountsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAccountsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountsResponse;
  static deserializeBinaryFromReader(message: GetAccountsResponse, reader: jspb.BinaryReader): GetAccountsResponse;
}

export namespace GetAccountsResponse {
  export type AsObject = {
    accountsList: Array<Account.AsObject>,
  }
}

export class GetAccountByPublicKeyRequest extends jspb.Message {
  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountByPublicKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountByPublicKeyRequest): GetAccountByPublicKeyRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccountByPublicKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountByPublicKeyRequest;
  static deserializeBinaryFromReader(message: GetAccountByPublicKeyRequest, reader: jspb.BinaryReader): GetAccountByPublicKeyRequest;
}

export namespace GetAccountByPublicKeyRequest {
  export type AsObject = {
    publickey: Uint8Array | string,
  }
}

