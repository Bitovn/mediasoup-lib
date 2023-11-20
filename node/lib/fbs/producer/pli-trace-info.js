"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.PliTraceInfoT = exports.PliTraceInfo = void 0;
const flatbuffers = require("flatbuffers");
class PliTraceInfo {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsPliTraceInfo(bb, obj) {
        return (obj || new PliTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsPliTraceInfo(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new PliTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    ssrc() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
    }
    static startPliTraceInfo(builder) {
        builder.startObject(1);
    }
    static addSsrc(builder, ssrc) {
        builder.addFieldInt32(0, ssrc, 0);
    }
    static endPliTraceInfo(builder) {
        const offset = builder.endObject();
        return offset;
    }
    static createPliTraceInfo(builder, ssrc) {
        PliTraceInfo.startPliTraceInfo(builder);
        PliTraceInfo.addSsrc(builder, ssrc);
        return PliTraceInfo.endPliTraceInfo(builder);
    }
    unpack() {
        return new PliTraceInfoT(this.ssrc());
    }
    unpackTo(_o) {
        _o.ssrc = this.ssrc();
    }
}
exports.PliTraceInfo = PliTraceInfo;
class PliTraceInfoT {
    ssrc;
    constructor(ssrc = 0) {
        this.ssrc = ssrc;
    }
    pack(builder) {
        return PliTraceInfo.createPliTraceInfo(builder, this.ssrc);
    }
}
exports.PliTraceInfoT = PliTraceInfoT;