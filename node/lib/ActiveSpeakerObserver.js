"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSpeakerObserver = void 0;
const Logger_1 = require("./Logger");
const RtpObserver_1 = require("./RtpObserver");
const notification_1 = require("./fbs/notification");
const FbsActiveSpeakerObserver = require("./fbs/active-speaker-observer");
const logger = new Logger_1.Logger('ActiveSpeakerObserver');
class ActiveSpeakerObserver extends RtpObserver_1.RtpObserver {
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
                case notification_1.Event.ACTIVESPEAKEROBSERVER_DOMINANT_SPEAKER:
                    {
                        const notification = new FbsActiveSpeakerObserver.DominantSpeakerNotification();
                        data.body(notification);
                        const producer = this.getProducerById(notification.producerId());
                        if (!producer) {
                            break;
                        }
                        const dominantSpeaker = {
                            producer
                        };
                        this.safeEmit('dominantspeaker', dominantSpeaker);
                        this.observer.safeEmit('dominantspeaker', dominantSpeaker);
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
exports.ActiveSpeakerObserver = ActiveSpeakerObserver;
