"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveProducerRequestT = exports.RemoveProducerRequest = void 0;
const flatbuffers = require("flatbuffers");
class RemoveProducerRequest {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsRemoveProducerRequest(bb, obj) {
        return (obj || new RemoveProducerRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsRemoveProducerRequest(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new RemoveProducerRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    producerId(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    static startRemoveProducerRequest(builder) {
        builder.startObject(1);
    }
    static addProducerId(builder, producerIdOffset) {
        builder.addFieldOffset(0, producerIdOffset, 0);
    }
    static endRemoveProducerRequest(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // producer_id
        return offset;
    }
    static createRemoveProducerRequest(builder, producerIdOffset) {
        RemoveProducerRequest.startRemoveProducerRequest(builder);
        RemoveProducerRequest.addProducerId(builder, producerIdOffset);
        return RemoveProducerRequest.endRemoveProducerRequest(builder);
    }
    unpack() {
        return new RemoveProducerRequestT(this.producerId());
    }
    unpackTo(_o) {
        _o.producerId = this.producerId();
    }
}
exports.RemoveProducerRequest = RemoveProducerRequest;
class RemoveProducerRequestT {
    producerId;
    constructor(producerId = null) {
        this.producerId = producerId;
    }
    pack(builder) {
        const producerId = (this.producerId !== null ? builder.createString(this.producerId) : 0);
        return RemoveProducerRequest.createRemoveProducerRequest(builder, producerId);
    }
}
exports.RemoveProducerRequestT = RemoveProducerRequestT;
