// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { IAlternativePrescription } from '../../../components/member/alternative-prescription/alternative-prescription';
import { IContactInfo } from '../../../models/contact-info';
import { IPharmacyOffer } from '../../../models/pharmacy-offer';
import { IRecommendation } from '../../../models/recommendation';
import {
  IRecommendationExperienceAlternatives,
  IRecommendationExperienceGenerics,
} from '../../../models/recommendation-experience/recommendation-experience';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildPharmacyDetails,
  createOffersListRowProps,
  IOfferPriceSummaryProps,
} from '../../../utils/offers.helper';
import { buildRecommendationPrescriptionDetails } from '../../../utils/prescription-info.helper';
import { getDrugInformationAsyncAction } from '../store/drug-information/async-actions/get-drug-information.async-action';
import { PrescriptionRecommendationType } from '../store/prescriptions/prescriptions-reducer';
import { RootState } from '../store/root-reducer';
import {
  ClaimAlertScreen,
  IClaimAlertProps,
  IClaimAlertScreenActionProps,
  IClaimAlertScreenProps,
  IOfferRowProps,
} from './claim-alert-screen';
import {
  claimAlertScreenContent,
  IClaimsAlertSavingsProps,
} from './claim-alert-screen.content';

export function mapGenericSubstitutionOfferContentProps(
  selectedAlert: IRecommendationExperienceGenerics
): IAlternativePrescription[] {
  const medication = selectedAlert.recommendedOffer.medication;
  const props: IAlternativePrescription = {
    count: selectedAlert.recommendedOffer.fillOptions.count,
    dose: medication.strength,
    drugName: medication.name,
    form: medication.form,
    price:
      selectedAlert.recommendedOffer.offer.price.memberPaysTotal.toString(),
    planPays:
      selectedAlert.recommendedOffer.offer.price.planCoveragePays.toString(),
    units: medication.units,
    medicationId: medication.medicationId,
  };

  return [props];
}

export function mapAlternativeSubsitutionOfferContentProps(
  selectedAlert: IRecommendationExperienceAlternatives
): IAlternativePrescription[] {
  return selectedAlert.recommendedOffers.map((recommendation) => {
    const medication = recommendation.medication;
    const props: IAlternativePrescription = {
      count: recommendation.fillOptions.count,
      dose: medication.strength,
      drugName: medication.name,
      form: medication.form,
      price: recommendation.offer.price.memberPaysTotal.toString(),
      units: medication.units,
      medicationId: medication.medicationId,
      planPays: recommendation.offer.price.planCoveragePays.toString(),
    };
    return props;
  });
}

export function getSavings(
  recommendation: IRecommendation,
  substitutionType: PrescriptionRecommendationType
) {
  let youCouldSave = false;
  let planCouldSave = false;
  const minimumSavingsAmount = parseFloat(
    recommendation.rule.minimumSavingsAmount || '0'
  );
  const minimumPlanSavingsAmount = parseFloat(
    recommendation.rule.minimumPlanSavingsAmount || '0'
  );
  if (substitutionType === 'alternativeSubstitution') {
    const yourPrice = parseFloat(
      recommendation.rule.alternativeSubstitution?.savings || '0'
    );
    const planPrice = parseFloat(
      recommendation.rule.alternativeSubstitution?.planSavings || '0'
    );
    youCouldSave =
      recommendation.rule.alternativeSubstitution?.savings !== undefined
        ? yourPrice > minimumSavingsAmount
        : false;
    if (youCouldSave) {
      return { planCouldSave, price: yourPrice, youCouldSave };
    }
    planCouldSave =
      recommendation.rule.alternativeSubstitution?.planSavings !== undefined
        ? planPrice > minimumPlanSavingsAmount
        : false;
    if (planCouldSave) {
      return { planCouldSave, price: planPrice, youCouldSave };
    }
  }
  if (substitutionType === 'genericSubstitution') {
    const yourPrice = parseFloat(
      recommendation.rule.genericSubstitution?.savings || '0'
    );
    const planPrice = parseFloat(
      recommendation.rule.genericSubstitution?.planSavings || '0'
    );
    youCouldSave =
      recommendation.rule.genericSubstitution?.savings !== undefined
        ? yourPrice > minimumSavingsAmount
        : false;
    if (youCouldSave) {
      return { planCouldSave, price: yourPrice, youCouldSave };
    }
    planCouldSave =
      recommendation.rule.genericSubstitution?.planSavings !== undefined
        ? planPrice > minimumPlanSavingsAmount
        : false;
    if (planCouldSave) {
      return { planCouldSave, price: planPrice, youCouldSave };
    }
  }
  return { planCouldSave, price: recommendation.savings, youCouldSave };
}

