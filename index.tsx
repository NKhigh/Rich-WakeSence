import { findByProps } from "@metro/common";
import definePlugin from "@utils/types";

const FluxDispatcher = findByProps("dispatch");

let interval: ReturnType<typeof setInterval> | null = null;
let startTime = Date.now();

const CONFIG = {
    name: "Rich-WakeSence",
    type: 0,
    details: "Rich Presence actif",
    state: "Created by Sentinel",

    largeImage: "",
    largeText: "",
    smallImage: "",
    smallText: "",

    button1: {
        enabled: false,
        text: "",
        url: "",
    },

    button2: {
        enabled: false,
        text: "",
        url: "",
    },
};

function createActivity() {
    const activity: any = {
        name: CONFIG.name,
        type: CONFIG.type,
        details: CONFIG.details,
        state: CONFIG.state,
        timestamps: {
            start: startTime,
        },
    };

    if (CONFIG.largeImage) {
        activity.assets = {
            ...(activity.assets ?? {}),
            large_image: CONFIG.largeImage,
        };
    }

    if (CONFIG.largeText) {
        activity.assets = {
            ...(activity.assets ?? {}),
            large_text: CONFIG.largeText,
        };
    }

    if (CONFIG.smallImage) {
        activity.assets = {
            ...(activity.assets ?? {}),
            small_image: CONFIG.smallImage,
        };
    }

    if (CONFIG.smallText) {
        activity.assets = {
            ...(activity.assets ?? {}),
            small_text: CONFIG.smallText,
        };
    }

    const buttons = [];

    if (
        CONFIG.button1.enabled &&
        CONFIG.button1.text &&
        CONFIG.button1.url
    ) {
        buttons.push({
            label: CONFIG.button1.text,
            url: CONFIG.button1.url,
        });
    }

    if (
        CONFIG.button2.enabled &&
        CONFIG.button2.text &&
        CONFIG.button2.url
    ) {
        buttons.push({
            label: CONFIG.button2.text,
            url: CONFIG.button2.url,
        });
    }

    if (buttons.length > 0) {
        activity.buttons = buttons.map(
            (button) => button.label
        );

        activity.metadata = {
            button_urls: buttons.map(
                (button) => button.url
            ),
        };
    }

    return activity;
}

function updatePresence() {
    try {
        FluxDispatcher.dispatch({
            type: "LOCAL_ACTIVITY_UPDATE",
            activity: createActivity(),
            socketId: "Rich-WakeSence",
        });
    } catch (error) {
        console.error(
            "[Rich-WakeSence]",
            "Failed to update presence",
            error
        );
    }
}

function clearPresence() {
    try {
        FluxDispatcher.dispatch({
            type: "LOCAL_ACTIVITY_UPDATE",
            activity: null,
            socketId: "Rich-WakeSence",
        });
    } catch {}
}

export default definePlugin({
    name: "Rich-WakeSence",

    description:
        "Simple Rich Presence plugin for Kettu.",

    authors: [
        {
            name: "Sentinel",
        },
    ],

    start() {
        startTime = Date.now();

        updatePresence();

        interval = setInterval(() => {
            updatePresence();
        }, 15000);
    },

    stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        clearPresence();
    },
});