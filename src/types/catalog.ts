export interface CatalogOption {
  id: string;
  label: string;
  description?: string;
  image?: string;
  price?: number;
}

export interface HoseTypeOption extends CatalogOption {
  code: string;
  compatibleColors: string[];
}

export interface HoseColorOption extends CatalogOption {
  code: string;
}

export interface HoseSizeOption extends CatalogOption {
  code: string;
}

export interface HoseEndStyleOption extends CatalogOption {
  code: string;
  compatibleHoseTypes: string[];
  compatibleColors: string[];
}

export interface HoseEndColorOption extends CatalogOption {
  code: string;
  compatibleStyles: string[];
}

export interface HoseEndAngleOption extends CatalogOption {
  code: string;
  degrees: number;
}

export interface ExtraOption extends CatalogOption {
  code: string;
}

export interface CatalogLengthRule {
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface CatalogPricing {
  hosePerInch: number;
}

export interface Catalog {
  hoseTypes: HoseTypeOption[];
  hoseColors: HoseColorOption[];
  hoseSizes: HoseSizeOption[];
  hoseEndStyles: HoseEndStyleOption[];
  hoseEndColors: HoseEndColorOption[];
  hoseEndAngles: HoseEndAngleOption[];
  extras: ExtraOption[];
  length: CatalogLengthRule;
  pricing: CatalogPricing;
}
