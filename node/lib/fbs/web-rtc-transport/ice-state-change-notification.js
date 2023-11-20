"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.IceStateChangeNotificationT = exports.IceStateChangeNotification = void 0;
const flatbuffers = require("flatbuffers");
const ice_state_1 = require("../../fbs/web-rtc-transport/ice-state");
class IceStateChangeNotification {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsIceStateChangeNotification(bb, obj) {
        return (obj || new IceStateChangeNotification()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsIceStateChangeNotification(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new IceStateChangeNotification()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    iceState() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : ice_state_1.IceState.NEW;
    }
    static startIceStateChangeNotification(builder) {
        builder.startObject(1);
    }
    static addIceState(builder, iceState) {
        builder.addFieldInt8(0, iceState, ice_state_1.IceState.NEW);
    }
    static endIceStateChangeNotification(builder) {
        const offset = builder.endObject();
        return offset;
    }
    static createIceStateChangeNotification(builder, iceState) {
        IceStateChangeNotification.startIceStateChangeNotification(builder);
        IceStateChangeNotification.addIceState(builder, iceState);
        return IceStateChangeNotification.endIceStateChangeNotification(builder);
    }
    unpack() {
        return new IceStateChangeNotificationT(this.iceState());
    }
    unpackTo(_o) {
        _o.iceState = this.iceState();
    }
}
exports.IceStateChangeNotification = IceStateChangeNotification;
class IceStateChangeNotificationT {
    iceState;
    constructor(iceState = ice_state_1.IceState.NEW) {
        this.iceState = iceState;
    }
    pack(builder) {
        return IceStateChangeNotification.createIceStateChangeNotification(builder, this.iceState);
    }
}
exports.IceStateChangeNotificationT = IceStateChangeNotificationT;