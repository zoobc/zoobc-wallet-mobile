/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_empty_pb from '../model/empty_pb';
import * as model_peer_pb from '../model/peer_pb';

export class PeerServiceClient {
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

  methodInfoGetPeers = new grpcWeb.AbstractClientBase.MethodInfo(
    model_peer_pb.GetPeersResponse,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_peer_pb.GetPeersResponse.deserializeBinary
  );

  getPeers(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_peer_pb.GetPeersResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.PeerService/GetPeers',
      request,
      metadata || {},
      this.methodInfoGetPeers,
      callback);
  }

}

