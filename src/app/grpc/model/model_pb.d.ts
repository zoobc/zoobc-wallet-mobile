import * as jspb from "google-protobuf"

export class Block extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getHash(): string;
  setHash(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): void;
  clearTransactionsList(): void;
  addTransactions(value?: Transaction, index?: number): Transaction;

  getGenerator(): Uint8Array | string;
  getGenerator_asU8(): Uint8Array;
  getGenerator_asB64(): string;
  setGenerator(value: Uint8Array | string): void;

  getTotalamountnqt(): number;
  setTotalamountnqt(value: number): void;

  getTotalfeenqt(): number;
  setTotalfeenqt(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: number,
    hash: string,
    height: number,
    timestamp: number,
    transactionsList: Array<Transaction.AsObject>,
    generator: Uint8Array | string,
    totalamountnqt: number,
    totalfeenqt: number,
  }
}

export class GetBlocksRequest extends jspb.Message {
  getBlocksize(): number;
  setBlocksize(value: number): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksRequest): GetBlocksRequest.AsObject;
  static serializeBinaryToWriter(message: GetBlocksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksRequest;
  static deserializeBinaryFromReader(message: GetBlocksRequest, reader: jspb.BinaryReader): GetBlocksRequest;
}

export namespace GetBlocksRequest {
  export type AsObject = {
    blocksize: number,
    blockheight: number,
  }
}

export class GetBlocksResponse extends jspb.Message {
  getBlocksize(): number;
  setBlocksize(value: number): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  getBlocksList(): Array<Block>;
  setBlocksList(value: Array<Block>): void;
  clearBlocksList(): void;
  addBlocks(value?: Block, index?: number): Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksResponse): GetBlocksResponse.AsObject;
  static serializeBinaryToWriter(message: GetBlocksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksResponse;
  static deserializeBinaryFromReader(message: GetBlocksResponse, reader: jspb.BinaryReader): GetBlocksResponse;
}

export namespace GetBlocksResponse {
  export type AsObject = {
    blocksize: number,
    blockheight: number,
    blocksList: Array<Block.AsObject>,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class Peer extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getAnnouncedaddress(): string;
  setAnnouncedaddress(value: string): void;

  getPort(): number;
  setPort(value: number): void;

  getState(): Peer.StateEnum;
  setState(value: Peer.StateEnum): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Peer.AsObject;
  static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
  static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Peer;
  static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
}

export namespace Peer {
  export type AsObject = {
    address: string,
    announcedaddress: string,
    port: number,
    state: Peer.StateEnum,
    version: string,
  }

  export enum StateEnum { 
    NON_CONNECTED = 0,
    CONNECTED = 1, 
    DISCONNECTED = 2,
    BLACKLISTED = 3,
  }
}

export class GetPeersResponse extends jspb.Message {
  getPeersList(): Array<Peer>;
  setPeersList(value: Array<Peer>): void;
  clearPeersList(): void;
  addPeers(value?: Peer, index?: number): Peer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPeersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPeersResponse): GetPeersResponse.AsObject;
  static serializeBinaryToWriter(message: GetPeersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPeersResponse;
  static deserializeBinaryFromReader(message: GetPeersResponse, reader: jspb.BinaryReader): GetPeersResponse;
}

export namespace GetPeersResponse {
  export type AsObject = {
    peersList: Array<Peer.AsObject>,
  }
}

export class Transaction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getBlockid(): number;
  setBlockid(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  getSenderpublickey(): Uint8Array | string;
  getSenderpublickey_asU8(): Uint8Array;
  getSenderpublickey_asB64(): string;
  setSenderpublickey(value: Uint8Array | string): void;

  getRecipientpublickey(): Uint8Array | string;
  getRecipientpublickey_asU8(): Uint8Array;
  getRecipientpublickey_asB64(): string;
  setRecipientpublickey(value: Uint8Array | string): void;

  getAmountnqt(): number;
  setAmountnqt(value: number): void;

  getFeenqt(): number;
  setFeenqt(value: number): void;

  getEcblockheight(): number;
  setEcblockheight(value: number): void;

  getEcblockid(): number;
  setEcblockid(value: number): void;

  getVersion(): Uint8Array | string;
  getVersion_asU8(): Uint8Array;
  getVersion_asB64(): string;
  setVersion(value: Uint8Array | string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getType(): Uint8Array | string;
  getType_asU8(): Uint8Array;
  getType_asB64(): string;
  setType(value: Uint8Array | string): void;

  getSubtype(): Uint8Array | string;
  getSubtype_asU8(): Uint8Array;
  getSubtype_asB64(): string;
  setSubtype(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    id: number,
    blockid: number,
    deadline: number,
    senderpublickey: Uint8Array | string,
    recipientpublickey: Uint8Array | string,
    amountnqt: number,
    feenqt: number,
    ecblockheight: number,
    ecblockid: number,
    version: Uint8Array | string,
    timestamp: number,
    signature: Uint8Array | string,
    type: Uint8Array | string,
    subtype: Uint8Array | string,
    height: number,
    hash: string,
  }
}

export class GetTransactionsByAccountPublicKeyRequest extends jspb.Message {
  getAccountpublickey(): Uint8Array | string;
  getAccountpublickey_asU8(): Uint8Array;
  getAccountpublickey_asB64(): string;
  setAccountpublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsByAccountPublicKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsByAccountPublicKeyRequest): GetTransactionsByAccountPublicKeyRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsByAccountPublicKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsByAccountPublicKeyRequest;
  static deserializeBinaryFromReader(message: GetTransactionsByAccountPublicKeyRequest, reader: jspb.BinaryReader): GetTransactionsByAccountPublicKeyRequest;
}

export namespace GetTransactionsByAccountPublicKeyRequest {
  export type AsObject = {
    accountpublickey: Uint8Array | string,
  }
}

export class GetTransactionsByBlockIDRequest extends jspb.Message {
  getBlockid(): number;
  setBlockid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsByBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsByBlockIDRequest): GetTransactionsByBlockIDRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsByBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsByBlockIDRequest;
  static deserializeBinaryFromReader(message: GetTransactionsByBlockIDRequest, reader: jspb.BinaryReader): GetTransactionsByBlockIDRequest;
}

