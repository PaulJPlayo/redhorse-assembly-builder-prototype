import type {
  Catalog,
  CatalogOption,
  HoseColorOption,
  HoseEndStyleOption,
  HoseEndColorOption,
  HoseEndAngleOption,
} from "@/types/catalog";
import type { AssemblySelection, SummaryRow } from "@/types/assembly";
import {
  getAllowedEndColorIdsForStyle,
  isAngleAllowedForStyle,
  isEndStyleAllowedForHoseType,
  isEndStyleAllowedForHoseSize,
  isHoseSizeAllowedForHoseType,
  sortByHoseSizeOrder,
  sortByHoseTypeOrder,
} from "@/lib/rules/compatibilityMatrix";

export type OptionWithAvailability<T> = T & { disabled?: boolean };

export interface FilteredCatalog extends Catalog {
  hoseColors: OptionWithAvailability<HoseColorOption>[];
  hoseEndStyles: OptionWithAvailability<HoseEndStyleOption>[];
  hoseEndColors: OptionWithAvailability<HoseEndColorOption>[];
  hoseEndAngles: OptionWithAvailability<HoseEndAngleOption>[];
}

const BRAIDED_HOSE_TYPE_IDS = new Set(["hose-200", "hose-205", "hose-230", "hose-235"]);

const findById = <T extends CatalogOption>(items: T[], id?: string): T | undefined => {
  if (!id) {
    return undefined;
  }
  return items.find((item) => item.id === id);
};

export const filterCatalog = (catalog: Catalog, selections: AssemblySelection): FilteredCatalog => {
  const selectedHoseType = findById(catalog.hoseTypes, selections.hoseTypeId);
  const hoseTypes = sortByHoseTypeOrder(
    catalog.hoseTypes.filter((hoseType) => hoseType.id !== "hose-306"),
  );
  const hoseSizes = sortByHoseSizeOrder(
    catalog.hoseSizes.filter((size) => isHoseSizeAllowedForHoseType(selections.hoseTypeId, size.id)),
  );
  const isBraidedHoseType = selections.hoseTypeId
    ? BRAIDED_HOSE_TYPE_IDS.has(selections.hoseTypeId)
    : false;
  const filteredExtras = !selections.hoseTypeId
    ? catalog.extras
    : catalog.extras.filter((extra) => extra.id !== "support-coil" || isBraidedHoseType);

  const hoseColors = catalog.hoseColors.map((color) => {
    const isCompatible = selectedHoseType
      ? selectedHoseType.compatibleColors.includes(color.id)
      : true;
    return { ...color, disabled: !isCompatible };
  });

  const hoseEndStylesByHoseType = catalog.hoseEndStyles.filter((style) =>
    isEndStyleAllowedForHoseType(selections.hoseTypeId, style.id),
  );
  const hoseEndStylesBySize = selections.hoseSizeId
    ? hoseEndStylesByHoseType.filter((style) =>
        isEndStyleAllowedForHoseSize(selections.hoseSizeId, style.id),
      )
    : hoseEndStylesByHoseType;
  // Keep the previous hose-series-only list if size filtering returns no results.
  const hoseEndStyles =
    hoseEndStylesBySize.length > 0 ? hoseEndStylesBySize : hoseEndStylesByHoseType;

  const allowedColorIds = new Set(getAllowedEndColorIdsForStyle(selections.hoseEndStyleId));
  const hoseEndColors = catalog.hoseEndColors.filter((color) => allowedColorIds.has(color.id));
  const hoseEndAngles = catalog.hoseEndAngles.filter((angle) =>
    isAngleAllowedForStyle(selections.hoseEndStyleId, angle),
  );

  return {
    ...catalog,
    hoseTypes,
    extras: filteredExtras,
    hoseColors,
    hoseSizes,
    hoseEndStyles: hoseEndStyles.map((style) => ({ ...style })),
    hoseEndColors,
    hoseEndAngles: hoseEndAngles.map((angle) => ({ ...angle })),
  };
};

export const buildHoseSku = (catalog: Catalog, selections: AssemblySelection): string | null => {
  const hoseType = findById(catalog.hoseTypes, selections.hoseTypeId);
  const hoseColor = findById(catalog.hoseColors, selections.hoseColorId);
  const hoseSize = findById(catalog.hoseSizes, selections.hoseSizeId);
  if (!hoseType || !hoseColor || !hoseSize) {
    return null;
  }
  return `${hoseType.code}-${hoseSize.code}-${hoseColor.code}`;
};

