"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStatsT = exports.BaseStats = void 0;
const flatbuffers = require("flatbuffers");
const media_kind_1 = require("../../fbs/rtp-parameters/media-kind");
class BaseStats {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsBaseStats(bb, obj) {
        return (obj || new BaseStats()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsBaseStats(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new BaseStats()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    timestamp() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    ssrc() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
    }
    kind() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : media_kind_1.MediaKind.AUDIO;
    }
    mimeType(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    packetsLost() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    fractionLost() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
    }
    packetsDiscarded() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    packetsRetransmitted() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    packetsRepaired() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    nackCount() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    nackPacketCount() {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    pliCount() {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    firCount() {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    score() {
        const offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
    }
    rid(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 32);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    rtxSsrc() {
        const offset = this.bb.__offset(this.bb_pos, 34);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : null;
    }
    rtxPacketsDiscarded() {
        const offset = this.bb.__offset(this.bb_pos, 36);
        return offset ? this.bb.readUint64(this.bb_pos + offset) : BigInt('0');
    }
    roundTripTime() {
        const offset = this.bb.__offset(this.bb_pos, 38);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
    }
    static startBaseStats(builder) {
        builder.startObject(18);
    }
    static addTimestamp(builder, timestamp) {
        builder.addFieldInt64(0, timestamp, BigInt('0'));
    }
    static addSsrc(builder, ssrc) {
        builder.addFieldInt32(1, ssrc, 0);
    }
    static addKind(builder, kind) {
        builder.addFieldInt8(2, kind, media_kind_1.MediaKind.AUDIO);
    }
    static addMimeType(builder, mimeTypeOffset) {
        builder.addFieldOffset(3, mimeTypeOffset, 0);
    }
    static addPacketsLost(builder, packetsLost) {
        builder.addFieldInt64(4, packetsLost, BigInt('0'));
    }
    static addFractionLost(builder, fractionLost) {
        builder.addFieldInt8(5, fractionLost, 0);
    }
    static addPacketsDiscarded(builder, packetsDiscarded) {
        builder.addFieldInt64(6, packetsDiscarded, BigInt('0'));
    }
    static addPacketsRetransmitted(builder, packetsRetransmitted) {
        builder.addFieldInt64(7, packetsRetransmitted, BigInt('0'));
    }
    static addPacketsRepaired(builder, packetsRepaired) {
        builder.addFieldInt64(8, packetsRepaired, BigInt('0'));
    }
    static addNackCount(builder, nackCount) {
        builder.addFieldInt64(9, nackCount, BigInt('0'));
    }
    static addNackPacketCount(builder, nackPacketCount) {
        builder.addFieldInt64(10, nackPacketCount, BigInt('0'));
    }
    static addPliCount(builder, pliCount) {
        builder.addFieldInt64(11, pliCount, BigInt('0'));
    }
    static addFirCount(builder, firCount) {
        builder.addFieldInt64(12, firCount, BigInt('0'));
    }
    static addScore(builder, score) {
        builder.addFieldInt8(13, score, 0);
    }
    static addRid(builder, ridOffset) {
        builder.addFieldOffset(14, ridOffset, 0);
    }
    static addRtxSsrc(builder, rtxSsrc) {
        builder.addFieldInt32(15, rtxSsrc, 0);
    }
    static addRtxPacketsDiscarded(builder, rtxPacketsDiscarded) {
        builder.addFieldInt64(16, rtxPacketsDiscarded, BigInt('0'));
    }
    static addRoundTripTime(builder, roundTripTime) {
        builder.addFieldFloat32(17, roundTripTime, 0.0);
    }
    static endBaseStats(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 10); // mime_type
        return offset;
    }
    static createBaseStats(builder, timestamp, ssrc, kind, mimeTypeOffset, packetsLost, fractionLost, packetsDiscarded, packetsRetransmitted, packetsRepaired, nackCount, nackPacketCount, pliCount, firCount, score, ridOffset, rtxSsrc, rtxPacketsDiscarded, roundTripTime) {
        BaseStats.startBaseStats(builder);
        BaseStats.addTimestamp(builder, timestamp);
        BaseStats.addSsrc(builder, ssrc);
        BaseStats.addKind(builder, kind);
        BaseStats.addMimeType(builder, mimeTypeOffset);
        BaseStats.addPacketsLost(builder, packetsLost);
        BaseStats.addFractionLost(builder, fractionLost);
        BaseStats.addPacketsDiscarded(builder, packetsDiscarded);
        BaseStats.addPacketsRetransmitted(builder, packetsRetransmitted);
        BaseStats.addPacketsRepaired(builder, packetsRepaired);
        BaseStats.addNackCount(builder, nackCount);
        BaseStats.addNackPacketCount(builder, nackPacketCount);
        BaseStats.addPliCount(builder, pliCount);
        BaseStats.addFirCount(builder, firCount);
        BaseStats.addScore(builder, score);
        BaseStats.addRid(builder, ridOffset);
        if (rtxSsrc !== null)
            BaseStats.addRtxSsrc(builder, rtxSsrc);
        BaseStats.addRtxPacketsDiscarded(builder, rtxPacketsDiscarded);
        BaseStats.addRoundTripTime(builder, roundTripTime);
        return BaseStats.endBaseStats(builder);
    }
    unpack() {
        return new BaseStatsT(this.timestamp(), this.ssrc(), this.kind(), this.mimeType(), this.packetsLost(), this.fractionLost(), this.packetsDiscarded(), this.packetsRetransmitted(), this.packetsRepaired(), this.nackCount(), this.nackPacketCount(), this.pliCount(), this.firCount(), this.score(), this.rid(), this.rtxSsrc(), this.rtxPacketsDiscarded(), this.roundTripTime());
    }
    unpackTo(_o) {
        _o.timestamp = this.timestamp();
        _o.ssrc = this.ssrc();
        _o.kind = this.kind();
        _o.mimeType = this.mimeType();
        _o.packetsLost = this.packetsLost();
        _o.fractionLost = this.fractionLost();
        _o.packetsDiscarded = this.packetsDiscarded();
        _o.packetsRetransmitted = this.packetsRetransmitted();
        _o.packetsRepaired = this.packetsRepaired();
        _o.nackCount = this.nackCount();
        _o.nackPacketCount = this.nackPacketCount();
        _o.pliCount = this.pliCount();
        _o.firCount = this.firCount();
        _o.score = this.score();
        _o.rid = this.rid();
        _o.rtxSsrc = this.rtxSsrc();
        _o.rtxPacketsDiscarded = this.rtxPacketsDiscarded();
        _o.roundTripTime = this.roundTripTime();
    }
}
exports.BaseStats = BaseStats;
class BaseStatsT {
    timestamp;
    ssrc;
    kind;
    mimeType;
    packetsLost;
    fractionLost;
    packetsDiscarded;
    packetsRetransmitted;
    packetsRepaired;
    nackCount;
    nackPacketCount;
    pliCount;
    firCount;
    score;
    rid;
    rtxSsrc;
    rtxPacketsDiscarded;
    roundTripTime;
    constructor(timestamp = BigInt('0'), ssrc = 0, kind = media_kind_1.MediaKind.AUDIO, mimeType = null, packetsLost = BigInt('0'), fractionLost = 0, packetsDiscarded = BigInt('0'), packetsRetransmitted = BigInt('0'), packetsRepaired = BigInt('0'), nackCount = BigInt('0'), nackPacketCount = BigInt('0'), pliCount = BigInt('0'), firCount = BigInt('0'), score = 0, rid = null, rtxSsrc = null, rtxPacketsDiscarded = BigInt('0'), roundTripTime = 0.0) {
        this.timestamp = timestamp;
        this.ssrc = ssrc;
        this.kind = kind;
        this.mimeType = mimeType;
        this.packetsLost = packetsLost;
        this.fractionLost = fractionLost;
        this.packetsDiscarded = packetsDiscarded;
        this.packetsRetransmitted = packetsRetransmitted;
        this.packetsRepaired = packetsRepaired;
        this.nackCount = nackCount;
        this.nackPacketCount = nackPacketCount;
        this.pliCount = pliCount;
        this.firCount = firCount;
        this.score = score;
        this.rid = rid;
        this.rtxSsrc = rtxSsrc;
        this.rtxPacketsDiscarded = rtxPacketsDiscarded;
        this.roundTripTime = roundTripTime;
    }
    pack(builder) {
        const mimeType = (this.mimeType !== null ? builder.createString(this.mimeType) : 0);
        const rid = (this.rid !== null ? builder.createString(this.rid) : 0);
        return BaseStats.createBaseStats(builder, this.timestamp, this.ssrc, this.kind, mimeType, this.packetsLost, this.fractionLost, this.packetsDiscarded, this.packetsRetransmitted, this.packetsRepaired, this.nackCount, this.nackPacketCount, this.pliCount, this.firCount, this.score, rid, this.rtxSsrc, this.rtxPacketsDiscarded, this.roundTripTime);
    }
}
exports.BaseStatsT = BaseStatsT;
