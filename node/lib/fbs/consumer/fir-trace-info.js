"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirTraceInfoT = exports.FirTraceInfo = void 0;
const flatbuffers = require("flatbuffers");
class FirTraceInfo {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsFirTraceInfo(bb, obj) {
        return (obj || new FirTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsFirTraceInfo(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new FirTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    ssrc() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
    }
    static startFirTraceInfo(builder) {
        builder.startObject(1);
    }
    static addSsrc(builder, ssrc) {
        builder.addFieldInt32(0, ssrc, 0);
    }
    static endFirTraceInfo(builder) {
        const offset = builder.endObject();
        return offset;
    }
    static createFirTraceInfo(builder, ssrc) {
        FirTraceInfo.startFirTraceInfo(builder);
        FirTraceInfo.addSsrc(builder, ssrc);
        return FirTraceInfo.endFirTraceInfo(builder);
    }
    unpack() {
        return new FirTraceInfoT(this.ssrc());
    }
    unpackTo(_o) {
        _o.ssrc = this.ssrc();
    }
}
exports.FirTraceInfo = FirTraceInfo;
class FirTraceInfoT {
    ssrc;
    constructor(ssrc = 0) {
        this.ssrc = ssrc;
    }
    pack(builder) {
        return FirTraceInfo.createFirTraceInfo(builder, this.ssrc);
    }
}
exports.FirTraceInfoT = FirTraceInfoT;
