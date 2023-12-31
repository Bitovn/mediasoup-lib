"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenIndividualT = exports.ListenIndividual = void 0;
const flatbuffers = require("flatbuffers");
const listen_info_1 = require("../../fbs/transport/listen-info");
class ListenIndividual {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsListenIndividual(bb, obj) {
        return (obj || new ListenIndividual()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsListenIndividual(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new ListenIndividual()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    listenInfos(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? (obj || new listen_info_1.ListenInfo()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    }
    listenInfosLength() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    }
    static startListenIndividual(builder) {
        builder.startObject(1);
    }
    static addListenInfos(builder, listenInfosOffset) {
        builder.addFieldOffset(0, listenInfosOffset, 0);
    }
    static createListenInfosVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    }
    static startListenInfosVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
    }
    static endListenIndividual(builder) {
        const offset = builder.endObject();
        builder.requiredField(offset, 4); // listen_infos
        return offset;
    }
    static createListenIndividual(builder, listenInfosOffset) {
        ListenIndividual.startListenIndividual(builder);
        ListenIndividual.addListenInfos(builder, listenInfosOffset);
        return ListenIndividual.endListenIndividual(builder);
    }
    unpack() {
        return new ListenIndividualT(this.bb.createObjList(this.listenInfos.bind(this), this.listenInfosLength()));
    }
    unpackTo(_o) {
        _o.listenInfos = this.bb.createObjList(this.listenInfos.bind(this), this.listenInfosLength());
    }
}
exports.ListenIndividual = ListenIndividual;
class ListenIndividualT {
    listenInfos;
    constructor(listenInfos = []) {
        this.listenInfos = listenInfos;
    }
    pack(builder) {
        const listenInfos = ListenIndividual.createListenInfosVector(builder, builder.createObjectOffsetList(this.listenInfos));
        return ListenIndividual.createListenIndividual(builder, listenInfos);
    }
}
exports.ListenIndividualT = ListenIndividualT;
