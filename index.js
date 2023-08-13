import { ColorStramVideoEncoder } from "./color-stream-video-encoder.js";
import { DataVideoDecoder } from "./data-video-decoder.js";
import getDeviceWidthAndHeight from "./get-device-width-and-height.js";
import getHighestresolutionDevice from "./get-highest-resolution-device.js";
import initDisplayDimentions from "./init-display-dimentions.js";
import isSupportedBrowser from "./is-supported-browser.js";
import showHideElement from "./show-hide-element.js";

const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const button = document.getElementById("start-button");

const colorStream = [
  0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
];

const suppproted = isSupportedBrowser();
if (suppproted) {
  await initDisplayDimentions(canvas, video);

  showHideElement(document.getElementById("start-text"), true);

  // Add an onclick event handler
  button.onclick = async () => {
    await start();
  };
} else {
  const unsuppotedText = document.getElementById("unsuppoted-text");

  showHideElement(unsuppotedText, true);
  showHideElement(button, false);
}

const start = async () => {
  beforeCapture();
  const capture = new ColorStramVideoEncoder(colorStream, 2);
  const data = await capture.captureFrames();
  afterCapture();

  const display = new DataVideoDecoder();
  await display.displayFrames(data, afterDisplay);
};

const beforeCapture = () => {
  showHideElement(canvas, false);
  showHideElement(button, false);
  showHideElement(video, true);
  showHideElement(document.getElementById("start-text"), false);
  showHideElement(document.getElementById("recording-text"), true);

};

const afterCapture = () => {
  showHideElement(video, false);
  showHideElement(canvas, true);
  showHideElement(document.getElementById("recording-text"), false);
  showHideElement(document.getElementById("preview-text"), true);
};

const afterDisplay = () => {
  showHideElement(button, true);
  showHideElement(canvas, false);
  showHideElement(document.getElementById("preview-text"), false);
  showHideElement(document.getElementById("start-text"), true);
};
