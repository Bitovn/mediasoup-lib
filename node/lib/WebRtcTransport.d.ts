import { BaseTransportDump, BaseTransportStats, Transport, TransportListenInfo, TransportListenIp, TransportProtocol, TransportTuple, TransportEvents, TransportObserverEvents, TransportConstructorOptions, SctpState } from './Transport';
import { WebRtcServer } from './WebRtcServer';
import { SctpParameters, NumSctpStreams } from './SctpParameters';
import { AppData, Either } from './types';
import * as FbsWebRtcTransport from './fbs/web-rtc-transport';
export type WebRtcTransportOptions<WebRtcTransportAppData extends AppData = AppData> = WebRtcTransportOptionsBase<WebRtcTransportAppData> & WebRtcTransportListen;
type WebRtcTransportListenIndividualListenInfo = {
    /**
     * Listening info.
     */
    listenInfos: TransportListenInfo[];
};
type WebRtcTransportListenIndividualListenIp = {
    /**
     * Listening IP address or addresses in order of preference (first one is the
     * preferred one).
     */
    listenIps: (TransportListenIp | string)[];
    /**
     * Fixed port to listen on instead of selecting automatically from Worker's port
     * range.
     */
    port?: number;
};
type WebRtcTransportListenServer = {
    /**
     * Instance of WebRtcServer.
     */
    webRtcServer: WebRtcServer;
};
type WebRtcTransportListen = Either<Either<WebRtcTransportListenIndividualListenInfo, WebRtcTransportListenIndividualListenIp>, WebRtcTransportListenServer>;
export type WebRtcTransportOptionsBase<WebRtcTransportAppData> = {
    /**
     * Listen in UDP. Default true.
     */
    enableUdp?: boolean;
    /**
     * Listen in TCP. Default true if webrtcServer is given, false otherwise.
     */
    enableTcp?: boolean;
    /**
     * Prefer UDP. Default false.
     */
    preferUdp?: boolean;
    /**
     * Prefer TCP. Default false.
     */
    preferTcp?: boolean;
    /**
     * Initial available outgoing bitrate (in bps). Default 600000.
     */
    initialAvailableOutgoingBitrate?: number;
    /**
     * Create a SCTP association. Default false.
     */
    enableSctp?: boolean;
    /**
     * SCTP streams number.
     */
    numSctpStreams?: NumSctpStreams;
    /**
     * Maximum allowed size for SCTP messages sent by DataProducers.
     * Default 262144.
     */
    maxSctpMessageSize?: number;
    /**
     * Maximum SCTP send buffer used by DataConsumers.
     * Default 262144.
     */
    sctpSendBufferSize?: number;
    /**
     * Custom application data.
     */
    appData?: WebRtcTransportAppData;
};
export type IceParameters = {
    usernameFragment: string;
    password: string;
    iceLite?: boolean;
};
export type IceCandidate = {
    foundation: string;
    priority: number;
    ip: string;
    protocol: TransportProtocol;
    port: number;
    type: IceCandidateType;
    tcpType?: IceCandidateTcpType;
};
export type DtlsParameters = {
    role?: DtlsRole;
    fingerprints: DtlsFingerprint[];
};
/**
 * The hash function algorithm (as defined in the "Hash function Textual Names"
 * registry initially specified in RFC 4572 Section 8).
 */
export type FingerprintAlgorithm = 'sha-1' | 'sha-224' | 'sha-256' | 'sha-384' | 'sha-512';
/**
 * The hash function algorithm and its corresponding certificate fingerprint
 * value (in lowercase hex string as expressed utilizing the syntax of
 * "fingerprint" in RFC 4572 Section 5).
 */
