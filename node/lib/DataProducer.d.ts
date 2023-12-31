/// <reference types="node" />
import { EnhancedEventEmitter } from './EnhancedEventEmitter';
import { Channel } from './Channel';
import { TransportInternal } from './Transport';
import { SctpStreamParameters } from './SctpParameters';
import { AppData } from './types';
import * as FbsDataProducer from './fbs/data-producer';
export type DataProducerOptions<DataProducerAppData extends AppData = AppData> = {
    /**
     * DataProducer id (just for Router.pipeToRouter() method).
     */
    id?: string;
    /**
     * SCTP parameters defining how the endpoint is sending the data.
     * Just if messages are sent over SCTP.
     */
    sctpStreamParameters?: SctpStreamParameters;
    /**
     * A label which can be used to distinguish this DataChannel from others.
     */
    label?: string;
    /**
     * Name of the sub-protocol used by this DataChannel.
     */
    protocol?: string;
    /**
     * Whether the data producer must start in paused mode. Default false.
     */
    paused?: boolean;
    /**
     * Custom application data.
     */
    appData?: DataProducerAppData;
};
export type DataProducerStat = {
    type: string;
    timestamp: number;
    label: string;
    protocol: string;
    messagesReceived: number;
    bytesReceived: number;
};
/**
 * DataProducer type.
 */
export type DataProducerType = 'sctp' | 'direct';
export type DataProducerEvents = {
    transportclose: [];
    '@close': [];
};
export type DataProducerObserverEvents = {
    close: [];
    pause: [];
    resume: [];
};
type DataProducerDump = DataProducerData & {
    id: string;
    paused: boolean;
};
type DataProducerInternal = TransportInternal & {
    dataProducerId: string;
};
type DataProducerData = {
    type: DataProducerType;
    sctpStreamParameters?: SctpStreamParameters;
    label: string;
    protocol: string;
};
export declare class DataProducer<DataProducerAppData extends AppData = AppData> extends EnhancedEventEmitter<DataProducerEvents> {
    #private;
    /**
     * @private
     */
    constructor({ internal, data, channel, paused, appData }: {
        internal: DataProducerInternal;
        data: DataProducerData;
        channel: Channel;
        paused: boolean;
        appData?: DataProducerAppData;
    });
    /**
     * DataProducer id.
     */
    get id(): string;
    /**
     * Whether the DataProducer is closed.
     */
    get closed(): boolean;
    /**
     * DataProducer type.
     */
    get type(): DataProducerType;
    /**
     * SCTP stream parameters.
     */
    get sctpStreamParameters(): SctpStreamParameters | undefined;
    /**
     * DataChannel label.
     */
    get label(): string;
    /**
     * DataChannel protocol.
     */
    get protocol(): string;
    /**
     * Whether the DataProducer is paused.
     */
    get paused(): boolean;
    /**
     * App custom data.
     */
    get appData(): DataProducerAppData;
    /**
     * App custom data setter.
     */
    set appData(appData: DataProducerAppData);
    /**
     * Observer.
     */
    get observer(): EnhancedEventEmitter<DataProducerObserverEvents>;
    /**
     * Close the DataProducer.
     */
    close(): void;
    /**
     * Transport was closed.
     *
     * @private
     */
    transportClosed(): void;
    /**
     * Dump DataProducer.
     */
    dump(): Promise<DataProducerDump>;
    /**
     * Get DataProducer stats.
     */
    getStats(): Promise<DataProducerStat[]>;
    /**
     * Pause the DataProducer.
     */
    pause(): Promise<void>;
    /**
     * Resume the DataProducer.
     */
    resume(): Promise<void>;
    /**
     * Send data (just valid for DataProducers created on a DirectTransport).
     */
    send(message: string | Buffer, ppid?: number, subchannels?: number[], requiredSubchannel?: number): void;
    private handleWorkerNotifications;
}
export declare function dataProducerTypeToFbs(type: DataProducerType): FbsDataProducer.Type;
export declare function dataProducerTypeFromFbs(type: FbsDataProducer.Type): DataProducerType;
export declare function parseDataProducerDumpResponse(data: FbsDataProducer.DumpResponse): DataProducerDump;
export {};
//# sourceMappingURL=DataProducer.d.ts.map