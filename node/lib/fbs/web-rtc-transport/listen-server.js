"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenServerT = exports.ListenServer = void 0;
const flatbuffers = require("flatbuffers");
class ListenServer {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsListenServer(bb, obj) {
        return (obj || new ListenServer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsListenServer(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new ListenServer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    webRtcServerId(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    static startListenServer(builder) {
        builder.startObject(1);
    }
    static addWebRtcServerId(builder, webRtcServerIdOffset) {
        builder.addFieldOffset(0, webRtcServerIdOffset, 0);
    }
    static endListenServer(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // web_rtc_server_id
        return offset;
    }
    static createListenServer(builder, webRtcServerIdOffset) {
        ListenServer.startListenServer(builder);
        ListenServer.addWebRtcServerId(builder, webRtcServerIdOffset);
        return ListenServer.endListenServer(builder);
    }
    unpack() {
        return new ListenServerT(this.webRtcServerId());
    }
    unpackTo(_o) {
        _o.webRtcServerId = this.webRtcServerId();
    }
}
exports.ListenServer = ListenServer;
class ListenServerT {
    webRtcServerId;
    constructor(webRtcServerId = null) {
        this.webRtcServerId = webRtcServerId;
    }
    pack(builder) {
        const webRtcServerId = (this.webRtcServerId !== null ? builder.createString(this.webRtcServerId) : 0);
        return ListenServer.createListenServer(builder, webRtcServerId);
    }
}
exports.ListenServerT = ListenServerT;
