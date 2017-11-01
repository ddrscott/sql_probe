import colorWheelHue from './colorWheelHue';

describe('colorWheelHue(i:number)', () => {
  it('does stuff', () => {
    expect(colorWheelHue(0)).toBe(0);
    expect(colorWheelHue(1)).toBe(72);
    expect(colorWheelHue(2)).toBe(72 * 2);
    expect(colorWheelHue(3)).toBe(72 * 3);
    expect(colorWheelHue(4)).toBe(72 * 4);

    expect(colorWheelHue(5)).toBe(72 * 0.5);
    expect(colorWheelHue(6)).toBe(72 * 1.5);
    expect(colorWheelHue(7)).toBe(72 * 2.5);
    expect(colorWheelHue(8)).toBe(72 * 3.5);
    expect(colorWheelHue(9)).toBe(72 * 4.5);

    expect(colorWheelHue(10)).toBe(72 * 0.25);
    expect(colorWheelHue(11)).toBe(72 * 1.25);
    expect(colorWheelHue(12)).toBe(72 * 2.25);
    expect(colorWheelHue(13)).toBe(72 * 3.25);
    expect(colorWheelHue(14)).toBe(72 * 4.25);

    expect(colorWheelHue(15)).toBe(72 * 0.125);
    expect(colorWheelHue(16)).toBe(72 * 1.125);
    expect(colorWheelHue(17)).toBe(72 * 2.125);
    expect(colorWheelHue(18)).toBe(72 * 3.125);
    expect(colorWheelHue(19)).toBe(72 * 4.125);
  })
})
