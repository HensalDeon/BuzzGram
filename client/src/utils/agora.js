import AgoraRTC from "agora-rtc-sdk-ng";

const config = {
    mode: "rtc",
    codec: "vp9",
};

let client = AgoraRTC.createClient(config);
let options = {
    appId: "7da9f91d67c847669ae92ea41d529572",
    channel: "call",
    uid: null,
    token: null,
};

let localTracks = {
    audioTrack: null,
    videoTrack: null,
};

let remoteUsers = {};

const join = async (callType) => {
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnPublished);
    try {
        [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            client.join(options.appId, options.channel, options.token || null),
            AgoraRTC.createMicrophoneAudioTrack(),
            callType === "video" ? AgoraRTC.createCameraVideoTrack() : null,
        ]);
        const tracksToPublish = Object.values(localTracks).filter((track) => track !== null);
        if (callType === "video") {
            localTracks.videoTrack.play("local-video");
        }
        await client.publish(Object.values(tracksToPublish));
    } catch (error) {
        console.error("Error joining the channel:", error);
    }
};

const subscribe = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
        user.videoTrack.play("remote-video");
    }
    if (mediaType === "audio") {
        user.audioTrack.play();
    }
};
const leave = async () => {
    for (const trackName in localTracks) {
        const track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = undefined;
        }

        remoteUsers = {};
        await client.leave();
    }
};
const handleUserPublished = async (user, mediaType) => {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
};
const handleUserUnPublished = async (user) => {
    const id = user.uid;
    delete remoteUsers[id];
};

const handleMuteVideo = (isMuted) => {
    if (isMuted) {
        localTracks.videoTrack.setEnabled(true);
    } else {
        localTracks.videoTrack.setEnabled(false);
    }
};
const handleMuteAudio = (isMuted) => {
    if (isMuted) {
        localTracks.audioTrack.setEnabled(true);
    } else {
        localTracks.audioTrack.setEnabled(false);
    }
};

export {
    join,
    client,
    options,
    subscribe,
    leave,
    handleUserPublished,
    handleUserUnPublished,
    handleMuteVideo,
    handleMuteAudio,
};
export { localTracks, remoteUsers };
