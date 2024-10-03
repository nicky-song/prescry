// Copyright 2022 Prescryptive Health, Inc.

/**
 * Pricing information for a drug
 */
export interface IDrugPricing {
  memberPays: number;
  planPays?: number;
  memberSaves?: number;
  planSaves?: number;
}
