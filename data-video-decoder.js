import getCodecConfigImpl from "./get-codec-config.js";

export class DataVideoDecoder {
  constructor() {
    this.config = getCodecConfigImpl();

    this.ctx = null;
    this.pendingFrames = [];
    this.underflow = false;
  }

  /**
   * Display captured frames in a canves
   *
   * @param {string} canvasElementId - element Id of the canvas element [optional]
   */
  displayFrames = async (data, callback, canvasElementId) => {
    if (!Array.isArray(data)) {
      return;
    }

    if (callback) {
      this.callback = callback;
    }

    this.data = data;

    this.baseTime = 0;
    this.underflow = true;

    this._initCanvas(canvasElementId);

    this.pendingFrames = [];
    this.underflow = true;
    this.baseTime = 0;

    const supported = await this.isDecodingConfigSupported();
    if (!supported) return;

    this._initDecoder();

    for (let i = 0; i < data.length; i++) {
      const chunk = data[i];
      this.decoder.decode(new EncodedVideoChunk(chunk));
    }
    await this.decoder.flush();
  };

  /**
   * Checks whether the provided config is supported
   * for decoding by the browser
   *
   * @returns {boolean} is the config supported for decoding by the browser
   */
  isDecodingConfigSupported = async () => {
    const { supported } = await VideoDecoder.isConfigSupported(this.config);
    return supported;
  };

  _initCanvas = (canvasElementId) => {
    const canvas = document.getElementById(canvasElementId || "canvas");
    this.ctx = canvas.getContext("2d");
  };

  _initDecoder = () => {
    if (this.decoder) return;

    this.decodingInit = {
      output: this._handleFrame,
      error: this._handleError,
    };

    this.decoder = new VideoDecoder(this.decodingInit);
    this.decoder.configure(this.config);
  };

  _handleFrame = (frame) => {
    this.pendingFrames.push(frame);

    if (this.underflow) setTimeout(this._renderFrame, 0);
  };

  _renderFrame = async () => {
    this.underflow = this.pendingFrames.length == 0;

    if (this.underflow) return;

    const frame = this.pendingFrames.shift();

    // Based on the frame's timestamp calculate how much of real time waiting
    // is needed before showing the next frame.
    const timeUntilNextFrame = this._calculateTimeUntilNextFrame(
      frame.timestamp
    );
    await new Promise((r) => {
      setTimeout(r, timeUntilNextFrame);
    });
    this.ctx.drawImage(frame, 0, 0);
    frame.close();

    // Immediately schedule rendering of the next frame
    if (this.pendingFrames.length) {
      setTimeout(this._renderFrame, 0);
    } else {
      this.callback?.();
    }
  };

  _calculateTimeUntilNextFrame = (timestamp) => {
    if (this.baseTime == 0) this.baseTime = performance.now();
    let mediaTime = performance.now() - this.baseTime;
    return Math.max(0, timestamp / 1000 - mediaTime);
  };

  _handleError = (e) => console.error(e.message);
}
