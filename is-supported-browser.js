const isSupportedBrowser = () => {
  return (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    "MediaStreamTrackProcessor" in window &&
    "VideoEncoder" in window &&
    "VideoDecoder" in window 
  );
};

export default isSupportedBrowser;