export type DtlsFingerprint = {
    algorithm: FingerprintAlgorithm;
    value: string;
};
export type IceRole = 'controlled' | 'controlling';
export type IceState = 'new' | 'connected' | 'completed' | 'disconnected' | 'closed';
export type IceCandidateType = 'host';
export type IceCandidateTcpType = 'passive';
export type DtlsRole = 'auto' | 'client' | 'server';
export type DtlsState = 'new' | 'connecting' | 'connected' | 'failed' | 'closed';
export type WebRtcTransportStat = BaseTransportStats & {
    type: string;
    iceRole: string;
    iceState: IceState;
    iceSelectedTuple?: TransportTuple;
    dtlsState: DtlsState;
};
export type WebRtcTransportEvents = TransportEvents & {
    icestatechange: [IceState];
    iceselectedtuplechange: [TransportTuple];
    dtlsstatechange: [DtlsState];
    sctpstatechange: [SctpState];
};
export type WebRtcTransportObserverEvents = TransportObserverEvents & {
    icestatechange: [IceState];
    iceselectedtuplechange: [TransportTuple];
    dtlsstatechange: [DtlsState];
    sctpstatechange: [SctpState];
};
type WebRtcTransportConstructorOptions<WebRtcTransportAppData> = TransportConstructorOptions<WebRtcTransportAppData> & {
    data: WebRtcTransportData;
};
export type WebRtcTransportData = {
    iceRole: 'controlled';
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    iceState: IceState;
    iceSelectedTuple?: TransportTuple;
    dtlsParameters: DtlsParameters;
    dtlsState: DtlsState;
    dtlsRemoteCert?: string;
    sctpParameters?: SctpParameters;
    sctpState?: SctpState;
};
type WebRtcTransportDump = BaseTransportDump & {
    iceRole: 'controlled';
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    iceState: IceState;
    iceSelectedTuple?: TransportTuple;
    dtlsParameters: DtlsParameters;
    dtlsState: DtlsState;
    dtlsRemoteCert?: string;
};
export declare class WebRtcTransport<WebRtcTransportAppData extends AppData = AppData> extends Transport<WebRtcTransportAppData, WebRtcTransportEvents, WebRtcTransportObserverEvents> {
    #private;
    /**
     * @private
     */
    constructor(options: WebRtcTransportConstructorOptions<WebRtcTransportAppData>);
    /**
     * ICE role.
     */
    get iceRole(): 'controlled';
    /**
     * ICE parameters.
     */
    get iceParameters(): IceParameters;
    /**
     * ICE candidates.
     */
    get iceCandidates(): IceCandidate[];
    /**
     * ICE state.
     */
    get iceState(): IceState;
    /**
     * ICE selected tuple.
     */
    get iceSelectedTuple(): TransportTuple | undefined;
    /**
     * DTLS parameters.
     */
    get dtlsParameters(): DtlsParameters;
    /**
     * DTLS state.
     */
    get dtlsState(): DtlsState;
    /**
     * Remote certificate in PEM format.
     */
    get dtlsRemoteCert(): string | undefined;
    /**
     * SCTP parameters.
     */
    get sctpParameters(): SctpParameters | undefined;
    /**
     * SCTP state.
     */
    get sctpState(): SctpState | undefined;
    /**
     * Close the WebRtcTransport.
     *
     * @override
     */
    close(): void;
    /**
     * Router was closed.
     *
     * @private
     * @override
     */
    routerClosed(): void;
    /**
     * Called when closing the associated listenServer (WebRtcServer).
     *
     * @private
     */
    listenServerClosed(): void;
    /**
     * Dump Transport.
     */
    dump(): Promise<WebRtcTransportDump>;
    /**
     * Get WebRtcTransport stats.
     *
     * @override
     */
    getStats(): Promise<WebRtcTransportStat[]>;
    /**
     * Provide the WebRtcTransport remote parameters.
     *
     * @override
     */
    connect({ dtlsParameters }: {
        dtlsParameters: DtlsParameters;
    }): Promise<void>;
    /**
     * Restart ICE.
     */
    restartIce(): Promise<IceParameters>;
    private handleWorkerNotifications;
}
export declare function parseWebRtcTransportDumpResponse(binary: FbsWebRtcTransport.DumpResponse): WebRtcTransportDump;
export {};
//# sourceMappingURL=WebRtcTransport.d.ts.map