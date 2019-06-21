import * as jspb from "google-protobuf"

import * as model_transaction_pb from '../model/transaction_pb';

export class Block extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getHash(): string;
  setHash(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getTransactionsList(): Array<model_transaction_pb.Transaction>;
  setTransactionsList(value: Array<model_transaction_pb.Transaction>): void;
  clearTransactionsList(): void;
  addTransactions(value?: model_transaction_pb.Transaction, index?: number): model_transaction_pb.Transaction;

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
    transactionsList: Array<model_transaction_pb.Transaction.AsObject>,
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

