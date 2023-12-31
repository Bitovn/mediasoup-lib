import { EnhancedEventEmitter } from './EnhancedEventEmitter';
import { Channel } from './Channel';
import { TransportListenInfo } from './Transport';
import { WebRtcTransport } from './WebRtcTransport';
import { AppData } from './types';
export type WebRtcServerOptions<WebRtcServerAppData extends AppData = AppData> = {
    /**
     * Listen infos.
     */
    listenInfos: TransportListenInfo[];
    /**
     * Custom application data.
     */
    appData?: WebRtcServerAppData;
};
/**
 * @deprecated
 * Use TransportListenInfo instead.
 */
export type WebRtcServerListenInfo = TransportListenInfo;
export type WebRtcServerEvents = {
    workerclose: [];
    '@close': [];
};
export type WebRtcServerObserverEvents = {
    close: [];
    webrtctransporthandled: [WebRtcTransport];
    webrtctransportunhandled: [WebRtcTransport];
};
export type WebRtcServerDump = {
    id: string;
    udpSockets: IpPort[];
    tcpServers: IpPort[];
    webRtcTransportIds: string[];
    localIceUsernameFragments: IceUserNameFragment[];
    tupleHashes: TupleHash[];
};
type IpPort = {
    ip: string;
    port: number;
};
type IceUserNameFragment = {
    localIceUsernameFragment: string;
    webRtcTransportId: string;
};
type TupleHash = {
    tupleHash: number;
    webRtcTransportId: string;
};
type WebRtcServerInternal = {
    webRtcServerId: string;
};
export declare class WebRtcServer<WebRtcServerAppData extends AppData = AppData> extends EnhancedEventEmitter<WebRtcServerEvents> {
    #private;
    /**
     * @private
     */
    constructor({ internal, channel, appData }: {
        internal: WebRtcServerInternal;
        channel: Channel;
        appData?: WebRtcServerAppData;
    });
    /**
     * WebRtcServer id.
     */
    get id(): string;
    /**
     * Whether the WebRtcServer is closed.
     */
    get closed(): boolean;
    /**
     * App custom data.
     */
    get appData(): WebRtcServerAppData;
    /**
     * App custom data setter.
     */
    set appData(appData: WebRtcServerAppData);
    /**
     * Observer.
     */
    get observer(): EnhancedEventEmitter<WebRtcServerObserverEvents>;
    /**
     * @private
     * Just for testing purposes.
     */
    get webRtcTransportsForTesting(): Map<string, WebRtcTransport>;
    /**
     * Close the WebRtcServer.
     */
    close(): void;
    /**
     * Worker was closed.
     *
     * @private
     */
    workerClosed(): void;
    /**
     * Dump WebRtcServer.
     */
    dump(): Promise<WebRtcServerDump>;
    /**
     * @private
     */
    handleWebRtcTransport(webRtcTransport: WebRtcTransport): void;
}
export {};
//# sourceMappingURL=WebRtcServer.d.ts.map