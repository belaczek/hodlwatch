import ColorHash from "color-hash";

/**
 * Generate color hash code
 */
export const stringToColour = (value) => {
  const colorHash = new ColorHash({
    saturation: 0.6,
    lightness: 0.5,
  });
  return colorHash.hex(value);
};
