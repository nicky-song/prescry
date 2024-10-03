// Copyright 2021 Prescryptive Health, Inc.

import { IDrugConfiguration } from '../../models/drug-configuration';
import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../models/drug-search-response';
import { formatStrength } from '../formatters/drug.formatter';

const getDrugByName = (
  drugName: string,
  drugSearchResults: IDrugSearchResult[]
): IDrugSearchResult | undefined => {
  return drugSearchResults.find((drug) => drug.name === drugName);
};

const getDefaultConfiguration = (
  drug: IDrugSearchResult
): IDrugConfiguration | undefined => {
  if (drug.drugVariants.length === 0) {
    return undefined;
  }

  const { ndc, modeQuantity, modeDaysSupply } = drug.drugVariants[0];

  return {
    ndc,
    quantity: getSupportedDefaultQuantity(modeQuantity),
    supply: getSupportedDefaultDaysSupply(modeDaysSupply),
  };
};

const getSupportedDefaultQuantity = (modeQuantity?: number): number =>
  modeQuantity || 1;

const getSupportedDefaultDaysSupply = (modeDaysSupply = 30): number => {
  const supportedDaysSupply = [30, 60, 90];
  return supportedDaysSupply.includes(modeDaysSupply) ? modeDaysSupply : 30;
};

const getVariantByNdc = (
  ndc: string,
  drugSearchResult: IDrugSearchResult
): IDrugVariant | undefined =>
  drugSearchResult.drugVariants.find((variant) => variant.ndc === ndc);

const getVariantByForm = (
  form: string,
  drugSearchResult: IDrugSearchResult
): IDrugVariant | undefined =>
  drugSearchResult.drugVariants.find((variant) => variant.form === form);

const getVariantByStrength = (
  form: string,
  strengthAndUnit: string,
  drugSearchResult: IDrugSearchResult
): IDrugVariant | undefined =>
  drugSearchResult.drugVariants.find(
    (variant) =>
      variant.form === form &&
      formatStrength(variant.strength, variant.strengthUnit) === strengthAndUnit
  );

export default {
  getDrugByName,
  getDefaultConfiguration,
  getSupportedDefaultDaysSupply,
  getSupportedDefaultQuantity,
  getVariantByNdc,
  getVariantByForm,
  getVariantByStrength,
};
