import getDeviceWidthAndHeight from "./get-device-width-and-height.js";
import getHighestresolutionDevice from "./get-highest-resolution-device.js";

const VID_SMALL_FACTOR = 2;

const initDisplayDimentions = async (canvas, video) => {
  const device = await getHighestresolutionDevice();

  const { width: deviceWidth, height: deviceHeight } =
    getDeviceWidthAndHeight();

  const displayWidth = Math.min(deviceWidth, device.width);
  const displayHeight = Math.min(deviceHeight, device.height);

  // Set the width and height of the canvas
  canvas.width = displayWidth;
  canvas.height = displayHeight;

  /*
   * Set the width and height of the video.
   * Video will have the same aspect ratio as the canvas,
   * But will be smaller to alocate more space to the color change
   */
  video.width = displayWidth / VID_SMALL_FACTOR;
  video.height = displayHeight / VID_SMALL_FACTOR;
};

export default initDisplayDimentions;
