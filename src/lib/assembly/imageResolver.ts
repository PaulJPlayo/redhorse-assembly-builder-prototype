export type AngleImageOption = {
  id: string;
  label?: string;
};

const HOSE_TYPE_IMAGE_FILENAMES: Record<string, string> = {
  "hose-200": "200Series_hoses (1).jpg",
  "hose-205": "205.jpg",
  "hose-230": "230Series_Hoses.jpg",
  "hose-235": "235 (1).jpg",
  "hose-302": "302 Series catalog.jpg",
  "hose-303": "303 Series Catalog (1).jpg",
  "hose-304": "304.jpg",
  "hose-305": "305.jpg",
  "hose-401": "401 Series Catalog MASTER.jpg",
  "hose-402": "402 Series Catalog MASTER.jpg",
};

const HOSE_END_STYLE_IMAGE_PATHS: Record<string, string> = {
  "1000": "hose-end-style/1000.jpg",
  "1200": "hose-end-style/1200.jpg",
  "1490": "hose-end-style/1490.jpg",
  "2000": "hose-end-style/2000.jpg",
  "7000": "hose-end-style/7000.jpg",
  "7002": "hose-end-style/7002.jpg",
  "6000": "hose-end-angles-colors/6000-series/6030-1.jpg",
};

const HOSE_END_COLOR_IMAGE_PATHS: Record<string, Partial<Record<string, string>>> = {
  "1000": {
    black: "hose-end-angles-colors/1000-series/1030-2.jpg",
    "blue-red": "hose-end-angles-colors/1000-series/1030-1.jpg",
    clear: "hose-end-angles-colors/1000-series/1030-5.jpg",
  },
  "6000": {
    black: "hose-end-angles-colors/6000-series/6030-2.jpg",
    "blue-red": "hose-end-angles-colors/6000-series/6030-1.jpg",
    clear: "hose-end-angles-colors/6000-series/6030-5.jpg",
  },
  "1490": {
    black: "hose-end-angles-colors/1490-series/1490-2 v1 (1).jpg",
    "blue-red": "hose-end-angles-colors/1490-series/1490-1 v1.jpg",
    clear: "hose-end-angles-colors/1490-series/1490-5 v1.jpg",
  },
  "1200": {
    black: "hose-end-angles-colors/1200-series/1200-2.jpg",
    "blue-red": "hose-end-angles-colors/1200-series/1200-1.jpg",
    clear: "hose-end-angles-colors/1200-series/1200-5.jpg",
  },
  "2000": {
    black: "hose-end-angles-colors/2000-series/2045-2.jpg",
    blue: "hose-end-angles-colors/2000-series/2045-1.jpg",
    clear: "hose-end-angles-colors/2000-series/2045-5.jpg",
  },
  "7000": {
    black: "hose-end-angles-colors/7000-series/7030-2.jpg",
    blue: "hose-end-angles-colors/7000-series/7030-1.jpg",
    red: "hose-end-angles-colors/7000-series/7030-3.jpg",
    clear: "hose-end-angles-colors/7000-series/7030-5.jpg",
  },
  "7002": {
    black: "hose-end-angles-colors/7002-series/7032-10-2-1-white (1).png",
  },
};

const EXTRA_IMAGE_PATHS: Record<string, string> = {
  "support-coil": "Extras/Support Coil.jpg",
  "heat-shield": "Extras/Heat shield.jpg",
};

const COLOR_SUFFIX_BY_COLOR_ID: Record<string, string> = {
  black: "2",
  "blue-red": "1",
  blue: "1",
  red: "3",
  clear: "5",
};

const ALLOWED_COLOR_IDS_BY_ANGLE_STYLE: Record<string, string[]> = {
  "1000": ["black", "blue-red", "clear"],
  "6000": ["black", "blue-red", "clear"],
  "1490": ["black", "blue-red", "clear"],
  "1200": ["black", "blue-red", "clear"],
  "2000": ["black", "blue", "clear"],
  "7000": ["black", "blue", "red", "clear"],
  "7002": ["black"],
};

const ANGLE_CODE_BY_STYLE_AND_DEGREES: Record<string, Partial<Record<number, string>>> = {
  "1000": {
    0: "1000",
    30: "1030",
    45: "1045",
    60: "1060",
    90: "1090",
    120: "1120",
    150: "1150",
    180: "1180",
  },
  "6000": {
    30: "6030",
    45: "6045",
    60: "6060",
    90: "6090",
    120: "6120",
    150: "6150",
    180: "6180",
  },
  "1490": {
    90: "1490",
  },
  "1200": {
    0: "1200",
    30: "1230",
    45: "1245",
    60: "1260",
    90: "1290",
    120: "1220",
    150: "1250",
    180: "1280",
  },
  "2000": {
    0: "2000",
    45: "2045",
    90: "2090",
    120: "2120",
    150: "2150",
    180: "2180",
  },
  "7000": {
    30: "7030",
    45: "7045",
    60: "7060",
    90: "7090",
    120: "7120",
    150: "7150",
    180: "7180",
  },
  "7002": {
    0: "7002",
    30: "7032",
    45: "7042",
    60: "7062",
    90: "7092",
    120: "7122",
    150: "7152",
    180: "7182",
  },
};