export namespace GetTransactionsByBlockIDRequest {
  export type AsObject = {
    blockid: number,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): void;
  clearTransactionsList(): void;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsResponse): GetTransactionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsResponse;
  static deserializeBinaryFromReader(message: GetTransactionsResponse, reader: jspb.BinaryReader): GetTransactionsResponse;
}

export namespace GetTransactionsResponse {
  export type AsObject = {
    transactionsList: Array<Transaction.AsObject>,
  }
}

export class AccountBalance extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  getBalance(): number;
  setBalance(value: number): void;

  getUnconfirmedbalance(): number;
  setUnconfirmedbalance(value: number): void;

  getForgedbalance(): number;
  setForgedbalance(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountBalance.AsObject;
  static toObject(includeInstance: boolean, msg: AccountBalance): AccountBalance.AsObject;
  static serializeBinaryToWriter(message: AccountBalance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountBalance;
  static deserializeBinaryFromReader(message: AccountBalance, reader: jspb.BinaryReader): AccountBalance;
}

export namespace AccountBalance {
  export type AsObject = {
    id: number,
    publickey: Uint8Array | string,
    balance: number,
    unconfirmedbalance: number,
    forgedbalance: number,
    height: number,
  }
}

export class GetAccountBalancesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalancesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalancesRequest): GetAccountBalancesRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccountBalancesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalancesRequest;
  static deserializeBinaryFromReader(message: GetAccountBalancesRequest, reader: jspb.BinaryReader): GetAccountBalancesRequest;
}

export namespace GetAccountBalancesRequest {
  export type AsObject = {
  }
}

export class GetAccountBalancesResponse extends jspb.Message {
  getAccountbalancesList(): Array<AccountBalance>;
  setAccountbalancesList(value: Array<AccountBalance>): void;
  clearAccountbalancesList(): void;
  addAccountbalances(value?: AccountBalance, index?: number): AccountBalance;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalancesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalancesResponse): GetAccountBalancesResponse.AsObject;
  static serializeBinaryToWriter(message: GetAccountBalancesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalancesResponse;
  static deserializeBinaryFromReader(message: GetAccountBalancesResponse, reader: jspb.BinaryReader): GetAccountBalancesResponse;
}

export namespace GetAccountBalancesResponse {
  export type AsObject = {
    accountbalancesList: Array<AccountBalance.AsObject>,
  }
}

export class GetAccountBalanceRequest extends jspb.Message {
  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalanceRequest): GetAccountBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccountBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalanceRequest;
  static deserializeBinaryFromReader(message: GetAccountBalanceRequest, reader: jspb.BinaryReader): GetAccountBalanceRequest;
}

export namespace GetAccountBalanceRequest {
  export type AsObject = {
    publickey: Uint8Array | string,
  }
}

export class Account extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  getAccountbalance(): AccountBalance | undefined;
  setAccountbalance(value?: AccountBalance): void;
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
    accountbalance?: AccountBalance.AsObject,
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

