const NUM_COLORS = 5;
const OFFSET_PER_COLOR = 360 / NUM_COLORS;

export default i => {
  const divider = ((i / NUM_COLORS) >>> 0) * 2;
  const increment = divider === 0 ? 0 : OFFSET_PER_COLOR / divider;
  return ((i % NUM_COLORS) * OFFSET_PER_COLOR) + (OFFSET_PER_COLOR * increment);
}
