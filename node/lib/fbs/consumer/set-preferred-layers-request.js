"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPreferredLayersRequestT = exports.SetPreferredLayersRequest = void 0;
const flatbuffers = require("flatbuffers");
const consumer_layers_1 = require("../../fbs/consumer/consumer-layers");
class SetPreferredLayersRequest {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsSetPreferredLayersRequest(bb, obj) {
        return (obj || new SetPreferredLayersRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsSetPreferredLayersRequest(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new SetPreferredLayersRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    preferredLayers(obj) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? (obj || new consumer_layers_1.ConsumerLayers()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    }
    static startSetPreferredLayersRequest(builder) {
        builder.startObject(1);
    }
    static addPreferredLayers(builder, preferredLayersOffset) {
        builder.addFieldOffset(0, preferredLayersOffset, 0);
    }
    static endSetPreferredLayersRequest(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // preferred_layers
        return offset;
    }
    static createSetPreferredLayersRequest(builder, preferredLayersOffset) {
        SetPreferredLayersRequest.startSetPreferredLayersRequest(builder);
        SetPreferredLayersRequest.addPreferredLayers(builder, preferredLayersOffset);
        return SetPreferredLayersRequest.endSetPreferredLayersRequest(builder);
    }
    unpack() {
        return new SetPreferredLayersRequestT((this.preferredLayers() !== null ? this.preferredLayers().unpack() : null));
    }
    unpackTo(_o) {
        _o.preferredLayers = (this.preferredLayers() !== null ? this.preferredLayers().unpack() : null);
    }
}
exports.SetPreferredLayersRequest = SetPreferredLayersRequest;
class SetPreferredLayersRequestT {
    preferredLayers;
    constructor(preferredLayers = null) {
        this.preferredLayers = preferredLayers;
    }
    pack(builder) {
        const preferredLayers = (this.preferredLayers !== null ? this.preferredLayers.pack(builder) : 0);
        return SetPreferredLayersRequest.createSetPreferredLayersRequest(builder, preferredLayers);
    }
}
exports.SetPreferredLayersRequestT = SetPreferredLayersRequestT;
