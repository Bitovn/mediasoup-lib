"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDataConsumerDumpResponse = exports.dataConsumerTypeFromFbs = exports.dataConsumerTypeToFbs = exports.DataConsumer = void 0;
const Logger_1 = require("./Logger");
const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");
const SctpParameters_1 = require("./SctpParameters");
const utils = require("./utils");
const notification_1 = require("./fbs/notification");
const FbsTransport = require("./fbs/transport");
const FbsRequest = require("./fbs/request");
const FbsDataConsumer = require("./fbs/data-consumer");
const FbsDataProducer = require("./fbs/data-producer");
const logger = new Logger_1.Logger('DataConsumer');
class DataConsumer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
    // Internal data.
    #internal;
    // DataConsumer data.
    #data;
    // Channel instance.
    #channel;
    // Closed flag.
    #closed = false;
    // Paused flag.
    #paused = false;
    // Associated DataProducer paused flag.
    #dataProducerPaused = false;
    // Subchannels subscribed to.
    #subchannels;
    // Custom app data.
    #appData;
    // Observer instance.
    #observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    /**
     * @private
     */
    constructor({ internal, data, channel, paused, dataProducerPaused, subchannels, appData }) {
        super();
        logger.debug('constructor()');
        this.#internal = internal;
        this.#data = data;
        this.#channel = channel;
        this.#paused = paused;
        this.#dataProducerPaused = dataProducerPaused;
        this.#subchannels = subchannels;
        this.#appData = appData || {};
        this.handleWorkerNotifications();
    }
    /**
     * DataConsumer id.
     */
    get id() {
        return this.#internal.dataConsumerId;
    }
    /**
     * Associated DataProducer id.
     */
    get dataProducerId() {
        return this.#data.dataProducerId;
    }
    /**
     * Whether the DataConsumer is closed.
     */
    get closed() {
        return this.#closed;
    }
    /**
     * DataConsumer type.
     */
    get type() {
        return this.#data.type;
    }
    /**
     * SCTP stream parameters.
     */
    get sctpStreamParameters() {
        return this.#data.sctpStreamParameters;
    }
    /**
     * DataChannel label.
     */
    get label() {
        return this.#data.label;
    }
    /**
     * DataChannel protocol.
     */
    get protocol() {
        return this.#data.protocol;
    }
    /**
     * Whether the DataConsumer is paused.
     */
    get paused() {
        return this.#paused;
    }
    /**
     * Whether the associate DataProducer is paused.
     */
    get dataProducerPaused() {
        return this.#dataProducerPaused;
    }
    /**
     * Get current subchannels this data consumer is subscribed to.
     */
    get subchannels() {
        return Array.from(this.#subchannels);
    }
    /**
     * App custom data.
     */
    get appData() {
        return this.#appData;
    }
    /**
     * App custom data setter.
     */
    set appData(appData) {
        this.#appData = appData;
    }
    /**
     * Observer.
     */
    get observer() {
        return this.#observer;
    }
    /**
     * Close the DataConsumer.
     */
    close() {
        if (this.#closed) {
            return;
        }
        logger.debug('close()');
        this.#closed = true;
        // Remove notification subscriptions.
        this.#channel.removeAllListeners(this.#internal.dataConsumerId);
        /* Build Request. */
        const requestOffset = new FbsTransport.CloseDataConsumerRequestT(this.#internal.dataConsumerId).pack(this.#channel.bufferBuilder);
        this.#channel.request(FbsRequest.Method.TRANSPORT_CLOSE_DATACONSUMER, FbsRequest.Body.Transport_CloseDataConsumerRequest, requestOffset, this.#internal.transportId).catch(() => { });
        this.emit('@close');
        // Emit observer event.
        this.#observer.safeEmit('close');
    }
    /**
     * Transport was closed.
     *
     * @private
     */
    transportClosed() {
        if (this.#closed) {
            return;
        }
        logger.debug('transportClosed()');
        this.#closed = true;
        // Remove notification subscriptions.
        this.#channel.removeAllListeners(this.#internal.dataConsumerId);
        this.safeEmit('transportclose');
        // Emit observer event.
        this.#observer.safeEmit('close');
    }
    /**
     * Dump DataConsumer.
     */
    async dump() {
        logger.debug('dump()');
        const response = await this.#channel.request(FbsRequest.Method.DATACONSUMER_DUMP, undefined, undefined, this.#internal.dataConsumerId);
        /* Decode Response. */
        const dumpResponse = new FbsDataConsumer.DumpResponse();
        response.body(dumpResponse);
        return parseDataConsumerDumpResponse(dumpResponse);
    }
    /**
     * Get DataConsumer stats.
     */
    async getStats() {
        logger.debug('getStats()');
        const response = await this.#channel.request(FbsRequest.Method.DATACONSUMER_GET_STATS, undefined, undefined, this.#internal.dataConsumerId);
        /* Decode Response. */
        const data = new FbsDataConsumer.GetStatsResponse();
        response.body(data);
        return [parseDataConsumerStats(data)];
    }
    /**
     * Pause the DataConsumer.
     */
    async pause() {
        logger.debug('pause()');
        const wasPaused = this.#paused;
        await this.#channel.request(FbsRequest.Method.DATACONSUMER_PAUSE, undefined, undefined, this.#internal.dataConsumerId);
        this.#paused = true;
        // Emit observer event.
        if (!wasPaused) {
            this.#observer.safeEmit('pause');
        }
    }
    /**
     * Resume the DataConsumer.
     */
    async resume() {
        logger.debug('resume()');
        const wasPaused = this.#paused;
        await this.#channel.request(FbsRequest.Method.DATACONSUMER_RESUME, undefined, undefined, this.#internal.dataConsumerId);
        this.#paused = false;
        // Emit observer event.
        if (wasPaused) {
            this.#observer.safeEmit('resume');
        }
    }
    /**
     * Set buffered amount low threshold.
     */
    async setBufferedAmountLowThreshold(threshold) {
        logger.debug('setBufferedAmountLowThreshold() [threshold:%s]', threshold);
        /* Build Request. */
        const requestOffset = FbsDataConsumer.SetBufferedAmountLowThresholdRequest.
            createSetBufferedAmountLowThresholdRequest(this.#channel.bufferBuilder, threshold);
        await this.#channel.request(FbsRequest.Method.DATACONSUMER_SET_BUFFERED_AMOUNT_LOW_THRESHOLD, FbsRequest.Body.DataConsumer_SetBufferedAmountLowThresholdRequest, requestOffset, this.#internal.dataConsumerId);
    }
    /**
     * Send data.
     */
    async send(message, ppid) {
        if (typeof message !== 'string' && !Buffer.isBuffer(message)) {
            throw new TypeError('message must be a string or a Buffer');
        }
        /*
         * +-------------------------------+----------+
         * | Value                         | SCTP     |
         * |                               | PPID     |
         * +-------------------------------+----------+
         * | WebRTC String                 | 51       |
         * | WebRTC Binary Partial         | 52       |
         * | (Deprecated)                  |          |
         * | WebRTC Binary                 | 53       |
         * | WebRTC String Partial         | 54       |
         * | (Deprecated)                  |          |
         * | WebRTC String Empty           | 56       |
         * | WebRTC Binary Empty           | 57       |
         * +-------------------------------+----------+
         */
        if (typeof ppid !== 'number') {
            ppid = (typeof message === 'string')
                ? message.length > 0 ? 51 : 56
                : message.length > 0 ? 53 : 57;
        }
        // Ensure we honor PPIDs.
        if (ppid === 56) {
            message = ' ';
        }
        else if (ppid === 57) {
            message = Buffer.alloc(1);
        }
        const builder = this.#channel.bufferBuilder;
        let dataOffset = 0;
        if (typeof message === 'string') {
            message = Buffer.from(message);
        }
        dataOffset = FbsDataConsumer.SendRequest.createDataVector(builder, message);
        const requestOffset = FbsDataConsumer.SendRequest.createSendRequest(builder, ppid, dataOffset);
        await this.#channel.request(FbsRequest.Method.DATACONSUMER_SEND, FbsRequest.Body.DataConsumer_SendRequest, requestOffset, this.#internal.dataConsumerId);
    }
    /**
     * Get buffered amount size.
     */
    async getBufferedAmount() {
        logger.debug('getBufferedAmount()');
        const response = await this.#channel.request(FbsRequest.Method.DATACONSUMER_GET_BUFFERED_AMOUNT, undefined, undefined, this.#internal.dataConsumerId);
        const data = new FbsDataConsumer.GetBufferedAmountResponse();
        response.body(data);
        return data.bufferedAmount();
    }
    /**
     * Set subchannels.
     */
    async setSubchannels(subchannels) {
        logger.debug('setSubchannels()');
        /* Build Request. */
        const requestOffset = new FbsDataConsumer.SetSubchannelsRequestT(subchannels).pack(this.#channel.bufferBuilder);
        const response = await this.#channel.request(FbsRequest.Method.DATACONSUMER_SET_SUBCHANNELS, FbsRequest.Body.DataConsumer_SetSubchannelsRequest, requestOffset, this.#internal.dataConsumerId);
        /* Decode Response. */
        const data = new FbsDataConsumer.SetSubchannelsResponse();
        response.body(data);
        // Update subchannels.
        this.#subchannels = utils.parseVector(data, 'subchannels');
    }
    handleWorkerNotifications() {
        this.#channel.on(this.#internal.dataConsumerId, (event, data) => {
            switch (event) {
                case notification_1.Event.DATACONSUMER_DATAPRODUCER_CLOSE:
                    {
                        if (this.#closed) {
                            break;
                        }
                        this.#closed = true;
                        // Remove notification subscriptions.
                        this.#channel.removeAllListeners(this.#internal.dataConsumerId);
                        this.emit('@dataproducerclose');
                        this.safeEmit('dataproducerclose');
                        // Emit observer event.
                        this.#observer.safeEmit('close');
                        break;
                    }
                case notification_1.Event.DATACONSUMER_DATAPRODUCER_PAUSE:
                    {
                        if (this.#dataProducerPaused) {
                            break;
                        }
                        const wasPaused = this.#paused || this.#dataProducerPaused;
                        this.#dataProducerPaused = true;
                        this.safeEmit('dataproducerpause');
                        // Emit observer event.
                        if (!wasPaused) {
                            this.#observer.safeEmit('pause');
                        }
                        break;
                    }
                case notification_1.Event.DATACONSUMER_DATAPRODUCER_RESUME:
                    {
                        if (!this.#dataProducerPaused) {
                            break;
                        }
                        const wasPaused = this.#paused || this.#dataProducerPaused;
                        this.#dataProducerPaused = false;
                        this.safeEmit('dataproducerresume');
                        // Emit observer event.
                        if (wasPaused && !this.#paused) {
                            this.#observer.safeEmit('resume');
                        }
                        break;
                    }
                case notification_1.Event.DATACONSUMER_SCTP_SENDBUFFER_FULL:
                    {
                        this.safeEmit('sctpsendbufferfull');
                        break;
                    }
                case notification_1.Event.DATACONSUMER_BUFFERED_AMOUNT_LOW:
                    {
                        const notification = new FbsDataConsumer.BufferedAmountLowNotification();
                        data.body(notification);
                        const bufferedAmount = notification.bufferedAmount();
                        this.safeEmit('bufferedamountlow', bufferedAmount);
                        break;
                    }
                case notification_1.Event.DATACONSUMER_MESSAGE:
                    {
                        if (this.#closed) {
                            break;
                        }
                        const notification = new FbsDataConsumer.MessageNotification();
                        data.body(notification);
                        this.safeEmit('message', Buffer.from(notification.dataArray()), notification.ppid());
                        break;
                    }
                default:
                    {
                        logger.error('ignoring unknown event "%s" in channel listener', event);
                    }
            }
        });
    }
}
exports.DataConsumer = DataConsumer;
function dataConsumerTypeToFbs(type) {
    switch (type) {
        case 'sctp':
            return FbsDataProducer.Type.SCTP;
        case 'direct':
            return FbsDataProducer.Type.DIRECT;
        default:
            throw new TypeError('invalid DataConsumerType: ${type}');
    }
}
exports.dataConsumerTypeToFbs = dataConsumerTypeToFbs;
function dataConsumerTypeFromFbs(type) {
    switch (type) {
        case FbsDataProducer.Type.SCTP:
            return 'sctp';
        case FbsDataProducer.Type.DIRECT:
            return 'direct';
    }
}
exports.dataConsumerTypeFromFbs = dataConsumerTypeFromFbs;
function parseDataConsumerDumpResponse(data) {
    return {
        id: data.id(),
        dataProducerId: data.dataProducerId(),
        type: dataConsumerTypeFromFbs(data.type()),
        sctpStreamParameters: data.sctpStreamParameters() !== null ?
            (0, SctpParameters_1.parseSctpStreamParameters)(data.sctpStreamParameters()) :
            undefined,
        label: data.label(),
        protocol: data.protocol(),
        bufferedAmountLowThreshold: data.bufferedAmountLowThreshold(),
        paused: data.paused(),
        dataProducerPaused: data.dataProducerPaused(),
        subchannels: utils.parseVector(data, 'subchannels')
    };
}
exports.parseDataConsumerDumpResponse = parseDataConsumerDumpResponse;
function parseDataConsumerStats(binary) {
    return {
        type: 'data-consumer',
        timestamp: Number(binary.timestamp()),
        label: binary.label(),
        protocol: binary.protocol(),
        messagesSent: Number(binary.messagesSent()),
        bytesSent: Number(binary.bytesSent()),
        bufferedAmount: binary.bufferedAmount()
    };
}
