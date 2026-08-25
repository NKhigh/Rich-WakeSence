import definePlugin from "@utils/types";
import { FluxDispatcher } from "@metro/common";

const applicationId = "123456789012345678";

let timer: ReturnType<typeof setInterval> | undefined;
let startTime = Date.now();

const config = {
    name: "Rich-WakeSence",
    type: 0,
    details: "Custom Rich Presence",
    state: "Created by Sentinel",

    largeImage: "",
    largeText: "",

    smallImage: "",
    smallText: "",

    button1Text: "",
    button1Url: "",

    button2Text: "",
    button2Url: ""
};

function createActivity() {
    const activity: any = {
        application_id: applicationId,
        name: config.name,
        type: config.type,
        details: config.details,
        state: config.state,

        timestamps: {
            start: startTime
        }
    };

    if (
        config.largeImage ||
        config.largeText ||
        config.smallImage ||
        config.smallText
    ) {
        activity.assets = {};

        if (config.largeImage) {
            activity.assets.large_image =
                config.largeImage;
        }

        if (config.largeText) {
            activity.assets.large_text =
                config.largeText;
        }

        if (config.smallImage) {
            activity.assets.small_image =
                config.smallImage;
        }

        if (config.smallText) {
            activity.assets.small_text =
                config.smallText;
        }
    }

    const buttons: string[] = [];
    const urls: string[] = [];

    if (
        config.button1Text &&
        config.button1Url
    ) {
        buttons.push(config.button1Text);
        urls.push(config.button1Url);
    }

    if (
        config.button2Text &&
        config.button2Url
    ) {
        buttons.push(config.button2Text);
        urls.push(config.button2Url);
    }

    if (buttons.length > 0) {
        activity.buttons = buttons;

        activity.metadata = {
            button_urls: urls
        };
    }

    return activity;
}

function updatePresence() {
    try {
        FluxDispatcher.dispatch({
            type: "LOCAL_ACTIVITY_UPDATE",
            activity: createActivity(),
            socketId: "Rich-WakeSence"
        });
    } catch (error) {
        console.error(
            "[Rich-WakeSence]",
            error
        );
    }
}

function removePresence() {
    try {
        FluxDispatcher.dispatch({
            type: "LOCAL_ACTIVITY_UPDATE",
            activity: null,
            socketId: "Rich-WakeSence"
        });
    } catch {}
}

export default definePlugin({
    name: "Rich-WakeSence",

    description:
        "Custom Rich Presence plugin for Kettu.",

    authors: [
        {
            name: "Sentinel"
        }
    ],

    start() {
        startTime = Date.now();

        updatePresence();

        timer = setInterval(
            updatePresence,
            15000
        );
    },

    stop() {
        if (timer) {
            clearInterval(timer);
            timer = undefined;
        }

        removePresence();
    }
});