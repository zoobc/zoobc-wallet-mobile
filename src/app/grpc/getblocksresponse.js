/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.model.GetBlocksResponse');

goog.require('jspb.BinaryReader');
goog.require('jspb.BinaryWriter');
goog.require('jspb.Message');
goog.require('proto.model.Block');

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.model.GetBlocksResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.model.GetBlocksResponse.repeatedFields_, null);
};
goog.inherits(proto.model.GetBlocksResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.model.GetBlocksResponse.displayName = 'proto.model.GetBlocksResponse';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.model.GetBlocksResponse.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.model.GetBlocksResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.model.GetBlocksResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.model.GetBlocksResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.GetBlocksResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    blocksize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
    blocksList: jspb.Message.toObjectList(msg.getBlocksList(),
    proto.model.Block.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.model.GetBlocksResponse}
 */
proto.model.GetBlocksResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.model.GetBlocksResponse;
  return proto.model.GetBlocksResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.model.GetBlocksResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.model.GetBlocksResponse}
 */
proto.model.GetBlocksResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlocksize(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlockheight(value);
      break;
    case 3:
      var value = new proto.model.Block;
      reader.readMessage(value,proto.model.Block.deserializeBinaryFromReader);
      msg.addBlocks(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.model.GetBlocksResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.model.GetBlocksResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.model.GetBlocksResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.GetBlocksResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlocksize();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getBlockheight();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getBlocksList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.model.Block.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 BlockSize = 1;
 * @return {number}
 */
proto.model.GetBlocksResponse.prototype.getBlocksize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.model.GetBlocksResponse.prototype.setBlocksize = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 BlockHeight = 2;
 * @return {number}
 */
proto.model.GetBlocksResponse.prototype.getBlockheight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.model.GetBlocksResponse.prototype.setBlockheight = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * repeated Block Blocks = 3;
 * @return {!Array<!proto.model.Block>}
 */
proto.model.GetBlocksResponse.prototype.getBlocksList = function() {
  return /** @type{!Array<!proto.model.Block>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.model.Block, 3));
};


/** @param {!Array<!proto.model.Block>} value */
proto.model.GetBlocksResponse.prototype.setBlocksList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.model.Block=} opt_value
 * @param {number=} opt_index
 * @return {!proto.model.Block}
 */
proto.model.GetBlocksResponse.prototype.addBlocks = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.model.Block, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 */
proto.model.GetBlocksResponse.prototype.clearBlocksList = function() {
  this.setBlocksList([]);
};


