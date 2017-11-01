const NUM_COLORS = 12;
const OFFSET_PER_COLOR = 360 / NUM_COLORS;

export default i => {
  const rotation = (i / NUM_COLORS) >>> 0;
  const increment = (rotation === 0 ? 0 : Math.pow(0.5, rotation));
  const hue = (i % NUM_COLORS + increment) * OFFSET_PER_COLOR;
  const sat = 100 - rotation * 15;
  return `hsl(${hue}, ${sat}%, 50%)`;
}
