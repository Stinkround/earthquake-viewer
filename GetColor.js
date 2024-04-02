function magnitudeColor(magnitude) {
  const ratio = magnitude / 10;
  const red = Math.round(255 * ratio);
  const green = Math.round(255 * (1 - ratio));
  return `rgb(${red}, ${green}, 0)`;
}

export { magnitudeColor };
