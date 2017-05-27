const NUM_COLORS = 5;
const OFFSET_PER_COLOR = 360 / NUM_COLORS;

export default i => {
  const rotation = (i / NUM_COLORS) >>> 0;
  const increment = rotation === 0 ? 0 : Math.pow(0.5, rotation);
  return ((i % 5) + increment) * OFFSET_PER_COLOR;
}
