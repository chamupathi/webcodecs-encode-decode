const showHideElement = (element, show) => {
  if (!element) return;

  element.style.display = show ? "block" : "none";
};

export default showHideElement;
