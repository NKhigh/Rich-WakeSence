export default {
    name: "Rich-WakeSence",

    config: {
        name: "Rich-WakeSence",
        type: 0,
        details: "Custom Rich Presence",
        state: "Created by Sentinel",

        largeImage: "",
        largeText: "",

        smallImage: "",
        smallText: "",

        button1: {
            enabled: false,
            text: "",
            url: ""
        },

        button2: {
            enabled: false,
            text: "",
            url: ""
        },

        timestamp: {
            enabled: true,
            countdown: false,
            duration: 3600
        }
    },

    interval: null,
    startedAt: null,

    start() {
        this.startedAt = Date.now();

        this.update();

        this.interval = setInterval(() => {
            this.update();
        }, 15000);
    },

    update() {
        const config = this.config;

        const activity = {
            name: config.name,
            type: config.type,
            details: config.details,
            state: config.state
        };

        if (config.timestamp.enabled) {
            activity.timestamps = {
                start: this.startedAt
            };

            if (config.timestamp.countdown) {
                activity.timestamps.end =
                    this.startedAt +
                    config.timestamp.duration * 1000;
            }
        }

        if (
            config.largeImage ||
            config.largeText ||
            config.smallImage ||
            config.smallText
        ) {
            activity.assets = {};

            if (config.largeImage)
                activity.assets.large_image =
                    config.largeImage;

            if (config.largeText)
                activity.assets.large_text =
                    config.largeText;

            if (config.smallImage)
                activity.assets.small_image =
                    config.smallImage;

            if (config.smallText)
                activity.assets.small_text =
                    config.smallText;
        }

        const buttons = [];

        if (
            config.button1.enabled &&
            config.button1.text &&
            config.button1.url
        ) {
            buttons.push({
                label: config.button1.text,
                url: config.button1.url
            });
        }

        if (
            config.button2.enabled &&
            config.button2.text &&
            config.button2.url
        ) {
            buttons.push({
                label: config.button2.text,
                url: config.button2.url
            });
        }

        if (buttons.length) {
            activity.buttons = buttons;
        }

        try {
            if (
                typeof FluxDispatcher !==
                "undefined"
            ) {
                FluxDispatcher.dispatch({
                    type:
                        "LOCAL_ACTIVITY_UPDATE",
                    activity,
                    socketId:
                        "Rich-WakeSence"
                });
            }
        } catch (error) {
            console.error(
                "[Rich-WakeSence]",
                error
            );
        }
    },

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        try {
            if (
                typeof FluxDispatcher !==
                "undefined"
            ) {
                FluxDispatcher.dispatch({
                    type:
                        "LOCAL_ACTIVITY_UPDATE",
                    activity: null,
                    socketId:
                        "Rich-WakeSence"
                });
            }
        } catch {}
    }
};