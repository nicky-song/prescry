// Copyright 2018 Prescryptive Health, Inc.

import { IRecommendationBottomProps } from '../components/member/recommendation-bottom/recommendation-bottom';
import { IRecommendationTopProps } from '../components/member/recommendation-top/recommendation-top';
import { IContactInfo } from '../models/contact-info';
import { IPendingPrescription } from '../models/pending-prescription';
import { IPharmacyOffer } from '../models/pharmacy-offer';

const unknownRx = {
  fillOptions: [],
  referenceNumber: 'unknown',
  sig: 'unknown',
};
const unknownMedication = {
  form: 'unknown',
  genericName: 'unknown',
  name: 'unknown',
  strength: '',
  medicationId: 'unknown',
  units: 'unknown',
};
const unknownFillOption = {
  authorizedRefills: 0,
  count: 0,
  daysSupply: 0,
  fillNumber: 0,
};

export function shouldEnableDaysSupplyToggle(rx: IPendingPrescription) {
  return (
    rx.prescription &&
    rx.prescription.fillOptions &&
    rx.prescription.fillOptions.length === 2 &&
    rx.prescription.fillOptions[0].daysSupply === 30 &&
    rx.prescription.fillOptions[1].daysSupply === 90
  );
}

export function buildRecommendationPrescriptionDetails(
  rx?: IPendingPrescription,
  pharmacy?: IContactInfo,
  offer?: IPharmacyOffer
): IRecommendationBottomProps & IRecommendationTopProps {
  const prescription = (rx && rx.prescription) || unknownRx;
  const medication = (rx && rx.medication) || unknownMedication;
  const memberPays = (offer && offer.price.memberPaysTotal) || 0;
  const offerPrice = (offer && offer.price.planCoveragePays) || 0;
  const pharmacyStoreName = (pharmacy && pharmacy.name) || '';
  const fillOption =
    prescription.fillOptions.length > 0
      ? prescription.fillOptions[0]
      : unknownFillOption;
  const orderDate = rx && rx.confirmation && rx.confirmation.orderDate;
  return {
    count: fillOption.count,
    daysSupply: fillOption.daysSupply || 0,
    dose: medication.strength,
    drugName: medication.name,
    form: medication.form,
    medicationId: medication.medicationId,
    orderDate,
    pharmacyCashPrice: memberPays,
    pharmacyName: pharmacyStoreName,
    planPays: offerPrice,
    refillCount: fillOption.authorizedRefills - fillOption.fillNumber,
    rxId: prescription.referenceNumber,
    units: medication.units,
  };
}
