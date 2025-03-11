export function getPopupDimensions() {
  const width = 500;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  return { width, height, left, top };
}

