"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyFrameTraceInfoT = exports.KeyFrameTraceInfo = void 0;
const flatbuffers = require("flatbuffers");
const dump_1 = require("../../fbs/rtp-packet/dump");
class KeyFrameTraceInfo {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsKeyFrameTraceInfo(bb, obj) {
        return (obj || new KeyFrameTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsKeyFrameTraceInfo(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new KeyFrameTraceInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    rtpPacket(obj) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? (obj || new dump_1.Dump()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    }
    isRtx() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
    }
    static startKeyFrameTraceInfo(builder) {
        builder.startObject(2);
    }
    static addRtpPacket(builder, rtpPacketOffset) {
        builder.addFieldOffset(0, rtpPacketOffset, 0);
    }
    static addIsRtx(builder, isRtx) {
        builder.addFieldInt8(1, +isRtx, +false);
    }
    static endKeyFrameTraceInfo(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // rtp_packet
        return offset;
    }
    static createKeyFrameTraceInfo(builder, rtpPacketOffset, isRtx) {
        KeyFrameTraceInfo.startKeyFrameTraceInfo(builder);
        KeyFrameTraceInfo.addRtpPacket(builder, rtpPacketOffset);
        KeyFrameTraceInfo.addIsRtx(builder, isRtx);
        return KeyFrameTraceInfo.endKeyFrameTraceInfo(builder);
    }
    unpack() {
        return new KeyFrameTraceInfoT((this.rtpPacket() !== null ? this.rtpPacket().unpack() : null), this.isRtx());
    }
    unpackTo(_o) {
        _o.rtpPacket = (this.rtpPacket() !== null ? this.rtpPacket().unpack() : null);
        _o.isRtx = this.isRtx();
    }
}
exports.KeyFrameTraceInfo = KeyFrameTraceInfo;
class KeyFrameTraceInfoT {
    rtpPacket;
    isRtx;
    constructor(rtpPacket = null, isRtx = false) {
        this.rtpPacket = rtpPacket;
        this.isRtx = isRtx;
    }
    pack(builder) {
        const rtpPacket = (this.rtpPacket !== null ? this.rtpPacket.pack(builder) : 0);
        return KeyFrameTraceInfo.createKeyFrameTraceInfo(builder, rtpPacket, this.isRtx);
    }
}
exports.KeyFrameTraceInfoT = KeyFrameTraceInfoT;
