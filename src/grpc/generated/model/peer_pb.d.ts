import * as jspb from "google-protobuf"

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

