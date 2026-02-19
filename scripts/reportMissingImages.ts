import fs from "node:fs";
import path from "node:path";
import { mockCatalog } from "../src/data/mockCatalog";
import {
  getHoseEndAngleImageSrc,
  getHoseEndColorImageSrc,
  getHoseEndStyleImageSrc,
  getHoseTypeImageSrc,
} from "../src/lib/assembly/imageResolver";
import {
  getAllowedEndColorIdsForStyle,
  isAngleAllowedForStyle,
} from "../src/lib/rules/compatibilityMatrix";

type ReportCategory = "hoseType" | "endStyle" | "endColor" | "endAngle";
type MissingReason = "unmapped" | "file_missing";

type MissingImageRecord = {
  category: ReportCategory;
  styleId: string;
  hoseTypeId: string;
  colorId: string;
  angleId: string;
  angleLabel: string;
  expectedSrc: string;
  reason: MissingReason;
};

const REPORTS_DIR = path.join(process.cwd(), "reports");
const JSON_REPORT_PATH = path.join(REPORTS_DIR, "missing-images.json");
const CSV_REPORT_PATH = path.join(REPORTS_DIR, "missing-images.csv");
const PHOTOS_PREFIX = "/assembly-builder-photos/";

const escapeCsv = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
};

const toCsv = (rows: MissingImageRecord[]): string => {
  const headers = [
    "category",
    "styleId",
    "hoseTypeId",
    "colorId",
    "angleId",
    "angleLabel",
    "expectedSrc",
    "reason",
  ];

  const lines = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header as keyof MissingImageRecord];
        return escapeCsv(String(value));
      })
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
};

const fileExistsForSrc = (expectedSrc: string): boolean => {
  if (!expectedSrc.startsWith(PHOTOS_PREFIX)) {
    return false;
  }

  const decodedPath = decodeURI(expectedSrc);
  const relativePath = decodedPath.startsWith("/") ? decodedPath.slice(1) : decodedPath;
  const absolutePath = path.join(process.cwd(), "public", relativePath);
  return fs.existsSync(absolutePath);
};

const missingRows: MissingImageRecord[] = [];

const pushMissingRow = ({
  category,
  styleId = "",
  hoseTypeId = "",
  colorId = "",
  angleId = "",
  angleLabel = "",
  expectedSrc,
  reason,
}: MissingImageRecord): void => {
  missingRows.push({
    category,
    styleId,
    hoseTypeId,
    colorId,
    angleId,
    angleLabel,
    expectedSrc,
    reason,
  });
};

const assessImage = ({
  category,
  styleId = "",
  hoseTypeId = "",
  colorId = "",
  angleId = "",
  angleLabel = "",
  expectedSrc,
}: {
  category: ReportCategory;
  styleId?: string;
  hoseTypeId?: string;
  colorId?: string;
  angleId?: string;
  angleLabel?: string;
  expectedSrc: string | undefined;
}): void => {
  if (!expectedSrc) {
    pushMissingRow({
      category,
      styleId,
      hoseTypeId,
      colorId,
      angleId,
      angleLabel,
      expectedSrc: "",
      reason: "unmapped",
    });
    return;
  }

  if (!fileExistsForSrc(expectedSrc)) {
    pushMissingRow({
      category,
      styleId,
      hoseTypeId,
      colorId,
      angleId,
      angleLabel,
      expectedSrc,
      reason: "file_missing",
    });
  }
};

for (const hoseType of mockCatalog.hoseTypes) {
  assessImage({
    category: "hoseType",
    hoseTypeId: hoseType.id,
    expectedSrc: getHoseTypeImageSrc(hoseType.id),
  });
}

for (const style of mockCatalog.hoseEndStyles) {
  assessImage({
    category: "endStyle",
    styleId: style.id,
    expectedSrc: getHoseEndStyleImageSrc(style.id),
  });
}

const catalogColorIds = new Set(mockCatalog.hoseEndColors.map((color) => color.id));

for (const style of mockCatalog.hoseEndStyles) {
  const colorIds = getAllowedEndColorIdsForStyle(style.id).filter((colorId) =>
    catalogColorIds.has(colorId),
  );

  for (const colorId of colorIds) {
    assessImage({
      category: "endColor",
      styleId: style.id,
      colorId,
      expectedSrc: getHoseEndColorImageSrc(style.id, colorId),
    });

    for (const angle of mockCatalog.hoseEndAngles) {
      if (!isAngleAllowedForStyle(style.id, angle)) {
        continue;
      }

      assessImage({
        category: "endAngle",
        styleId: style.id,
        colorId,
        angleId: angle.id,
        angleLabel: angle.label,
        expectedSrc: getHoseEndAngleImageSrc(style.id, colorId, angle),
      });
    }
  }
}

missingRows.sort((a, b) => {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  }
  if (a.styleId !== b.styleId) {
    return a.styleId.localeCompare(b.styleId);
  }
  if (a.hoseTypeId !== b.hoseTypeId) {
    return a.hoseTypeId.localeCompare(b.hoseTypeId);
  }
  if (a.colorId !== b.colorId) {
    return a.colorId.localeCompare(b.colorId);
  }
  if (a.angleId !== b.angleId) {
    return a.angleId.localeCompare(b.angleId);
  }
  return a.reason.localeCompare(b.reason);
});

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(JSON_REPORT_PATH, `${JSON.stringify(missingRows, null, 2)}\n`, "utf8");
fs.writeFileSync(CSV_REPORT_PATH, `${toCsv(missingRows)}\n`, "utf8");

const countBy = (valueGetter: (row: MissingImageRecord) => string): Array<[string, number]> => {
  const counts = new Map<string, number>();
  for (const row of missingRows) {
    const key = valueGetter(row);
    if (!key) {
      continue;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

const categoryTotals = countBy((row) => row.category);
const styleTotals = countBy((row) => row.styleId);
const colorTotals = countBy((row) => row.colorId);

console.log(`Missing image report generated.`);
console.log(`JSON: ${JSON_REPORT_PATH}`);
console.log(`CSV: ${CSV_REPORT_PATH}`);
console.log(`Total missing/unmapped: ${missingRows.length}`);

console.log("\nBy category:");
for (const [category, total] of categoryTotals) {
  console.log(`- ${category}: ${total}`);
}

console.log("\nTop styles:");
for (const [styleId, total] of styleTotals.slice(0, 10)) {
  console.log(`- ${styleId}: ${total}`);
}

console.log("\nTop colors:");
for (const [colorId, total] of colorTotals) {
  console.log(`- ${colorId}: ${total}`);
}