const ANGLE_FILENAME_OVERRIDES: Record<string, string> = {
  "1000:1000:black": "1000-2 (1).jpg",
  "1000:1180:black": "1180-2 (1).jpg",
  "1490:1490:black": "1490-2 v1 (1).jpg",
  "1490:1490:blue-red": "1490-1 v1.jpg",
  "1490:1490:clear": "1490-5 v1.jpg",
  "1200:1220:black": "1220-2 (1).jpg",
  "1200:1230:black": "1230-2 (1).jpg",
  "2000:2000:black": "2000-2 (1).jpg",
  "7000:7060:black": "7060-2 (1).jpg",
  "7000:7120:clear": "7120-5 (1).jpg",
};

const KNOWN_MISSING_ANGLE_IMAGE_KEYS = new Set(["1200:1230:blue-red"]);

const ANGLE_FILENAME_BY_7002_DEGREES: Record<number, string> = {
  0: "7002-10-2-1-white (1).png",
  30: "7032-10-2-1-white (1).png",
  45: "7042-10-2-1-white (3).png",
  60: "7062-10-2-1-white (1).png",
  90: "7092-10-2-1-white (1).png",
  120: "7122-10-2-1-white (1).png",
  150: "7152-10-2-1-white (2).png",
  180: "7182-10-2-1-White (1).png",
};

const parseAngleDegrees = (angleOption: AngleImageOption): number | undefined => {
  const label = angleOption.label ?? "";
  if (/straight/i.test(label)) {
    return 0;
  }
  const fromLabel = label.match(/(\d{1,3})/);
  if (fromLabel) {
    return Number(fromLabel[1]);
  }
  const fromId = angleOption.id.match(/(\d{1,3})/);
  if (fromId) {
    return Number(fromId[1]);
  }
  return undefined;
};

export const getHoseTypeImageSrc = (hoseTypeId: string): string | undefined => {
  const filename = HOSE_TYPE_IMAGE_FILENAMES[hoseTypeId];
  if (!filename) {
    return undefined;
  }
  return `/assembly-builder-photos/hose-type/${encodeURI(filename)}`;
};

export const getHoseEndStyleImageSrc = (styleId: string): string | undefined => {
  const relativePath = HOSE_END_STYLE_IMAGE_PATHS[styleId];
  if (!relativePath) {
    return undefined;
  }
  return `/assembly-builder-photos/${encodeURI(relativePath)}`;
};

export const getHoseEndColorImageSrc = (
  styleId: string | undefined,
  colorId: string,
): string | undefined => {
  if (!styleId) {
    return undefined;
  }
  const relativePath = HOSE_END_COLOR_IMAGE_PATHS[styleId]?.[colorId];
  if (!relativePath) {
    return undefined;
  }
  return `/assembly-builder-photos/${encodeURI(relativePath)}`;
};

export const getExtraImageSrc = (extraId: string): string | undefined => {
  const relativePath = EXTRA_IMAGE_PATHS[extraId];
  if (!relativePath) {
    return undefined;
  }
  return `/assembly-builder-photos/${encodeURI(relativePath)}`;
};

export const getHoseEndAngleImageSrc = (
  styleId: string | undefined,
  colorId: string | undefined,
  angleOption: AngleImageOption,
): string | undefined => {
  if (!styleId || !colorId) {
    return undefined;
  }

  const styleAllowedColors = ALLOWED_COLOR_IDS_BY_ANGLE_STYLE[styleId];
  if (!styleAllowedColors || !styleAllowedColors.includes(colorId)) {
    return undefined;
  }

  const degrees = parseAngleDegrees(angleOption);
  if (degrees === undefined) {
    return undefined;
  }

  if (styleId === "7002") {
    const fileName = ANGLE_FILENAME_BY_7002_DEGREES[degrees];
    if (!fileName) {
      return undefined;
    }
    const relativePath = `hose-end-angles-colors/7002-series/${fileName}`;
    return `/assembly-builder-photos/${encodeURI(relativePath)}`;
  }

  const angleCode = ANGLE_CODE_BY_STYLE_AND_DEGREES[styleId]?.[degrees];
  if (!angleCode) {
    return undefined;
  }

  const missingKey = `${styleId}:${angleCode}:${colorId}`;
  if (KNOWN_MISSING_ANGLE_IMAGE_KEYS.has(missingKey)) {
    return undefined;
  }

  const colorSuffix = COLOR_SUFFIX_BY_COLOR_ID[colorId];
  if (!colorSuffix) {
    return undefined;
  }

  const overrideKey = `${styleId}:${angleCode}:${colorId}`;
  const fileName = ANGLE_FILENAME_OVERRIDES[overrideKey] ?? `${angleCode}-${colorSuffix}.jpg`;
  const relativePath = `hose-end-angles-colors/${styleId}-series/${fileName}`;
  return `/assembly-builder-photos/${encodeURI(relativePath)}`;
};
