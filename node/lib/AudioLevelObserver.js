"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioLevelObserver = void 0;
const Logger_1 = require("./Logger");
const RtpObserver_1 = require("./RtpObserver");
const utils = require("./utils");
const notification_1 = require("./fbs/notification");
const FbsAudioLevelObserver = require("./fbs/audio-level-observer");
const logger = new Logger_1.Logger('AudioLevelObserver');
class AudioLevelObserver extends RtpObserver_1.RtpObserver {
    /**
     * @private
     */
    constructor(options) {
        super(options);
        this.handleWorkerNotifications();
    }
    /**
     * Observer.
     */
    get observer() {
        return super.observer;
    }
    handleWorkerNotifications() {
        this.channel.on(this.internal.rtpObserverId, (event, data) => {
            switch (event) {
                case notification_1.Event.AUDIOLEVELOBSERVER_VOLUMES:
                    {
                        const notification = new FbsAudioLevelObserver.VolumesNotification();
                        data.body(notification);
                        // Get the corresponding Producer instance and remove entries with
                        // no Producer (it may have been closed in the meanwhile).
                        const volumes = utils.parseVector(notification, 'volumes', parseVolume)
                            .map(({ producerId, volume }) => ({
                            producer: this.getProducerById(producerId),
                            volume
                        }))
                            .filter(({ producer }) => producer);
                        if (volumes.length > 0) {
                            this.safeEmit('volumes', volumes);
                            // Emit observer event.
                            this.observer.safeEmit('volumes', volumes);
                        }
                        break;
                    }
                case notification_1.Event.AUDIOLEVELOBSERVER_SILENCE:
                    {
                        this.safeEmit('silence');
                        // Emit observer event.
                        this.observer.safeEmit('silence');
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
exports.AudioLevelObserver = AudioLevelObserver;
function parseVolume(binary) {
    return {
        producerId: binary.producerId(),
        volume: binary.volume()
    };
}
