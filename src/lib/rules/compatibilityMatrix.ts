export type EndSeriesKey =
  | "1000"
  | "6000"
  | "1490"
  | "8000"
  | "7000_7002"
  | "2000"
  | "1200";

export const HOSE_TYPE_ORDER = [
  "hose-200",
  "hose-205",
  "hose-230",
  "hose-235",
  "hose-302",
  "hose-303",
  "hose-304",
  "hose-305",
  "hose-306",
  "hose-401",
  "hose-402",
];

export const HOSE_SIZE_ORDER = ["04", "06", "08", "10", "12", "16", "20"];

const BRAIDED_ALLOWED_END_SERIES: EndSeriesKey[] = [
  "1000",
  "6000",
  "1490",
  "8000",
  "7000_7002",
];

const PTFE_ALLOWED_END_SERIES: EndSeriesKey[] = ["1200"];
const PUSH_LOCK_ALLOWED_END_SERIES: EndSeriesKey[] = ["2000"];

export const ALLOWED_END_SERIES_BY_HOSE_TYPE: Record<string, EndSeriesKey[]> = {
  "hose-200": BRAIDED_ALLOWED_END_SERIES,
  "hose-205": BRAIDED_ALLOWED_END_SERIES,
  "hose-230": BRAIDED_ALLOWED_END_SERIES,
  "hose-235": BRAIDED_ALLOWED_END_SERIES,
  "hose-302": PTFE_ALLOWED_END_SERIES,
  "hose-303": PTFE_ALLOWED_END_SERIES,
  "hose-304": PTFE_ALLOWED_END_SERIES,
  "hose-305": PTFE_ALLOWED_END_SERIES,
  "hose-306": PTFE_ALLOWED_END_SERIES,
  "hose-401": PUSH_LOCK_ALLOWED_END_SERIES,
  "hose-402": PUSH_LOCK_ALLOWED_END_SERIES,
};

export const ALLOWED_HOSE_SIZES_BY_HOSE_TYPE: Record<string, string[]> = {
  "hose-200": ["04", "06", "08", "10", "12", "16", "20"],
  "hose-205": ["04", "06", "08", "10", "12"],
  "hose-230": ["04", "06", "08", "10", "12", "16", "20"],
  "hose-235": ["04", "06", "08", "10", "12", "16"],
  "hose-302": ["04", "06", "08", "10"],
  "hose-303": ["04", "06", "08", "10"],
  "hose-304": ["04", "06", "08", "10", "12"],
  "hose-305": ["04", "06", "08", "10", "12"],
  "hose-306": ["04", "06", "08", "10"],
  "hose-401": ["04", "06", "08", "10", "12"],
  "hose-402": ["04", "06", "08", "10", "12"],
};

export const ALLOWED_HOSE_SIZES_BY_END_SERIES: Record<EndSeriesKey, string[]> = {
  "1000": ["04", "06", "08", "10", "12", "16", "20"],
  "6000": ["04", "06", "08", "10", "12", "16"],
  "1490": ["06", "08", "10"],
  // TODO: Confirm 8000 ranges from updated sheet; current assumption is -06 / -08 only.
  "8000": ["06", "08"],
  "7000_7002": ["06", "08", "10", "12", "16"],
  "2000": ["04", "06", "08", "10", "12", "16"],
  "1200": ["04", "06", "08", "10", "12"],
};

export const ALLOWED_END_COLOR_IDS_BY_END_SERIES: Record<EndSeriesKey, string[]> = {
  "1000": ["black", "blue-red", "clear"],
  "6000": ["black", "blue-red", "clear"],
  "1490": ["black", "blue-red", "clear"],
  // TODO: Confirm 8000 color set from updated sheet; current assumption matches 1000/6000/1490.
  "8000": ["black", "blue-red", "clear"],
  "7000_7002": ["black", "blue", "red", "clear"],
  "2000": ["black", "blue", "clear"],
  "1200": ["black", "blue-red", "clear"],
};

export const ALLOWED_END_ANGLE_DEGREES_BY_END_SERIES: Record<EndSeriesKey, number[]> = {
  "1000": [0, 30, 45, 90, 120, 150, 180],
  "6000": [30, 45, 90, 120, 150, 180],
  "1490": [90],
  "8000": [0, 45, 90, 180],
  "7000_7002": [0, 30, 45, 60, 90, 120, 150, 180],
  "2000": [0, 45, 90, 120, 150, 180],
  "1200": [0, 30, 45, 60, 90, 120, 150, 180],
};

