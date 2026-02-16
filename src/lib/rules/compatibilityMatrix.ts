export type EndSeriesKey =
  | "1000"
  | "6000"
  | "1490"
  | "8000"
  | "7000_7200"
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

const BRAIDED_ALLOWED_END_SERIES: EndSeriesKey[] = [
  "1000",
  "6000",
  "1490",
  "8000",
  "7000_7200",
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

export const END_SERIES_BY_STYLE_ID: Record<string, EndSeriesKey> = {
  "1000": "1000",
  "6000": "6000",
  "1490": "1490",
  "8000": "8000",
  "7000": "7000_7200",
  "7002": "7000_7200",
  "7200": "7000_7200",
  "2000": "2000",
  "1200": "1200",
};

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
