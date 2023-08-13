function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

const getHighestresolutionDevice = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    let highestResolution = 0;
    let selectedDeviceId = null;
    let width = 0;
    let height = 0;

    for (const device of videoDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: device.deviceId, facingMode: "user" },
      });

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      if (settings.width * settings.height > highestResolution) {
        highestResolution = settings.width * settings.height;
        selectedDeviceId = device.deviceId;
        width = settings.width;
        height = settings.height;
      }

      stopMediaTracks(stream); // Release the stream to avoid resource leaks
    }

    return { deviceId: selectedDeviceId, width, height };
  } catch (error) {
    console.error("Error selecting camera:", error);
    return null;
  }
};

export default getHighestresolutionDevice;
