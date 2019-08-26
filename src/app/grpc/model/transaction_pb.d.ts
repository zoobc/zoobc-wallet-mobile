import * as jspb from "google-protobuf"

import * as model_proofOfOwnership_pb from '../model/proofOfOwnership_pb';

export class Transaction extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getId(): string;
  setId(value: string): void;

  getBlockid(): string;
  setBlockid(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getSenderaccountaddress(): string;
  setSenderaccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getTransactiontype(): number;
  setTransactiontype(value: number): void;

  getFee(): string;
  setFee(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getTransactionhash(): Uint8Array | string;
  getTransactionhash_asU8(): Uint8Array;
  getTransactionhash_asB64(): string;
  setTransactionhash(value: Uint8Array | string): void;

  getTransactionbodylength(): number;
  setTransactionbodylength(value: number): void;

  getTransactionbodybytes(): Uint8Array | string;
  getTransactionbodybytes_asU8(): Uint8Array;
  getTransactionbodybytes_asB64(): string;
  setTransactionbodybytes(value: Uint8Array | string): void;

  getTransactionindex(): number;
  setTransactionindex(value: number): void;

  getEmptytransactionbody(): EmptyTransactionBody | undefined;
  setEmptytransactionbody(value?: EmptyTransactionBody): void;
  hasEmptytransactionbody(): boolean;
  clearEmptytransactionbody(): void;
  hasEmptytransactionbody(): boolean;

  getSendmoneytransactionbody(): SendMoneyTransactionBody | undefined;
  setSendmoneytransactionbody(value?: SendMoneyTransactionBody): void;
  hasSendmoneytransactionbody(): boolean;
  clearSendmoneytransactionbody(): void;
  hasSendmoneytransactionbody(): boolean;

  getNoderegistrationtransactionbody(): NodeRegistrationTransactionBody | undefined;
  setNoderegistrationtransactionbody(value?: NodeRegistrationTransactionBody): void;
  hasNoderegistrationtransactionbody(): boolean;
  clearNoderegistrationtransactionbody(): void;
  hasNoderegistrationtransactionbody(): boolean;

  getUpdatenoderegistrationtransactionbody(): UpdateNodeRegistrationTransactionBody | undefined;
  setUpdatenoderegistrationtransactionbody(value?: UpdateNodeRegistrationTransactionBody): void;
  hasUpdatenoderegistrationtransactionbody(): boolean;
  clearUpdatenoderegistrationtransactionbody(): void;
  hasUpdatenoderegistrationtransactionbody(): boolean;

  getRemovenoderegistrationtransactionbody(): RemoveNodeRegistrationTransactionBody | undefined;
  setRemovenoderegistrationtransactionbody(value?: RemoveNodeRegistrationTransactionBody): void;
  hasRemovenoderegistrationtransactionbody(): boolean;
  clearRemovenoderegistrationtransactionbody(): void;
  hasRemovenoderegistrationtransactionbody(): boolean;

  getClaimnoderegistrationtransactionbody(): ClaimNodeRegistrationTransactionBody | undefined;
  setClaimnoderegistrationtransactionbody(value?: ClaimNodeRegistrationTransactionBody): void;
  hasClaimnoderegistrationtransactionbody(): boolean;
  clearClaimnoderegistrationtransactionbody(): void;
  hasClaimnoderegistrationtransactionbody(): boolean;

  getSetupaccountdatasettransactionbody(): SetupAccountDatasetTransactionBody | undefined;
  setSetupaccountdatasettransactionbody(value?: SetupAccountDatasetTransactionBody): void;
  hasSetupaccountdatasettransactionbody(): boolean;
  clearSetupaccountdatasettransactionbody(): void;
  hasSetupaccountdatasettransactionbody(): boolean;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getTransactionbodyCase(): Transaction.TransactionbodyCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    version: number,
    id: string,
    blockid: string,
    height: number,
    senderaccountaddress: string,
    recipientaccountaddress: string,
    transactiontype: number,
    fee: string,
    timestamp: string,
    transactionhash: Uint8Array | string,
    transactionbodylength: number,
    transactionbodybytes: Uint8Array | string,
    transactionindex: number,
    emptytransactionbody?: EmptyTransactionBody.AsObject,
    sendmoneytransactionbody?: SendMoneyTransactionBody.AsObject,
    noderegistrationtransactionbody?: NodeRegistrationTransactionBody.AsObject,
    updatenoderegistrationtransactionbody?: UpdateNodeRegistrationTransactionBody.AsObject,
    removenoderegistrationtransactionbody?: RemoveNodeRegistrationTransactionBody.AsObject,
    claimnoderegistrationtransactionbody?: ClaimNodeRegistrationTransactionBody.AsObject,
    setupaccountdatasettransactionbody?: SetupAccountDatasetTransactionBody.AsObject,
    signature: Uint8Array | string,
  }

  export enum TransactionbodyCase { 
    TRANSACTIONBODY_NOT_SET = 0,
    EMPTYTRANSACTIONBODY = 14,
    SENDMONEYTRANSACTIONBODY = 15,
    NODEREGISTRATIONTRANSACTIONBODY = 16,
    UPDATENODEREGISTRATIONTRANSACTIONBODY = 17,
    REMOVENODEREGISTRATIONTRANSACTIONBODY = 18,
    CLAIMNODEREGISTRATIONTRANSACTIONBODY = 19,
    SETUPACCOUNTDATASETTRANSACTIONBODY = 20,
  }
}

