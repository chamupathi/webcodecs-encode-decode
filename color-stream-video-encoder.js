import { COLOR_CONFIG } from "./color-config.js";

import getCodecConfigImpl from "./get-codec-config.js";
import getHighestresolutionDevice from "./get-highest-resolution-device.js";

export class ColorStramVideoEncoder {
  constructor(colorStream, framesPerSec) {
    this.colorStream = colorStream;
    this.framesPerSec = framesPerSec;
    this.colorConfig = COLOR_CONFIG;
    this.data = [];

    this.config = getCodecConfigImpl();
  }

  /**
   * Store an array of frames according to the config
   *
   * @param {string} videoElementId - element Id of the video element [optional]
   */
  captureFrames = async (videoElementId) => {
    this.data = [];
    await this._initDevice();

    if(!this.deviceId) {
      return
    }

    const noOfFrames = this.colorStream.length;

    const supported = await this.isEncodingConfigSupported();

    if (!supported || !this.deviceId) return;

    this._initEncoder();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.deviceId },
      });

      const track = stream.getTracks()[0];
      const trackProcessor = new MediaStreamTrackProcessor(track);
      const reader = trackProcessor.readable.getReader();
      const video = document.getElementById(videoElementId || "video");


      video.srcObject = stream;

      let frameCount = 0;
      let nextTimeStamp = 0;

      while (frameCount < noOfFrames) {
        const result = await reader.read();
        if (result.done) break;

        const frame = result.value;

        if (nextTimeStamp > frame.timestamp) {
          frame.close();
          continue;
        }

        this._handleBeforeFrameCapture(frameCount);

        nextTimeStamp = nextTimeStamp + 1_000_000 / this.framesPerSec;

        frameCount++;

        this.encoder.encode(frame);
        frame.close();
      }

      // stop showing web cam video
      video.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());

      // revert any chages left by _handleBeforeFrameCapture
      this._handleAfterFrameCapture();

      await this.encoder.flush();
    } catch (error) {
      this._handleError(error);
    }

    return this.data;
  };

  _handleBeforeFrameCapture = (idx) => {
    const color = this.colorConfig[this.colorStream[idx]];
    if (!color) return;
    document.body.style.backgroundColor = color;
  };

  _handleAfterFrameCapture = () => {
    document.body.style.backgroundColor = "initial";
  };

  isEncodingConfigSupported = async () => {
    const { supported } = await VideoEncoder.isConfigSupported(this.config);
    return supported;
  };

  _initDevice = async () => {
    if (this.deviceId) return;

    const device = await getHighestresolutionDevice();

    
    this.deviceId = device?.deviceId;
    this.width = device?.width;
    this.height = device?.height;
  };

  _initEncoder = () => {
    if (this.encoder) return this.encoder;

    this.encodingInit = {
      output: this._handleChunk,
      error: this._handleError,
    };

    this.encoder = new VideoEncoder(this.encodingInit);
    this.encoder.configure(this.config);
  };

  _handleChunk = (chunk, _metadata) => {
    const chunkData = new Uint8Array(chunk.byteLength);
    chunk.copyTo(chunkData);

    this.data.push({
      data: chunkData,
      type: chunk.type,
      timestamp: chunk.timestamp,
    });
  };

  _handleError = (e) => console.error(e.message);
}

