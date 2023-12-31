"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintT = exports.Fingerprint = void 0;
const flatbuffers = require("flatbuffers");
const fingerprint_algorithm_1 = require("../../fbs/web-rtc-transport/fingerprint-algorithm");
class Fingerprint {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsFingerprint(bb, obj) {
        return (obj || new Fingerprint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsFingerprint(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Fingerprint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    algorithm() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : fingerprint_algorithm_1.FingerprintAlgorithm.SHA1;
    }
    value(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    static startFingerprint(builder) {
        builder.startObject(2);
    }
    static addAlgorithm(builder, algorithm) {
        builder.addFieldInt8(0, algorithm, fingerprint_algorithm_1.FingerprintAlgorithm.SHA1);
    }
    static addValue(builder, valueOffset) {
        builder.addFieldOffset(1, valueOffset, 0);
    }
    static endFingerprint(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 6); // value
        return offset;
    }
    static createFingerprint(builder, algorithm, valueOffset) {
        Fingerprint.startFingerprint(builder);
        Fingerprint.addAlgorithm(builder, algorithm);
        Fingerprint.addValue(builder, valueOffset);
        return Fingerprint.endFingerprint(builder);
    }
    unpack() {
        return new FingerprintT(this.algorithm(), this.value());
    }
    unpackTo(_o) {
        _o.algorithm = this.algorithm();
        _o.value = this.value();
    }
}
exports.Fingerprint = Fingerprint;
class FingerprintT {
    algorithm;
    value;
    constructor(algorithm = fingerprint_algorithm_1.FingerprintAlgorithm.SHA1, value = null) {
        this.algorithm = algorithm;
        this.value = value;
    }
    pack(builder) {
        const value = (this.value !== null ? builder.createString(this.value) : 0);
        return Fingerprint.createFingerprint(builder, this.algorithm, value);
    }
}
exports.FingerprintT = FingerprintT;
