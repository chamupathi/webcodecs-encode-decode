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

    if (!this.deviceId) {
      return;
    }

    const noOfFrames = this.colorStream.length;

    const supported = await this.isEncodingConfigSupported();

    if (!supported) {
      throw new Error ('The encoding config is not supported')
    };

    this._initEncoder();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.deviceId },
      });

      const track = stream.getTracks()[0];
      const trackProcessor = new MediaStreamTrackProcessor(track);
      const reader = trackProcessor.readable.getReader();
      const video = document.getElementById(videoElementId || "video");

      // Set the stram to video element so that it will display in the page
      video.srcObject = stream;

      let frameCount = 0;
      let nextTimeStamp = 0;

      // Loop until cature the required number of frames
      while (frameCount < noOfFrames) {
        
        // Run necessory changes need to happen before the frame capture.
        // i.e. Changing the background color
        this._handleBeforeFrameCapture(frameCount);

        const result = await reader.read();
        if (result.done) break;

        const frame = result.value;

        if (nextTimeStamp > frame.timestamp) {
          // the required frame already captured for the current time frame.
          // ignore this frame
          frame.close();
          continue;
        }

        // If hit here, a new frame needs to be encoded for the current time frame.

        if (this.encoder.encodeQueueSize > 2) {
          // Too many frames in flight, encoder is overwhelmed
          // let's drop this frame.
          frame.close();
          continue;
        }

        this.encoder.encode(frame);
        frame.close();

        /**
         * The next frame should be captures after hitting this time
         * 
         * For frequancy `2` frames per second,
         *      The time stamps will be updates as
         *      0s, 0.5s, 1.0s, 1.5s, ....
         *      The encoder will encode one frame as soon as the timestap is less than the frame time stamp.
         *      Then the encoder will wait till the next time stamp    
         */
        nextTimeStamp = nextTimeStamp + 1_000_000 / this.framesPerSec;

        frameCount++;
      }

      // Stop showing web cam video
      video.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());

      // Revert any chages left by _handleBeforeFrameCapture
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

    if (!device) {
      throw new Error("No supporting device found!");
    }

    this.deviceId = device.deviceId;
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
