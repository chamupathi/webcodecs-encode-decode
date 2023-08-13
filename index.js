import { ColorStramVideoEncoder } from "./color-stream-video-encoder.js";
import { DataVideoDecoder } from "./data-video-decoder.js";
import showHideElement from "./show-hide-element.js";

const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const button = document.getElementById("start-button");

canvas.style.display = "none";
video.style.display = "none";

// Add an onclick event handler
button.onclick = async () => {
  await start();
};

const start = async () => {
  const colorStream = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

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
};

const afterCapture = () => {
  showHideElement(video, false);
  showHideElement(canvas, true);
};

const afterDisplay = () => {
  showHideElement(button, true);
  showHideElement(canvas, false);
};