export class EmptyTransactionBody extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyTransactionBody): EmptyTransactionBody.AsObject;
  static serializeBinaryToWriter(message: EmptyTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyTransactionBody;
  static deserializeBinaryFromReader(message: EmptyTransactionBody, reader: jspb.BinaryReader): EmptyTransactionBody;
}

export namespace EmptyTransactionBody {
  export type AsObject = {
  }
}

export class SendMoneyTransactionBody extends jspb.Message {
  getAmount(): string;
  setAmount(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMoneyTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: SendMoneyTransactionBody): SendMoneyTransactionBody.AsObject;
  static serializeBinaryToWriter(message: SendMoneyTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMoneyTransactionBody;
  static deserializeBinaryFromReader(message: SendMoneyTransactionBody, reader: jspb.BinaryReader): SendMoneyTransactionBody;
}

export namespace SendMoneyTransactionBody {
  export type AsObject = {
    amount: string,
  }
}

export class NodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;
  hasPoown(): boolean;
  clearPoown(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: NodeRegistrationTransactionBody): NodeRegistrationTransactionBody.AsObject;
  static serializeBinaryToWriter(message: NodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: NodeRegistrationTransactionBody, reader: jspb.BinaryReader): NodeRegistrationTransactionBody;
}

export namespace NodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    nodeaddress: string,
    lockedbalance: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class UpdateNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;
  hasPoown(): boolean;
  clearPoown(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateNodeRegistrationTransactionBody): UpdateNodeRegistrationTransactionBody.AsObject;
  static serializeBinaryToWriter(message: UpdateNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: UpdateNodeRegistrationTransactionBody, reader: jspb.BinaryReader): UpdateNodeRegistrationTransactionBody;
}

export namespace UpdateNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    nodeaddress: string,
    lockedbalance: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class SetupAccountDatasetTransactionBody extends jspb.Message {
  getSetteraccountaddress(): string;
  setSetteraccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getProperty(): string;
  setProperty(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getMuchtime(): string;
  setMuchtime(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetupAccountDatasetTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: SetupAccountDatasetTransactionBody): SetupAccountDatasetTransactionBody.AsObject;
  static serializeBinaryToWriter(message: SetupAccountDatasetTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetupAccountDatasetTransactionBody;
  static deserializeBinaryFromReader(message: SetupAccountDatasetTransactionBody, reader: jspb.BinaryReader): SetupAccountDatasetTransactionBody;
}

export namespace SetupAccountDatasetTransactionBody {
  export type AsObject = {
    setteraccountaddress: string,
    recipientaccountaddress: string,
    property: string,
    value: string,
    muchtime: string,
  }
}

export class RemoveNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveNodeRegistrationTransactionBody): RemoveNodeRegistrationTransactionBody.AsObject;
  static serializeBinaryToWriter(message: RemoveNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: RemoveNodeRegistrationTransactionBody, reader: jspb.BinaryReader): RemoveNodeRegistrationTransactionBody;
}

export namespace RemoveNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
  }
}

export class ClaimNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;
  hasPoown(): boolean;
  clearPoown(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimNodeRegistrationTransactionBody): ClaimNodeRegistrationTransactionBody.AsObject;
  static serializeBinaryToWriter(message: ClaimNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: ClaimNodeRegistrationTransactionBody, reader: jspb.BinaryReader): ClaimNodeRegistrationTransactionBody;
}

export namespace ClaimNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class GetTransactionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionRequest): GetTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionRequest;
  static deserializeBinaryFromReader(message: GetTransactionRequest, reader: jspb.BinaryReader): GetTransactionRequest;
}

export namespace GetTransactionRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetTransactionsRequest extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): void;

  getPage(): number;
  setPage(value: number): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsRequest): GetTransactionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsRequest;
  static deserializeBinaryFromReader(message: GetTransactionsRequest, reader: jspb.BinaryReader): GetTransactionsRequest;
}

export namespace GetTransactionsRequest {
  export type AsObject = {
    limit: number,
    page: number,
    accountaddress: string,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getTotal(): string;
  setTotal(value: string): void;

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
    total: string,
    transactionsList: Array<Transaction.AsObject>,
  }
}

export class PostTransactionRequest extends jspb.Message {
  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PostTransactionRequest): PostTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: PostTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostTransactionRequest;
  static deserializeBinaryFromReader(message: PostTransactionRequest, reader: jspb.BinaryReader): PostTransactionRequest;
}

export namespace PostTransactionRequest {
  export type AsObject = {
    transactionbytes: Uint8Array | string,
  }
}

export class PostTransactionResponse extends jspb.Message {
  getTransaction(): Transaction | undefined;
  setTransaction(value?: Transaction): void;
  hasTransaction(): boolean;
  clearTransaction(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PostTransactionResponse): PostTransactionResponse.AsObject;
  static serializeBinaryToWriter(message: PostTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostTransactionResponse;
  static deserializeBinaryFromReader(message: PostTransactionResponse, reader: jspb.BinaryReader): PostTransactionResponse;
}

export namespace PostTransactionResponse {
  export type AsObject = {
    transaction?: Transaction.AsObject,
  }
}

export class SendTransactionRequest extends jspb.Message {
  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendTransactionRequest): SendTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: SendTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendTransactionRequest;
  static deserializeBinaryFromReader(message: SendTransactionRequest, reader: jspb.BinaryReader): SendTransactionRequest;
}

export namespace SendTransactionRequest {
  export type AsObject = {
    transactionbytes: Uint8Array | string,
  }
}