export const END_SERIES_BY_STYLE_ID: Record<string, EndSeriesKey> = {
  "1000": "1000",
  "6000": "6000",
  "1490": "1490",
  "8000": "8000",
  "7000": "7000_7002",
  "7002": "7000_7002",
  "2000": "2000",
  "1200": "1200",
};

const ALL_END_COLOR_IDS = ["black", "blue", "red", "clear", "blue-red"];

export const isEndStyleAllowedForHoseType = (hoseTypeId: string | undefined, styleId: string): boolean => {
  if (!hoseTypeId) {
    return true;
  }
  const allowedEndSeries = ALLOWED_END_SERIES_BY_HOSE_TYPE[hoseTypeId];
  if (!allowedEndSeries) {
    return true;
  }
  const endSeries = END_SERIES_BY_STYLE_ID[styleId];
  if (!endSeries) {
    return false;
  }
  return allowedEndSeries.includes(endSeries);
};

export const isHoseSizeAllowedForHoseType = (hoseTypeId: string | undefined, sizeId: string): boolean => {
  if (!hoseTypeId) {
    return true;
  }
  const allowedSizes = ALLOWED_HOSE_SIZES_BY_HOSE_TYPE[hoseTypeId];
  if (!allowedSizes) {
    return true;
  }
  return allowedSizes.includes(sizeId);
};

export const isEndStyleAllowedForHoseSize = (hoseSizeId: string | undefined, styleId: string): boolean => {
  if (!hoseSizeId) {
    return true;
  }
  const endSeries = END_SERIES_BY_STYLE_ID[styleId];
  if (!endSeries) {
    return false;
  }
  return ALLOWED_HOSE_SIZES_BY_END_SERIES[endSeries].includes(hoseSizeId);
};

export const getAllowedEndColorIdsForStyle = (styleId: string | undefined): string[] => {
  if (!styleId) {
    return ALL_END_COLOR_IDS;
  }
  if (styleId === "7002") {
    return ["black"];
  }
  const endSeries = END_SERIES_BY_STYLE_ID[styleId];
  if (!endSeries) {
    return ALL_END_COLOR_IDS;
  }
  return ALLOWED_END_COLOR_IDS_BY_END_SERIES[endSeries];
};

const parseAngleFromId = (id: string): number | undefined => {
  if (id === "str") {
    return 0;
  }
  const parsed = Number(id);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return undefined;
};

export const getAngleDegrees = (angleOption: {
  id: string;
  label?: string;
  degrees?: number;
}): number | undefined => {
  const fromId = parseAngleFromId(angleOption.id);
  if (typeof fromId === "number") {
    return fromId;
  }

  const label = angleOption.label?.toLowerCase() ?? "";
  if (label.includes("straight")) {
    return 0;
  }
  const match = label.match(/(\d{1,3})/);
  if (match) {
    return Number(match[1]);
  }
  if (typeof angleOption.degrees === "number" && Number.isFinite(angleOption.degrees)) {
    return angleOption.degrees;
  }
  return undefined;
};

export const isAngleAllowedForStyle = (
  styleId: string | undefined,
  angleOption: {
    id: string;
    label?: string;
    degrees?: number;
  },
): boolean => {
  if (!styleId) {
    return true;
  }
  const endSeries = END_SERIES_BY_STYLE_ID[styleId];
  if (!endSeries) {
    return true;
  }
  const degrees = getAngleDegrees(angleOption);
  if (degrees === undefined) {
    return false;
  }
  return ALLOWED_END_ANGLE_DEGREES_BY_END_SERIES[endSeries].includes(degrees);
};

export const sortByHoseTypeOrder = <T extends { id: string }>(items: T[]): T[] => {
  const orderMap = new Map(HOSE_TYPE_ORDER.map((id, index) => [id, index]));
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aOrder = orderMap.get(a.item.id);
      const bOrder = orderMap.get(b.item.id);
      if (aOrder === undefined && bOrder === undefined) {
        return a.index - b.index;
      }
      if (aOrder === undefined) {
        return 1;
      }
      if (bOrder === undefined) {
        return -1;
      }
      return aOrder - bOrder;
    })
    .map(({ item }) => item);
};

export const sortByHoseSizeOrder = <T extends { id: string }>(items: T[]): T[] => {
  const orderMap = new Map(HOSE_SIZE_ORDER.map((id, index) => [id, index]));
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aOrder = orderMap.get(a.item.id);
      const bOrder = orderMap.get(b.item.id);
      if (aOrder === undefined && bOrder === undefined) {
        return a.index - b.index;
      }
      if (aOrder === undefined) {
        return 1;
      }
      if (bOrder === undefined) {
        return -1;
      }
      return aOrder - bOrder;
    })
    .map(({ item }) => item);
};
