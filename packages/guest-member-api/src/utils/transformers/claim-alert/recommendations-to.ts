// Copyright 2022 Prescryptive Health, Inc.

import {
  IRecommendationGenericSubstitutionRule,
  IRecommendationAlternativesSubstitutionRule,
} from '@phx/common/src/models/recommendation';

import { drugTransformerPrescriptionDetails } from './drug';

export type rule =
  | IRecommendationGenericSubstitutionRule
  | IRecommendationAlternativesSubstitutionRule;

export const toTransformer = (SubstitutionRule: rule) => {
  const { to, savings, planSavings } = SubstitutionRule;

  const toRules = Array.isArray(to) ? to : [to];

  const drugs = toRules.map((toRule) => {
    const { medication, fillOptions } = toRule as typeof toRule;

    const { count: quantity, daysSupply: supply } = fillOptions;

    return drugTransformerPrescriptionDetails({
      fromModel: medication,
      additional: { quantity, supply },
    });
  });

  return { drugs, savings, planSavings };
};
