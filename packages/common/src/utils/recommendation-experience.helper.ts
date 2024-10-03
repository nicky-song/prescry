// Copyright 2018 Prescryptive Health, Inc.

import { PrescriptionRecommendationType } from '../experiences/guest-experience/store/prescriptions/prescriptions-reducer';
import { IPendingPrescription } from '../models/pending-prescription';
import { IPharmacyOffer } from '../models/pharmacy-offer';
import { IRecommendation } from '../models/recommendation';
import {
  IRecommendationAlternativesSubstitutionRule,
  IRecommendationGenericSubstitutionRule,
} from '../models/recommendation';
import { IRecommendationOffer } from '../models/recommendation-experience/recommendation-offer';
import { ErrorConstants } from '../theming/constants';

export function getRecommendation(
  prescription: IPendingPrescription,
  identifier: string
) {
  if (!prescription.recommendations) {
    throw new Error(ErrorConstants.errorNoRecommendations);
  }
  const recommendation = prescription.recommendations.find(
    (reco) => reco.identifier === identifier
  );
  if (!recommendation) {
    throw new Error(ErrorConstants.errorRecommendationIdentifierNotFound);
  }
  return recommendation;
}

export function getPharmacy(
  prescription: IPendingPrescription,
  offer: IPharmacyOffer
) {
  const pharmacy = prescription.pharmacies.find(
    (p) => p.ncpdp === offer.pharmacyNcpdp
  );
  if (!pharmacy) {
    throw new Error(`Pharmacy not found: ${offer.pharmacyNcpdp}`);
  }
  return pharmacy;
}

export function getRecommendationRule(
  prescription: IPendingPrescription,
  type: PrescriptionRecommendationType
) {
  if (prescription.recommendations && prescription.recommendations.length > 0) {
    const recommendations = prescription.recommendations.filter(
      (r) => r.rule.type === type
    );
    if (recommendations.length > 0) {
      return recommendations.sort((a, b) => b.savings - a.savings)[0];
    }
  }
  return undefined;
}

export function getOriginalOfferDetails(selectedPrescription?: {
  prescription: IPendingPrescription;
}): IRecommendationOffer | undefined {
  if (selectedPrescription) {
    const prescription = selectedPrescription.prescription;
    if (prescription.confirmation) {
      const originalOfferId = prescription.confirmation.offerId;
      const offer = prescription.offers.find(
        (o) => o.offerId === originalOfferId
      );
      const fillOptions = prescription.prescription.fillOptions[0];
      const medication = selectedPrescription.prescription.medication;

      if (offer && fillOptions && medication) {
        return {
          fillOptions,
          medication,
          offer,
          pharmacy: getPharmacy(prescription, offer),
        };
      }
    }
  }
  return undefined;
}

export function getRecommendedOffers(
  prescription: IPendingPrescription,
  originalOffer: IPharmacyOffer,
  recommendation: IRecommendation
) {
  return prescription.offers.filter(
    (offer) =>
      offer.offerId !== originalOffer.offerId &&
      offer.recommendation &&
      offer.recommendation.identifier === recommendation.identifier
  );
}

export function getRecommendedAlternativesSubstitutionOffers(
  prescription: IPendingPrescription,
  alternativesRule: IRecommendationAlternativesSubstitutionRule,
  pharmacyOffers: IPharmacyOffer[]
) {
  return pharmacyOffers.map((offer) => {
    const index = (offer.recommendation && offer.recommendation.index) || 0;
    return {
      fillOptions: alternativesRule.to[index].fillOptions,
      medication: alternativesRule.to[index].medication,
      offer,
      pharmacy: getPharmacy(prescription, offer),
    };
  });
}

export function getRecommendedGenericSubstitutionOffer(
  prescription: IPendingPrescription,
  rule: IRecommendationGenericSubstitutionRule,
  offer: IPharmacyOffer
): IRecommendationOffer {
  return {
    fillOptions: rule.to.fillOptions,
    medication: rule.to.medication,
    offer,
    pharmacy: getPharmacy(prescription, offer),
  };
}
