/**
 * @fileoverview gRPC-Web generated client stub for model
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.model = require('./spinechain_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.AccountServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.AccountServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.Empty,
 *   !proto.model.GetAccountsResponse>}
 */
const methodInfo_AccountService_GetAccounts = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.GetAccountsResponse,
  /** @param {!proto.model.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.GetAccountsResponse.deserializeBinary
);


/**
 * @param {!proto.model.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.GetAccountsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.GetAccountsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.AccountServiceClient.prototype.getAccounts =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.AccountService/GetAccounts',
      request,
      metadata || {},
      methodInfo_AccountService_GetAccounts,
      callback);
};


/**
 * @param {!proto.model.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.GetAccountsResponse>}
 *     A native promise that resolves to the response
 */
proto.model.AccountServicePromiseClient.prototype.getAccounts =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.AccountService/GetAccounts',
      request,
      metadata || {},
      methodInfo_AccountService_GetAccounts);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.GetAccountByPublicKeyRequest,
 *   !proto.model.Account>}
 */
const methodInfo_AccountService_GetAccountByPublicKey = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.Account,
  /** @param {!proto.model.GetAccountByPublicKeyRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.Account.deserializeBinary
);


/**
 * @param {!proto.model.GetAccountByPublicKeyRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.Account)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.Account>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.AccountServiceClient.prototype.getAccountByPublicKey =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.AccountService/GetAccountByPublicKey',
      request,
      metadata || {},
      methodInfo_AccountService_GetAccountByPublicKey,
      callback);
};


/**
 * @param {!proto.model.GetAccountByPublicKeyRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.Account>}
 *     A native promise that resolves to the response
 */
proto.model.AccountServicePromiseClient.prototype.getAccountByPublicKey =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.AccountService/GetAccountByPublicKey',
      request,
      metadata || {},
      methodInfo_AccountService_GetAccountByPublicKey);
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.AccountBalancesServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.AccountBalancesServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.Empty,
 *   !proto.model.GetAccountBalancesResponse>}
 */
const methodInfo_AccountBalancesService_GetAccountBalances = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.GetAccountBalancesResponse,
  /** @param {!proto.model.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.GetAccountBalancesResponse.deserializeBinary
);


/**
 * @param {!proto.model.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.GetAccountBalancesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.GetAccountBalancesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.AccountBalancesServiceClient.prototype.getAccountBalances =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.AccountBalancesService/GetAccountBalances',
      request,
      metadata || {},
      methodInfo_AccountBalancesService_GetAccountBalances,
      callback);
};


/**
 * @param {!proto.model.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.GetAccountBalancesResponse>}
 *     A native promise that resolves to the response
 */
proto.model.AccountBalancesServicePromiseClient.prototype.getAccountBalances =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.AccountBalancesService/GetAccountBalances',
      request,
      metadata || {},
      methodInfo_AccountBalancesService_GetAccountBalances);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.GetAccountBalanceRequest,
 *   !proto.model.AccountBalance>}
 */
const methodInfo_AccountBalancesService_GetAccountBalance = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.AccountBalance,
  /** @param {!proto.model.GetAccountBalanceRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.AccountBalance.deserializeBinary
);


/**
 * @param {!proto.model.GetAccountBalanceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.AccountBalance)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.AccountBalance>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.AccountBalancesServiceClient.prototype.getAccountBalance =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.AccountBalancesService/GetAccountBalance',
      request,
      metadata || {},
      methodInfo_AccountBalancesService_GetAccountBalance,
      callback);
};


/**
 * @param {!proto.model.GetAccountBalanceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.AccountBalance>}
 *     A native promise that resolves to the response
 */
proto.model.AccountBalancesServicePromiseClient.prototype.getAccountBalance =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.AccountBalancesService/GetAccountBalance',
      request,
      metadata || {},
      methodInfo_AccountBalancesService_GetAccountBalance);
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.TransactionServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.model.TransactionServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.GetTransactionsByAccountPublicKeyRequest,
 *   !proto.model.GetTransactionsResponse>}
 */
const methodInfo_TransactionService_GetTransactionsByAccountPublicKey = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.GetTransactionsResponse,
  /** @param {!proto.model.GetTransactionsByAccountPublicKeyRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.GetTransactionsResponse.deserializeBinary
);


/**
 * @param {!proto.model.GetTransactionsByAccountPublicKeyRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.GetTransactionsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.GetTransactionsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.TransactionServiceClient.prototype.getTransactionsByAccountPublicKey =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.TransactionService/GetTransactionsByAccountPublicKey',
      request,
      metadata || {},
      methodInfo_TransactionService_GetTransactionsByAccountPublicKey,
      callback);
};


/**
 * @param {!proto.model.GetTransactionsByAccountPublicKeyRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.GetTransactionsResponse>}
 *     A native promise that resolves to the response
 */
proto.model.TransactionServicePromiseClient.prototype.getTransactionsByAccountPublicKey =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.TransactionService/GetTransactionsByAccountPublicKey',
      request,
      metadata || {},
      methodInfo_TransactionService_GetTransactionsByAccountPublicKey);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.model.GetTransactionsByBlockIDRequest,
 *   !proto.model.GetTransactionsResponse>}
 */
const methodInfo_TransactionService_GetTransactionsByBlockID = new grpc.web.AbstractClientBase.MethodInfo(
  proto.model.GetTransactionsResponse,
  /** @param {!proto.model.GetTransactionsByBlockIDRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.model.GetTransactionsResponse.deserializeBinary
);


/**
 * @param {!proto.model.GetTransactionsByBlockIDRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.model.GetTransactionsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.model.GetTransactionsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.model.TransactionServiceClient.prototype.getTransactionsByBlockID =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/model.TransactionService/GetTransactionsByBlockID',
      request,
      metadata || {},
      methodInfo_TransactionService_GetTransactionsByBlockID,
      callback);
};


/**
 * @param {!proto.model.GetTransactionsByBlockIDRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.model.GetTransactionsResponse>}
 *     A native promise that resolves to the response
 */
proto.model.TransactionServicePromiseClient.prototype.getTransactionsByBlockID =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/model.TransactionService/GetTransactionsByBlockID',
      request,
      metadata || {},
      methodInfo_TransactionService_GetTransactionsByBlockID);
};


module.exports = proto.model;
