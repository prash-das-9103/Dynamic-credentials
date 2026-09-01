/**
 * Bain chart color palette — the ONLY colors permitted in data visualizations
 * (charts, graphs, sparklines, stacked bars, etc.) across this app.
 *
 * Do not introduce hex values outside this palette in any chart. When a new
 * chart needs more series than CATEGORICAL_SEQUENCE provides, cycle back to
 * the start of the sequence rather than inventing a new color.
 */

export const BAIN_COLORS = {
  red: "#CC0000",
  redDark: "#990000",

  black: "#000000",
  white: "#FFFFFF",

  gray100: "#D6D6D6",
  gray200: "#B4B4B4",
  gray300: "#858585",
  gray400: "#5C5C5C",
  gray500: "#333333",

  blue100: "#DCE5EA",
  blue200: "#A3BCD3",
  blue300: "#7891AA",
  blue400: "#46647B",
  blue500: "#2D475A",

  magenta100: "#EED6E5",
  magenta200: "#D9ABC6",
  magenta300: "#BA749F",
  magenta400: "#973B74",
  magenta500: "#640A40",

  gold100: "#FAEEC3",
  gold200: "#F2DE8A",
  gold300: "#E9CD49",
  gold400: "#C6AA3D",
  gold500: "#AB8933",

  green100: "#DCE2D6",
  green200: "#BBCABA",
  green300: "#83AC9A",
  green400: "#507867",
  green500: "#104C3E",
} as const;

/**
 * Ordered sequence for categorical/multi-series charts (bar groups, pies,
 * stacked segments, legends). One representative hue per family, in the
 * order they should be assigned to series 1, 2, 3, ...
 */
export const CATEGORICAL_SEQUENCE: string[] = [
  BAIN_COLORS.red,
  BAIN_COLORS.blue500,
  BAIN_COLORS.magenta400,
  BAIN_COLORS.gold500,
  BAIN_COLORS.green500,
  BAIN_COLORS.blue300,
  BAIN_COLORS.magenta300,
  BAIN_COLORS.gold300,
  BAIN_COLORS.green300,
  BAIN_COLORS.gray400,
];

/** Single-hue tonal ramps, lightest to darkest, for sequential/ordinal data. */
export const SEQUENTIAL_RAMPS = {
  gray: [BAIN_COLORS.gray100, BAIN_COLORS.gray200, BAIN_COLORS.gray300, BAIN_COLORS.gray400, BAIN_COLORS.gray500],
  blue: [BAIN_COLORS.blue100, BAIN_COLORS.blue200, BAIN_COLORS.blue300, BAIN_COLORS.blue400, BAIN_COLORS.blue500],
  magenta: [
    BAIN_COLORS.magenta100,
    BAIN_COLORS.magenta200,
    BAIN_COLORS.magenta300,
    BAIN_COLORS.magenta400,
    BAIN_COLORS.magenta500,
  ],
  gold: [BAIN_COLORS.gold100, BAIN_COLORS.gold200, BAIN_COLORS.gold300, BAIN_COLORS.gold400, BAIN_COLORS.gold500],
  green: [
    BAIN_COLORS.green100,
    BAIN_COLORS.green200,
    BAIN_COLORS.green300,
    BAIN_COLORS.green400,
    BAIN_COLORS.green500,
  ],
} as const;

/** Highlighted vs. de-emphasized state colors used for click-to-filter bar charts. */
export const CHART_STATE_COLORS = {
  active: BAIN_COLORS.green500,
  inactive: BAIN_COLORS.green300,
  inactiveOpacity: 1,
} as const;

/** Returns a color from CATEGORICAL_SEQUENCE, cycling if index exceeds its length. */
export function getCategoricalColor(index: number): string {
  return CATEGORICAL_SEQUENCE[index % CATEGORICAL_SEQUENCE.length];
}
