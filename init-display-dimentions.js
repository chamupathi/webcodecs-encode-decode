import getDeviceWidthAndHeight from "./get-device-width-and-height.js";
import getHighestresolutionDevice from "./get-highest-resolution-device.js";

const initDisplayDimentions = async (canvas, video) => {
  const device = await getHighestresolutionDevice();

  const { width: deviceWidth, height: deviceHeight } =
    getDeviceWidthAndHeight();

  const displayWidth = Math.min(deviceWidth, device.width);
  const displayHeight = Math.min(deviceHeight, device.height);

  // Set the width and height of the canvas
  canvas.width = displayWidth;
  canvas.height = displayHeight;

  video.width = displayWidth / 2;
  video.height = displayHeight / 2;
};

export default initDisplayDimentions;
