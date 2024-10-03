// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescription } from '../../../../models/pending-prescription';
import { IRecommendationCarouselContent } from '../../../../models/recommendation';
import {
  IClaimAlertExperienceNotification,
  IClaimAlertExperienceReversal,
  IRecommendationExperience,
  IRecommendationExperienceAlternatives,
  IRecommendationExperienceGenerics,
} from '../../../../models/recommendation-experience/recommendation-experience';
import { IRecommendationOffer } from '../../../../models/recommendation-experience/recommendation-offer';
import {
  AlternativesSubstitutionCarouselConstants,
  ErrorConstants,
  GenericSubstitutionCarouselConstants,
  NotificationCarouselConstants,
  RecommendationAlternativesScreenConstants,
  RecommendationGenericScreenConstants,
  ReversalCarouselConstants,
} from '../../../../theming/constants';
import {
  getOriginalOfferDetails,
  getPharmacy,
  getRecommendationRule,
  getRecommendedAlternativesSubstitutionOffers,
  getRecommendedOffers,
} from '../../../../utils/recommendation-experience.helper';

export function reduceRecommendationExperiences(
  pendingPrescription: IPendingPrescription
): IRecommendationExperience {
  return {
    alternativeSubstitution:
      reduceAlternativesSubstitutionRecommendationExperience(
        pendingPrescription
      ),
    genericSubstitution:
      reduceGenericSubstitutionRecommendationExperience(pendingPrescription),
    notification:
      reduceNotificationRecommendationExperience(pendingPrescription),
    reversal: reduceReversalRecommendationExperience(pendingPrescription),
  };
}

export function reduceAlternativesSubstitutionRecommendationExperience(
  prescription: IPendingPrescription
): IRecommendationExperienceAlternatives | undefined {
  if (
    prescription &&
    prescription.confirmation &&
    prescription.recommendations
  ) {
    const recommendation = getRecommendationRule(
      prescription,
      'alternativeSubstitution'
    );
    if (recommendation && recommendation.rule.alternativeSubstitution) {
      const alternativesRule = recommendation.rule.alternativeSubstitution;
      const originalOffer = getOriginalOfferDetails({
        prescription,
      });
      if (originalOffer) {
        const pharmacyOffers = getRecommendedOffers(
          prescription,
          originalOffer.offer,
          recommendation
        );
        if (pharmacyOffers.length > 0) {
          const recommendedOffers: IRecommendationOffer[] =
            getRecommendedAlternativesSubstitutionOffers(
              prescription,
              alternativesRule,
              pharmacyOffers
            );

          const carousel: IRecommendationCarouselContent = {
            ...AlternativesSubstitutionCarouselConstants,
            priceText: `${AlternativesSubstitutionCarouselConstants.priceText}`,
          };
          return {
            carousel,
            instruction: {
              callToActionText:
                RecommendationAlternativesScreenConstants.callToActionText,
              doctorContactNumber: prescription.prescription.prescriber.phone,
              doctorName: prescription.prescription.prescriber.name,
              explanationText:
                RecommendationAlternativesScreenConstants.explanationText,
            },
            originalOffer,
            prescription,
            recommendation,
            recommendedOffers,
          };
        }
      }
    }
  }
  return undefined;
}

export function reduceGenericSubstitutionRecommendationExperience(
  prescription: IPendingPrescription
): IRecommendationExperienceGenerics | undefined {
  if (
    prescription &&
    prescription.confirmation &&
    prescription.recommendations
  ) {
    const recommendation = getRecommendationRule(
      prescription,
      'genericSubstitution'
    );
    if (recommendation && recommendation.rule.genericSubstitution) {
      const rule = recommendation.rule.genericSubstitution;
      const originalOffer = getOriginalOfferDetails({
        prescription,
      });
      if (!originalOffer) {
        throw new Error(ErrorConstants.errorObjectIsMissing);
      }
      if (originalOffer) {
        const pharmacyOffers = getRecommendedOffers(
          prescription,
          originalOffer.offer,
          recommendation
        );
        if (pharmacyOffers.length > 0) {
          const recommendedOffer: IRecommendationOffer = {
            fillOptions: rule.to.fillOptions,
            medication: rule.to.medication,
            offer: pharmacyOffers[0],
            pharmacy: getPharmacy(prescription, pharmacyOffers[0]),
          };

          const carousel: IRecommendationCarouselContent = {
            ...GenericSubstitutionCarouselConstants,
            priceText: `${GenericSubstitutionCarouselConstants.priceText}`,
          };

          return {
            carousel,
            instruction: {
              callToActionText:
                RecommendationGenericScreenConstants.callToActionText,
              explanationText:
                RecommendationGenericScreenConstants.explanationText,
            },
            originalOffer,
            prescription,
            recommendation,
            recommendedOffer,
          };
        }
      }
    }
  }
  return undefined;
}

export function reduceNotificationRecommendationExperience(
  prescription: IPendingPrescription
): IClaimAlertExperienceNotification | undefined {
  if (
    prescription &&
    prescription.confirmation &&
    prescription.recommendations
  ) {
    const recommendation = getRecommendationRule(prescription, 'notification');
    if (recommendation && recommendation.rule.type === 'notification') {
      const originalOffer = getOriginalOfferDetails({
        prescription,
      });
      if (!originalOffer) {
        throw new Error(ErrorConstants.errorNotificationOriginalOfferMissing);
      }
      const carousel: IRecommendationCarouselContent = {
        ...NotificationCarouselConstants,
        priceText: `${NotificationCarouselConstants.priceText}`,
      };
      return {
        carousel,
        originalOffer,
        prescription,
        recommendation,
      };
    }
  }
  return undefined;
}

export function reduceReversalRecommendationExperience(
  prescription: IPendingPrescription
): IClaimAlertExperienceReversal | undefined {
  if (
    prescription &&
    prescription.confirmation &&
    prescription.recommendations
  ) {
    const recommendation = getRecommendationRule(prescription, 'reversal');
    if (recommendation && recommendation.rule.type === 'reversal') {
      const originalOffer = getOriginalOfferDetails({
        prescription,
      });
      if (!originalOffer) {
        throw new Error(ErrorConstants.errorReversalOriginalOfferMissing);
      }
      const carousel: IRecommendationCarouselContent = {
        ...ReversalCarouselConstants,
        priceText: `${ReversalCarouselConstants.priceText}`,
      };
      return {
        carousel,
        originalOffer,
        prescription,
        recommendation,
      };
    }
  }
  return undefined;
}
