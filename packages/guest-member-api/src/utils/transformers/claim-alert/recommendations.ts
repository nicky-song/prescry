// Copyright 2022 Prescryptive Health, Inc.

import { IRecommendation } from '@phx/common/src/models/recommendation';
import { IAlternativeMedication } from '@phx/common/src/models/alternative-medication';
import { toTransformer } from './recommendations-to';
import { convertToNumber } from '../helpers';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';

export type RecommendationMap = Map<string, IRecommendation>;

export const buildRecommendationsMap = (recommendations: IRecommendation[]) => {
  const recommendationMap: RecommendationMap = new Map();

  recommendations.forEach((rec) => {
    const { identifier } = rec;
    recommendationMap.set(identifier, rec);
  });

  return recommendationMap;
};

/**
 * Maps all recommendations to alternatives
 * @param recs recommendations from the alert
 * @param offers Map of all offers
 * @returns List of alternative medication options
 */
export const recommendationsMapper = (
  recs: IRecommendation[],
  offers: IPharmacyOffer[]
): IAlternativeMedication[] => {
  const possibleSavings: IAlternativeMedication[] = [];
  recs.forEach((rec) => {
    const { rule, type: recType } = rec;

    let substitutionRule;
    switch (recType) {
      case 'alternativeSubstitution':
        substitutionRule = rule.alternativeSubstitution;
        break;
      case 'genericSubstitution':
        substitutionRule = rule.genericSubstitution;
        break;
      case 'notification':
        break;
      case 'reversal':
        break;
      default:
        throw new Error(`Recommendation has type of ${recType}`);
    }

    if (
      recType === 'alternativeSubstitution' ||
      recType === 'genericSubstitution'
    ) {
      const offer = offers.find((offer: IPharmacyOffer) => {
        return offer.recommendation?.identifier === rec.identifier;
      });

      if (!substitutionRule) {
        throw new Error(`Rule ${recType} is missing on ${rec.identifier}.`);
      }

      if (offer === undefined) {
        throw new Error(`${rec.identifier} has no matching offer.`);
      }

      const { drugs, savings, planSavings } = toTransformer(substitutionRule);

      const { memberPaysTotal: memberPays, planCoveragePays: planPays } =
        offer.price;

      const savingsAsNumbers = {
        savings: savings ? convertToNumber(savings) : 0,
        planSavings: planSavings ? convertToNumber(planSavings) : 0,
      };

      const alt: IAlternativeMedication = {
        memberSaves: savingsAsNumbers.savings,
        planSaves: savingsAsNumbers.planSavings,
        prescriptionDetailsList: drugs,
        drugPricing: {
          memberPays,
          planPays,
          memberSaves: savingsAsNumbers.savings,
          planSaves: savingsAsNumbers.planSavings,
        },
      };

      possibleSavings.push(alt);
    }
  });

  return possibleSavings;
};
