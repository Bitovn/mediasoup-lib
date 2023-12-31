"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePipeTransportDumpResponse = exports.PipeTransport = void 0;
const Logger_1 = require("./Logger");
const ortc = require("./ortc");
const Transport_1 = require("./Transport");
const Consumer_1 = require("./Consumer");
const RtpParameters_1 = require("./RtpParameters");
const SrtpParameters_1 = require("./SrtpParameters");
const utils_1 = require("./utils");
const media_kind_1 = require("./fbs/rtp-parameters/media-kind");
const FbsRtpParameters = require("./fbs/rtp-parameters");
const notification_1 = require("./fbs/notification");
const FbsRequest = require("./fbs/request");
const FbsTransport = require("./fbs/transport");
const FbsPipeTransport = require("./fbs/pipe-transport");
const logger = new Logger_1.Logger('PipeTransport');
class PipeTransport extends Transport_1.Transport {
    // PipeTransport data.
    #data;
    /**
     * @private
     */
    constructor(options) {
        super(options);
        logger.debug('constructor()');
        const { data } = options;
        this.#data =
            {
                tuple: data.tuple,
                sctpParameters: data.sctpParameters,
                sctpState: data.sctpState,
                rtx: data.rtx,
                srtpParameters: data.srtpParameters
            };
        this.handleWorkerNotifications();
    }
    /**
     * Transport tuple.
     */
    get tuple() {
        return this.#data.tuple;
    }
    /**
     * SCTP parameters.
     */
    get sctpParameters() {
        return this.#data.sctpParameters;
    }
    /**
     * SCTP state.
     */
    get sctpState() {
        return this.#data.sctpState;
    }
    /**
     * SRTP parameters.
     */
    get srtpParameters() {
        return this.#data.srtpParameters;
    }
    /**
     * Close the PipeTransport.
     *
     * @override
     */
    close() {
        if (this.closed) {
            return;
        }
        if (this.#data.sctpState) {
            this.#data.sctpState = 'closed';
        }
        super.close();
    }
    /**
     * Router was closed.
     *
     * @private
     * @override
     */
    routerClosed() {
        if (this.closed) {
            return;
        }
        if (this.#data.sctpState) {
            this.#data.sctpState = 'closed';
        }
        super.routerClosed();
    }
    /**
     * Get PipeTransport stats.
     *
     * @override
     */
    async getStats() {
        logger.debug('getStats()');
        const response = await this.channel.request(FbsRequest.Method.TRANSPORT_GET_STATS, undefined, undefined, this.internal.transportId);
        /* Decode Response. */
        const data = new FbsPipeTransport.GetStatsResponse();
        response.body(data);
        return [parseGetStatsResponse(data)];
    }
    /**
     * Provide the PipeTransport remote parameters.
     *
     * @override
     */
    async connect({ ip, port, srtpParameters }) {
        logger.debug('connect()');
        const requestOffset = createConnectRequest({
            builder: this.channel.bufferBuilder,
            ip,
            port,
            srtpParameters
        });
        // Wait for response.
        const response = await this.channel.request(FbsRequest.Method.PIPETRANSPORT_CONNECT, FbsRequest.Body.PipeTransport_ConnectRequest, requestOffset, this.internal.transportId);
        /* Decode Response. */
        const data = new FbsPipeTransport.ConnectResponse();
        response.body(data);
        // Update data.
        if (data.tuple()) {
            this.#data.tuple = (0, Transport_1.parseTuple)(data.tuple());
        }
    }
    /**
     * Create a pipe Consumer.
     *
     * @override
     */
    async consume({ producerId, appData }) {
        logger.debug('consume()');
        if (!producerId || typeof producerId !== 'string') {
            throw new TypeError('missing producerId');
        }
        else if (appData && typeof appData !== 'object') {
            throw new TypeError('if given, appData must be an object');
        }
        const producer = this.getProducerById(producerId);
        if (!producer) {
            throw Error(`Producer with id "${producerId}" not found`);
        }
        // This may throw.
        const rtpParameters = ortc.getPipeConsumerRtpParameters({
            consumableRtpParameters: producer.consumableRtpParameters,
            enableRtx: this.#data.rtx
        });
        const consumerId = (0, utils_1.generateUUIDv4)();
        const consumeRequestOffset = createConsumeRequest({
            builder: this.channel.bufferBuilder,
            consumerId,
            producer,
            rtpParameters
        });
        const response = await this.channel.request(FbsRequest.Method.TRANSPORT_CONSUME, FbsRequest.Body.Transport_ConsumeRequest, consumeRequestOffset, this.internal.transportId);
        /* Decode Response. */
        const consumeResponse = new FbsTransport.ConsumeResponse();
        response.body(consumeResponse);
        const status = consumeResponse.unpack();
        const data = {
            producerId,
            kind: producer.kind,
            rtpParameters,
            type: 'pipe'
        };
        const consumer = new Consumer_1.Consumer({
            internal: {
                ...this.internal,
                consumerId
            },
            data,
            channel: this.channel,
            appData,
            paused: status.paused,
            producerPaused: status.producerPaused
        });
        this.consumers.set(consumer.id, consumer);
        consumer.on('@close', () => this.consumers.delete(consumer.id));
        consumer.on('@producerclose', () => this.consumers.delete(consumer.id));
        // Emit observer event.
        this.observer.safeEmit('newconsumer', consumer);
        return consumer;
    }
    handleWorkerNotifications() {
        this.channel.on(this.internal.transportId, (event, data) => {
            switch (event) {
                case notification_1.Event.TRANSPORT_SCTP_STATE_CHANGE:
                    {
                        const notification = new FbsTransport.SctpStateChangeNotification();
                        data.body(notification);
                        const sctpState = (0, Transport_1.parseSctpState)(notification.sctpState());
                        this.#data.sctpState = sctpState;
                        this.safeEmit('sctpstatechange', sctpState);
                        // Emit observer event.
                        this.observer.safeEmit('sctpstatechange', sctpState);
                        break;
                    }
                case notification_1.Event.TRANSPORT_TRACE:
                    {
                        const notification = new FbsTransport.TraceNotification();
                        data.body(notification);
                        const trace = (0, Transport_1.parseTransportTraceEventData)(notification);
                        this.safeEmit('trace', trace);
                        // Emit observer event.
                        this.observer.safeEmit('trace', trace);
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
exports.PipeTransport = PipeTransport;
/*
 * flatbuffers helpers.
 */
function parsePipeTransportDumpResponse(binary) {
    // Retrieve BaseTransportDump.
    const baseTransportDump = (0, Transport_1.parseBaseTransportDump)(binary.base());
    // Retrieve RTP Tuple.
    const tuple = (0, Transport_1.parseTuple)(binary.tuple());
    // Retrieve SRTP Parameters.
    let srtpParameters;
    if (binary.srtpParameters()) {
        srtpParameters = (0, SrtpParameters_1.parseSrtpParameters)(binary.srtpParameters());
    }
    return {
        ...baseTransportDump,
        tuple: tuple,
        rtx: binary.rtx(),
        srtpParameters: srtpParameters
    };
}
exports.parsePipeTransportDumpResponse = parsePipeTransportDumpResponse;
function parseGetStatsResponse(binary) {
    const base = (0, Transport_1.parseBaseTransportStats)(binary.base());
    return {
        ...base,
        type: 'pipe-transport',
        tuple: (0, Transport_1.parseTuple)(binary.tuple())
    };
}
function createConsumeRequest({ builder, consumerId, producer, rtpParameters }) {
    // Build the request.
    const producerIdOffset = builder.createString(producer.id);
    const consumerIdOffset = builder.createString(consumerId);
    const rtpParametersOffset = (0, RtpParameters_1.serializeRtpParameters)(builder, rtpParameters);
    let consumableRtpEncodingsOffset;
    if (producer.consumableRtpParameters.encodings) {
        consumableRtpEncodingsOffset = (0, RtpParameters_1.serializeRtpEncodingParameters)(builder, producer.consumableRtpParameters.encodings);
    }
    const ConsumeRequest = FbsTransport.ConsumeRequest;
    // Create Consume Request.
    ConsumeRequest.startConsumeRequest(builder);
    ConsumeRequest.addConsumerId(builder, consumerIdOffset);
    ConsumeRequest.addProducerId(builder, producerIdOffset);
    ConsumeRequest.addKind(builder, producer.kind === 'audio' ? media_kind_1.MediaKind.AUDIO : media_kind_1.MediaKind.VIDEO);
    ConsumeRequest.addRtpParameters(builder, rtpParametersOffset);
    ConsumeRequest.addType(builder, FbsRtpParameters.Type.PIPE);
    if (consumableRtpEncodingsOffset) {
        ConsumeRequest.addConsumableRtpEncodings(builder, consumableRtpEncodingsOffset);
    }
    return ConsumeRequest.endConsumeRequest(builder);
}
function createConnectRequest({ builder, ip, port, srtpParameters }) {
    let ipOffset = 0;
    let srtpParametersOffset = 0;
    if (ip) {
        ipOffset = builder.createString(ip);
    }
    // Serialize SrtpParameters.
    if (srtpParameters) {
        srtpParametersOffset = (0, SrtpParameters_1.serializeSrtpParameters)(builder, srtpParameters);
    }
    // Create PlainTransportConnectData.
    FbsPipeTransport.ConnectRequest.startConnectRequest(builder);
    FbsPipeTransport.ConnectRequest.addIp(builder, ipOffset);
    if (typeof port === 'number') {
        FbsPipeTransport.ConnectRequest.addPort(builder, port);
    }
    if (srtpParameters) {
        FbsPipeTransport.ConnectRequest.addSrtpParameters(builder, srtpParametersOffset);
    }
    return FbsPipeTransport.ConnectRequest.endConnectRequest(builder);
}
