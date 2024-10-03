// Copyright 2021 Prescryptive Health, Inc.

export interface IDrugVariant {
  displayName: string;
  form: string;
  formCode: string;
  genericName?: string;
  name?: string;
  ndc: string;
  packageQuantity: string;
  strength: string;
  strengthUnit: string;
  modeQuantity?: number;
  modeDaysSupply?: number;
}

export interface IDrugSearchResult {
  name: string;
  forms: string[];
  drugVariants: IDrugVariant[];
}

export interface IDrugVariantForms {
  formValue: string;
  formCode: string;
  representativeNdc: string;
  packages: IDrugVariantFormPackage[];
  strength: string;
  strengthUnit: string;
  modeQuantity: number;
  modeDaysSupply: number;
}
export interface IResponseDrugVariant {
  forms: IDrugVariantForms[];
}

export interface IDrugVariantFormPackage {
  packageQuantity: string;
  representativeNdc: string;
  modeQuantity: string;
  modeDaysSupply: string;
}