export const buildClaimsAlertSavingContent = (
  substitutionType: PrescriptionRecommendationType,
  recommendation: IRecommendation
): IClaimsAlertSavingsProps => {
  let alertSavingContent = {} as IClaimsAlertSavingsProps;
  const { planCouldSave, price } = getSavings(recommendation, substitutionType);

  if (substitutionType === 'alternativeSubstitution') {
    alertSavingContent = {
      ...claimAlertScreenContent.alternativeYouCouldSaveContent,
    };
    if (planCouldSave) {
      alertSavingContent = {
        ...claimAlertScreenContent.alternativePlanCouldSaveContent,
      };
    }
  } else if (substitutionType === 'genericSubstitution') {
    alertSavingContent = {
      ...claimAlertScreenContent.genericYouCouldSaveSubstitution,
    };
    if (planCouldSave) {
      alertSavingContent = {
        ...claimAlertScreenContent.genericPlanCouldSaveSubstitution,
      };
    }
  }
  alertSavingContent.price = price;
  return alertSavingContent;
};

export const mapStatetoProps = (state: RootState): IClaimAlertScreenProps => {
  let offerList: (IOfferRowProps & IOfferPriceSummaryProps)[] = [];
  const selectedPrescription = state.prescription.selectedPrescription;
  if (!selectedPrescription) {
    throw new Error(
      ErrorConstants.errorMissingSelectedPrescriptionForRecommendedOfferList
    );
  }
  const rx = selectedPrescription.prescription;
  offerList =
    createOffersListRowProps([], rx.pharmacies, state.config.currentDate) || [];
  let purchasedOffer: IPharmacyOffer | undefined;
  if (rx.confirmation) {
    const offerId = rx.confirmation.offerId;
    rx.confirmation.orderDate = new Date(rx.confirmation.orderDate);
    purchasedOffer = rx.offers.find(
      (o: IPharmacyOffer) => o.offerId === offerId
    );
  }

  let purchasedPharmacy: IContactInfo | undefined;
  if (purchasedOffer) {
    const ncpdp = purchasedOffer.pharmacyNcpdp;
    purchasedPharmacy = rx.pharmacies.find(
      (p: IContactInfo) => p.ncpdp === ncpdp
    );
  }

  const experience = selectedPrescription.recommendationExperience;
  let alertProps: IClaimAlertProps | undefined;

  if (experience.alternativeSubstitution) {
    const substitutionType = 'alternativeSubstitution';
    alertProps = {
      alertId: experience.alternativeSubstitution.recommendation.identifier,
      instruction: experience.alternativeSubstitution.instruction,
      offers: mapAlternativeSubsitutionOfferContentProps(
        experience.alternativeSubstitution
      ),
      pharmacyDetails: buildPharmacyDetails(state),
      alertSavingContent: buildClaimsAlertSavingContent(
        substitutionType,
        experience.alternativeSubstitution.recommendation
      ) as IClaimsAlertSavingsProps,
      type: experience.alternativeSubstitution.recommendation.type,
    };
  }
  if (experience.genericSubstitution) {
    const substitutionType = 'genericSubstitution';
    alertProps = {
      alertId: experience.genericSubstitution.recommendation.identifier,
      instruction: experience.genericSubstitution.instruction,
      offers: mapGenericSubstitutionOfferContentProps(
        experience.genericSubstitution
      ),
      alertSavingContent: buildClaimsAlertSavingContent(
        substitutionType,
        experience.genericSubstitution.recommendation
      ) as IClaimsAlertSavingsProps,
      pharmacyDetails: buildPharmacyDetails(state),
      type: experience.genericSubstitution.recommendation.type,
    };
  }

  if (experience.notification) {
    alertProps = {
      alertId: experience.notification.recommendation.identifier,
      alertSavingContent: claimAlertScreenContent.notificationContent,
      pharmacyDetails: buildPharmacyDetails(state),
      type: experience.notification.recommendation.type,
    };
  }

  if (experience.reversal) {
    alertProps = {
      alertId: experience.reversal.recommendation.identifier,
      alertSavingContent: claimAlertScreenContent.reversalContent,
      pharmacyDetails: buildPharmacyDetails(state),
      type: experience.reversal.recommendation.type,
    };
  }

  const { firstName, lastName } = state.prescribedMember;

  return {
    alertProps: (rx.recommendations && alertProps) || undefined,
    memberProfileName: firstName && lastName && `${firstName} ${lastName}`,
    offerList,
    prescription: {
      ...buildRecommendationPrescriptionDetails(
        rx,
        purchasedPharmacy,
        purchasedOffer
      ),
      drugInformation: {
        drugName: state.drugInformation.drug?.drugName || '',
        NDC: state.drugInformation.drug?.NDC || '',
        externalLink: state.drugInformation.drug?.externalLink || '',
        videoImage: state.drugInformation.drug?.videoImage || '',
        videoLink: state.drugInformation.drug?.videoLink || '',
      },
    },
    purchasedOffer,
    purchasedPharmacy,
  };
};

const actions: IClaimAlertScreenActionProps = {
  getDrugInformation: getDrugInformationAsyncAction,
};

export const ConnectedClaimAlertScreen = connect(
  mapStatetoProps,
  actions
)(ClaimAlertScreen);
