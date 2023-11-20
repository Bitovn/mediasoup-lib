"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectRequestT = exports.ConnectRequest = void 0;
const flatbuffers = require("flatbuffers");
const srtp_parameters_1 = require("../../fbs/srtp-parameters/srtp-parameters");
class ConnectRequest {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsConnectRequest(bb, obj) {
        return (obj || new ConnectRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsConnectRequest(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new ConnectRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    ip(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    port() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint16(this.bb_pos + offset) : null;
    }
    srtpParameters(obj) {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (obj || new srtp_parameters_1.SrtpParameters()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
    }
    static startConnectRequest(builder) {
        builder.startObject(3);
    }
    static addIp(builder, ipOffset) {
        builder.addFieldOffset(0, ipOffset, 0);
    }
    static addPort(builder, port) {
        builder.addFieldInt16(1, port, 0);
    }
    static addSrtpParameters(builder, srtpParametersOffset) {
        builder.addFieldOffset(2, srtpParametersOffset, 0);
    }
    static endConnectRequest(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // ip
        return offset;
    }
    unpack() {
        return new ConnectRequestT(this.ip(), this.port(), (this.srtpParameters() !== null ? this.srtpParameters().unpack() : null));
    }
    unpackTo(_o) {
        _o.ip = this.ip();
        _o.port = this.port();
        _o.srtpParameters = (this.srtpParameters() !== null ? this.srtpParameters().unpack() : null);
    }
}
exports.ConnectRequest = ConnectRequest;
class ConnectRequestT {
    ip;
    port;
    srtpParameters;
    constructor(ip = null, port = null, srtpParameters = null) {
        this.ip = ip;
        this.port = port;
        this.srtpParameters = srtpParameters;
    }
    pack(builder) {
        const ip = (this.ip !== null ? builder.createString(this.ip) : 0);
        const srtpParameters = (this.srtpParameters !== null ? this.srtpParameters.pack(builder) : 0);
        ConnectRequest.startConnectRequest(builder);
        ConnectRequest.addIp(builder, ip);
        if (this.port !== null)
            ConnectRequest.addPort(builder, this.port);
        ConnectRequest.addSrtpParameters(builder, srtpParameters);
        return ConnectRequest.endConnectRequest(builder);
    }
}
exports.ConnectRequestT = ConnectRequestT;