const isSupportedBrowser = () => {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
};

export default isSupportedBrowser;