export const buildHoseEndSku = (
  catalog: Catalog,
  selections: AssemblySelection,
  side: "A" | "B",
): string | null => {
  const style = findById(catalog.hoseEndStyles, selections.hoseEndStyleId);
  const color = findById(catalog.hoseEndColors, selections.hoseEndColorId);
  const size = findById(catalog.hoseSizes, selections.hoseSizeId);
  const angleId = side === "A" ? selections.hoseEndAngleAId : selections.hoseEndAngleBId;
  const angle = findById(catalog.hoseEndAngles, angleId);
  if (!style || !color || !size || !angle) {
    return null;
  }
  return `${style.code}-${angle.code}-${size.code}-${color.code}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

export const calculateTotal = (catalog: Catalog, selections: AssemblySelection): number => {
  let total = 0;
  const hoseType = findById(catalog.hoseTypes, selections.hoseTypeId);
  const hoseColor = findById(catalog.hoseColors, selections.hoseColorId);
  const hoseSize = findById(catalog.hoseSizes, selections.hoseSizeId);
  const endStyle = findById(catalog.hoseEndStyles, selections.hoseEndStyleId);
  const endColor = findById(catalog.hoseEndColors, selections.hoseEndColorId);
  const angleA = findById(catalog.hoseEndAngles, selections.hoseEndAngleAId);
  const angleB = findById(catalog.hoseEndAngles, selections.hoseEndAngleBId);

  total += hoseType?.price ?? 0;
  total += hoseColor?.price ?? 0;
  total += hoseSize?.price ?? 0;

  const endStylePrice = endStyle?.price ?? 0;
  const endColorPrice = endColor?.price ?? 0;
  total += endStylePrice * 2 + endColorPrice * 2;
  total += (angleA?.price ?? 0) + (angleB?.price ?? 0);

  if (selections.lengthInches) {
    total += selections.lengthInches * catalog.pricing.hosePerInch;
  }

  selections.extras.forEach((extraId) => {
    const extra = findById(catalog.extras, extraId);
    total += extra?.price ?? 0;
  });

  return total;
};

export const buildSummaryRows = (
  catalog: Catalog,
  selections: AssemblySelection,
): SummaryRow[] => {
  const hoseType = findById(catalog.hoseTypes, selections.hoseTypeId);
  const hoseColor = findById(catalog.hoseColors, selections.hoseColorId);
  const hoseSize = findById(catalog.hoseSizes, selections.hoseSizeId);
  const endStyle = findById(catalog.hoseEndStyles, selections.hoseEndStyleId);
  const endColor = findById(catalog.hoseEndColors, selections.hoseEndColorId);
  const angleA = findById(catalog.hoseEndAngles, selections.hoseEndAngleAId);
  const angleB = findById(catalog.hoseEndAngles, selections.hoseEndAngleBId);

  const hoseLabel = hoseType
    ? `${hoseType.label}${hoseColor ? ` - ${hoseColor.label}` : ""}`
    : "—";
  const extrasLabel = selections.extras.length
    ? selections.extras
        .map((extraId) => findById(catalog.extras, extraId)?.label)
        .filter(Boolean)
        .join(", ")
    : "No";

  const total = calculateTotal(catalog, selections);

  return [
    {
      label: "HOSE TYPE",
      value: hoseLabel,
      sku: buildHoseSku(catalog, selections) ?? "",
    },
    {
      label: "SIZE",
      value: hoseSize?.label ?? "—",
    },
    {
      label: "HOSE END TYPE",
      value: endStyle?.label ?? "—",
    },
    {
      label: "HOSE END COLOR",
      value: endColor?.label ?? "—",
    },
    {
      label: "HOSE END ANGLE A",
      value: angleA?.label ?? "—",
      sku: buildHoseEndSku(catalog, selections, "A") ?? "",
    },
    {
      label: "HOSE END ANGLE B",
      value: angleB?.label ?? "—",
      sku: buildHoseEndSku(catalog, selections, "B") ?? "",
    },
    {
      label: "ASSEMBLY LENGTH",
      value: selections.lengthInches ? `${selections.lengthInches}\"` : "—",
    },
    {
      label: "EXTRAS",
      value: extrasLabel,
    },
    {
      label: "TOTAL COST",
      value: formatCurrency(total),
      emphasize: true,
    },
  ];
};

export const calculateRemainingConfigurations = (
  catalog: Catalog,
  selections: AssemblySelection,
): number => {
  const filtered = filterCatalog(catalog, selections);
  const counts: number[] = [];

  if (!selections.hoseTypeId) {
    counts.push(filtered.hoseTypes.length);
  }
  if (!selections.hoseSizeId) {
    counts.push(filtered.hoseSizes.length);
  }
  if (!selections.hoseEndStyleId) {
    counts.push(filtered.hoseEndStyles.length);
  }
  if (!selections.hoseEndColorId) {
    counts.push(filtered.hoseEndColors.length);
  }
  if (!selections.hoseEndAngleAId) {
    counts.push(filtered.hoseEndAngles.length);
  }
  if (!selections.hoseEndAngleBId) {
    counts.push(filtered.hoseEndAngles.length);
  }
  if (!selections.lengthInches) {
    const lengthCount =
      Math.floor((catalog.length.max - catalog.length.min) / catalog.length.step) + 1;
    counts.push(lengthCount);
  }
  if (selections.extras.length === 0) {
    counts.push(filtered.extras.length + 1);
  }

  if (counts.length === 0) {
    return 0;
  }

  const raw = counts.reduce((acc, count) => acc * count, 1);
  return Math.min(raw, 99);
};
