const getCodecConfig = () => {
    return {
        codec: "vp8",
        width: 640,
        height: 480,
        bitrate: 2_000_000, // 2 Mbps
        framerate: 30,
      };
}

export default getCodecConfig;