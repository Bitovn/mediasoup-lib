import * as FbsRtpStream from './fbs/rtp-stream';
export type RtpStreamRecvStats = BaseRtpStreamStats & {
    type: string;
    jitter: number;
    packetCount: number;
    byteCount: number;
    bitrate: number;
    bitrateByLayer?: any;
};
export type RtpStreamSendStats = BaseRtpStreamStats & {
    type: string;
    packetCount: number;
    byteCount: number;
    bitrate: number;
};
type BaseRtpStreamStats = {
    timestamp: number;
    ssrc: number;
    rtxSsrc?: number;
    rid?: string;
    kind: string;
    mimeType: string;
    packetsLost: number;
    fractionLost: number;
    packetsDiscarded: number;
    packetsRetransmitted: number;
    packetsRepaired: number;
    nackCount: number;
    nackPacketCount: number;
    pliCount: number;
    firCount: number;
    score: number;
    roundTripTime?: number;
    rtxPacketsDiscarded?: number;
};
export declare function parseRtpStreamStats(binary: FbsRtpStream.Stats): RtpStreamRecvStats | RtpStreamSendStats;
export declare function parseRtpStreamRecvStats(binary: FbsRtpStream.Stats): RtpStreamRecvStats;
export declare function parseSendStreamStats(binary: FbsRtpStream.Stats): RtpStreamSendStats;
export {};
//# sourceMappingURL=RtpStream.d.ts.map