"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mediasoup = require("../");
const errors_1 = require("../errors");
let worker;
let router;
let transport;
const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/multiopus',
        clockRate: 48000,
        channels: 6,
        parameters: {
            useinbandfec: 1,
            'channel_mapping': '0,4,1,2,3,5',
            'num_streams': 4,
            'coupled_streams': 2
        }
    }
];
const audioProducerParameters = {
    kind: 'audio',
    rtpParameters: {
        mid: 'AUDIO',
        codecs: [
            {
                mimeType: 'audio/multiopus',
                payloadType: 0,
                clockRate: 48000,
                channels: 6,
                parameters: {
                    useinbandfec: 1,
                    'channel_mapping': '0,4,1,2,3,5',
                    'num_streams': 4,
                    'coupled_streams': 2
                }
            }
        ],
        headerExtensions: [
            {
                uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
                id: 10
            },
            {
                uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
                id: 12
            }
        ]
    }
};
const consumerDeviceCapabilities = {
    codecs: [
        {
            mimeType: 'audio/multiopus',
            kind: 'audio',
            preferredPayloadType: 100,
            clockRate: 48000,
            channels: 6,
            parameters: {
                'channel_mapping': '0,4,1,2,3,5',
                'num_streams': 4,
                'coupled_streams': 2
            }
        }
    ],
    headerExtensions: [
        {
            kind: 'audio',
            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
            preferredId: 1,
            preferredEncrypt: false
        },
        {
            kind: 'audio',
            uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
            preferredId: 4,
            preferredEncrypt: false
        },
        {
            kind: 'audio',
            uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
            preferredId: 10,
            preferredEncrypt: false
        }
    ]
};
beforeAll(async () => {
    worker = await mediasoup.createWorker();
    router = await worker.createRouter({ mediaCodecs });
    transport = await router.createWebRtcTransport({
        listenIps: ['127.0.0.1']
    });
});
afterAll(() => worker.close());
test('produce/consume succeeds', async () => {
    const audioProducer = await transport.produce(audioProducerParameters);
    expect(audioProducer.rtpParameters.codecs).toEqual([
        {
            mimeType: 'audio/multiopus',
            payloadType: 0,
            clockRate: 48000,
            channels: 6,
            parameters: {
                useinbandfec: 1,
                'channel_mapping': '0,4,1,2,3,5',
                'num_streams': 4,
                'coupled_streams': 2
            },
            rtcpFeedback: []
        }
    ]);
    expect(router.canConsume({
        producerId: audioProducer.id,
        rtpCapabilities: consumerDeviceCapabilities
    }))
        .toBe(true);
    const audioConsumer = await transport.consume({
        producerId: audioProducer.id,
        rtpCapabilities: consumerDeviceCapabilities
    });
    expect(audioConsumer.rtpParameters.codecs).toEqual([
        {
            mimeType: 'audio/multiopus',
            payloadType: 100,
            clockRate: 48000,
            channels: 6,
            parameters: {
                useinbandfec: 1,
                'channel_mapping': '0,4,1,2,3,5',
                'num_streams': 4,
                'coupled_streams': 2
            },
            rtcpFeedback: []
        }
    ]);
    audioProducer.close();
    audioConsumer.close();
}, 2000);
test('fails to produce wrong parameters', async () => {
    await expect(transport.produce({
        kind: 'audio',
        rtpParameters: {
            mid: 'AUDIO',
            codecs: [
                {
                    mimeType: 'audio/multiopus',
                    payloadType: 0,
                    clockRate: 48000,
                    channels: 6,
                    parameters: {
                        'channel_mapping': '0,4,1,2,3,5',
                        'num_streams': 2,
                        'coupled_streams': 2
                    }
                }
            ]
        }
    }))
        .rejects
        .toThrow(errors_1.UnsupportedError);
    await expect(transport.produce({
        kind: 'audio',
        rtpParameters: {
            mid: 'AUDIO',
            codecs: [
                {
                    mimeType: 'audio/multiopus',
                    payloadType: 0,
                    clockRate: 48000,
                    channels: 6,
                    parameters: {
                        'channel_mapping': '0,4,1,2,3,5',
                        'num_streams': 4,
                        'coupled_streams': 1
                    }
                }
            ]
        }
    }))
        .rejects
        .toThrow(errors_1.UnsupportedError);
}, 2000);
test('fails to consume wrong channels', async () => {
    const audioProducer = await transport.produce(audioProducerParameters);
    const localConsumerDeviceCapabilities = {
        codecs: [
            {
                mimeType: 'audio/multiopus',
                kind: 'audio',
                preferredPayloadType: 100,
                clockRate: 48000,
                channels: 8,
                parameters: {
                    'channel_mapping': '0,4,1,2,3,5',
                    'num_streams': 4,
                    'coupled_streams': 2
                }
            }
        ]
    };
    expect(!router.canConsume({
        producerId: audioProducer.id,
        rtpCapabilities: localConsumerDeviceCapabilities
    }))
        .toBe(true);
    await expect(transport.consume({
        producerId: audioProducer.id,
        rtpCapabilities: localConsumerDeviceCapabilities
    }))
        .rejects
        .toThrow(Error);
    audioProducer.close();
}, 2000);
