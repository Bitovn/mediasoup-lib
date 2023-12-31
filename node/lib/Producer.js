"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProducerDump = exports.producerTypeToFbs = exports.producerTypeFromFbs = exports.Producer = void 0;
const Logger_1 = require("./Logger");
const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");
const RtpParameters_1 = require("./RtpParameters");
const notification_1 = require("./fbs/notification");
const RtpStream_1 = require("./RtpStream");
const utils = require("./utils");
const common_1 = require("./fbs/common");
const FbsNotification = require("./fbs/notification");
const FbsRequest = require("./fbs/request");
const FbsTransport = require("./fbs/transport");
const FbsProducer = require("./fbs/producer");
const FbsProducerTraceInfo = require("./fbs/producer/trace-info");
const FbsRtpParameters = require("./fbs/rtp-parameters");
const logger = new Logger_1.Logger('Producer');
class Producer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
    // Internal data.
    #internal;
    // Producer data.
    #data;
    // Channel instance.
    #channel;
    // Closed flag.
    #closed = false;
    // Paused flag.
    #paused = false;
    // Custom app data.
    #appData;
    // Current score.
    #score = [];
    // Observer instance.
    #observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    /**
     * @private
     */
    constructor({ internal, data, channel, appData, paused }) {
        super();
        logger.debug('constructor()');
        this.#internal = internal;
        this.#data = data;
        this.#channel = channel;
        this.#paused = paused;
        this.#appData = appData || {};
        this.handleWorkerNotifications();
    }
    /**
     * Producer id.
     */
    get id() {
        return this.#internal.producerId;
    }
    /**
     * Whether the Producer is closed.
     */
    get closed() {
        return this.#closed;
    }
    /**
     * Media kind.
     */
    get kind() {
        return this.#data.kind;
    }
    /**
     * RTP parameters.
     */
    get rtpParameters() {
        return this.#data.rtpParameters;
    }
    /**
     * Producer type.
     */
    get type() {
        return this.#data.type;
    }
    /**
     * Consumable RTP parameters.
     *
     * @private
     */
    get consumableRtpParameters() {
        return this.#data.consumableRtpParameters;
    }
    /**
     * Whether the Producer is paused.
     */
    get paused() {
        return this.#paused;
    }
    /**
     * Producer score list.
     */
    get score() {
        return this.#score;
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
     * @private
     * Just for testing purposes.
     */
    get channelForTesting() {
        return this.#channel;
    }
    /**
     * Close the Producer.
     */
    close() {
        if (this.#closed) {
            return;
        }
        logger.debug('close()');
        this.#closed = true;
        // Remove notification subscriptions.
        this.#channel.removeAllListeners(this.#internal.producerId);
        /* Build Request. */
        const requestOffset = new FbsTransport.CloseProducerRequestT(this.#internal.producerId).pack(this.#channel.bufferBuilder);
        this.#channel.request(FbsRequest.Method.TRANSPORT_CLOSE_PRODUCER, FbsRequest.Body.Transport_CloseProducerRequest, requestOffset, this.#internal.transportId).catch(() => { });
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
        this.#channel.removeAllListeners(this.#internal.producerId);
        this.safeEmit('transportclose');
        // Emit observer event.
        this.#observer.safeEmit('close');
    }
    /**
     * Dump Producer.
     */
    async dump() {
        logger.debug('dump()');
        const response = await this.#channel.request(FbsRequest.Method.PRODUCER_DUMP, undefined, undefined, this.#internal.producerId);
        /* Decode Response. */
        const dumpResponse = new FbsProducer.DumpResponse();
        response.body(dumpResponse);
        return parseProducerDump(dumpResponse);
    }
    /**
     * Get Producer stats.
     */
    async getStats() {
        logger.debug('getStats()');
        const response = await this.#channel.request(FbsRequest.Method.PRODUCER_GET_STATS, undefined, undefined, this.#internal.producerId);
        /* Decode Response. */
        const data = new FbsProducer.GetStatsResponse();
        response.body(data);
        return parseProducerStats(data);
    }
    /**
     * Pause the Producer.
     */
    async pause() {
        logger.debug('pause()');
        const wasPaused = this.#paused;
        await this.#channel.request(FbsRequest.Method.PRODUCER_PAUSE, undefined, undefined, this.#internal.producerId);
        this.#paused = true;
        // Emit observer event.
        if (!wasPaused) {
            this.#observer.safeEmit('pause');
        }
    }
    /**
     * Resume the Producer.
     */
    async resume() {
        logger.debug('resume()');
        const wasPaused = this.#paused;
        await this.#channel.request(FbsRequest.Method.PRODUCER_RESUME, undefined, undefined, this.#internal.producerId);
        this.#paused = false;
        // Emit observer event.
        if (wasPaused) {
            this.#observer.safeEmit('resume');
        }
    }
    /**
     * Enable 'trace' event.
     */
    async enableTraceEvent(types = []) {
        logger.debug('enableTraceEvent()');
        if (!Array.isArray(types)) {
            throw new TypeError('types must be an array');
        }
        if (types.find((type) => typeof type !== 'string')) {
            throw new TypeError('every type must be a string');
        }
        // Convert event types.
        const fbsEventTypes = [];
        for (const eventType of types) {
            try {
                fbsEventTypes.push(producerTraceEventTypeToFbs(eventType));
            }
            catch (error) {
                logger.warn('enableTraceEvent() | [error:${error}]');
            }
        }
        /* Build Request. */
        const requestOffset = new FbsProducer.EnableTraceEventRequestT(fbsEventTypes).pack(this.#channel.bufferBuilder);
        await this.#channel.request(FbsRequest.Method.PRODUCER_ENABLE_TRACE_EVENT, FbsRequest.Body.Producer_EnableTraceEventRequest, requestOffset, this.#internal.producerId);
    }
    /**
     * Send RTP packet (just valid for Producers created on a DirectTransport).
     */
    send(rtpPacket) {
        if (!Buffer.isBuffer(rtpPacket)) {
            throw new TypeError('rtpPacket must be a Buffer');
        }
        const builder = this.#channel.bufferBuilder;
        const dataOffset = FbsProducer.SendNotification.createDataVector(builder, rtpPacket);
        const notificationOffset = FbsProducer.SendNotification.createSendNotification(builder, dataOffset);
        this.#channel.notify(FbsNotification.Event.PRODUCER_SEND, FbsNotification.Body.Producer_SendNotification, notificationOffset, this.#internal.producerId);
    }
    handleWorkerNotifications() {
        this.#channel.on(this.#internal.producerId, (event, data) => {
            switch (event) {
                case notification_1.Event.PRODUCER_SCORE:
                    {
                        const notification = new FbsProducer.ScoreNotification();
                        data.body(notification);
                        const score = utils.parseVector(notification, 'scores', parseProducerScore);
                        this.#score = score;
                        this.safeEmit('score', score);
                        // Emit observer event.
                        this.#observer.safeEmit('score', score);
                        break;
                    }
                case notification_1.Event.PRODUCER_VIDEO_ORIENTATION_CHANGE:
                    {
                        const notification = new FbsProducer.VideoOrientationChangeNotification();
                        data.body(notification);
                        const videoOrientation = notification.unpack();
                        this.safeEmit('videoorientationchange', videoOrientation);
                        // Emit observer event.
                        this.#observer.safeEmit('videoorientationchange', videoOrientation);
                        break;
                    }
                case notification_1.Event.PRODUCER_TRACE:
                    {
                        const notification = new FbsProducer.TraceNotification();
                        data.body(notification);
                        const trace = parseTraceEventData(notification);
                        this.safeEmit('trace', trace);
                        // Emit observer event.
                        this.#observer.safeEmit('trace', trace);
                        break;
                    }
                default:
                    {
                        logger.error('ignoring unknown event "%s"', event);
                    }
            }
        });
    }
}
exports.Producer = Producer;
function producerTypeFromFbs(type) {
    switch (type) {
        case FbsRtpParameters.Type.SIMPLE:
            return 'simple';
        case FbsRtpParameters.Type.SIMULCAST:
            return 'simulcast';
        case FbsRtpParameters.Type.SVC:
            return 'svc';
        default:
            throw new TypeError(`invalid FbsRtpParameters.Type: ${type}`);
    }
}
exports.producerTypeFromFbs = producerTypeFromFbs;
function producerTypeToFbs(type) {
    switch (type) {
        case 'simple':
            return FbsRtpParameters.Type.SIMPLE;
        case 'simulcast':
            return FbsRtpParameters.Type.SIMULCAST;
        case 'svc':
            return FbsRtpParameters.Type.SVC;
    }
}
exports.producerTypeToFbs = producerTypeToFbs;
function producerTraceEventTypeToFbs(eventType) {
    switch (eventType) {
        case 'keyframe':
            return FbsProducer.TraceEventType.KEYFRAME;
        case 'fir':
            return FbsProducer.TraceEventType.FIR;
        case 'nack':
            return FbsProducer.TraceEventType.NACK;
        case 'pli':
            return FbsProducer.TraceEventType.PLI;
        case 'rtp':
            return FbsProducer.TraceEventType.RTP;
        default:
            throw new TypeError(`invalid ProducerTraceEventType: ${eventType}`);
    }
}
function producerTraceEventTypeFromFbs(eventType) {
    switch (eventType) {
        case FbsProducer.TraceEventType.KEYFRAME:
            return 'keyframe';
        case FbsProducer.TraceEventType.FIR:
            return 'fir';
        case FbsProducer.TraceEventType.NACK:
            return 'nack';
        case FbsProducer.TraceEventType.PLI:
            return 'pli';
        case FbsProducer.TraceEventType.RTP:
            return 'rtp';
    }
}
function parseProducerDump(data) {
    return {
        id: data.id(),
        kind: data.kind() === FbsRtpParameters.MediaKind.AUDIO ? 'audio' : 'video',
        type: producerTypeFromFbs(data.type()),
        rtpParameters: (0, RtpParameters_1.parseRtpParameters)(data.rtpParameters()),
        // NOTE: optional values are represented with null instead of undefined.
        // TODO: Make flatbuffers TS return undefined instead of null.
        rtpMapping: data.rtpMapping() ? data.rtpMapping().unpack() : undefined,
        // NOTE: optional values are represented with null instead of undefined.
        // TODO: Make flatbuffers TS return undefined instead of null.
        rtpStreams: data.rtpStreamsLength() > 0 ?
            utils.parseVector(data, 'rtpStreams', (rtpStream) => rtpStream.unpack()) :
            undefined,
        traceEventTypes: utils.parseVector(data, 'traceEventTypes', producerTraceEventTypeFromFbs),
        paused: data.paused()
    };
}
exports.parseProducerDump = parseProducerDump;
function parseProducerStats(binary) {
    return utils.parseVector(binary, 'stats', RtpStream_1.parseRtpStreamRecvStats);
}
function parseProducerScore(binary) {
    return {
        encodingIdx: binary.encodingIdx(),
        ssrc: binary.ssrc(),
        rid: binary.rid() ?? undefined,
        score: binary.score()
    };
}
function parseTraceEventData(trace) {
    let info;
    if (trace.infoType() !== FbsProducer.TraceInfo.NONE) {
        const accessor = trace.info.bind(trace);
        info = FbsProducerTraceInfo.unionToTraceInfo(trace.infoType(), accessor);
        trace.info(info);
    }
    return {
        type: producerTraceEventTypeFromFbs(trace.type()),
        timestamp: Number(trace.timestamp()),
        direction: trace.direction() === common_1.TraceDirection.DIRECTION_IN ? 'in' : 'out',
        info: info ? info.unpack() : undefined
    };
}
