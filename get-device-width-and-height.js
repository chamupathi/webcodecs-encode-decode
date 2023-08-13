const getDeviceWidthAndHeight = () => {
  const deviceWidth = window.innerWidth || document.documentElement.clientWidth;
  const deviceHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return { width: deviceWidth, height: deviceHeight };
};

export default getDeviceWidthAndHeight;
