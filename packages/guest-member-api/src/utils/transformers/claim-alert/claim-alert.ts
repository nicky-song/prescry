// Copyright 2022 Prescryptive Health, Inc.

import { Transformer } from '../transformer.types';
import { drugTransformerPrescribedMedication } from './drug';
import { recommendationsMapper } from './recommendations';
import { IPendingPrescription } from '@phx/common/src/models/pending-prescription';
import {
  IClaimAlert,
  ClaimNotification,
} from '@phx/common/src/models/claim-alert/claim-alert';

import { IContactInfo } from '@phx/common/src/models/contact-info';
import { ErrorConstants } from '../../../constants/response-messages';

export const claimAlertMapper: Transformer<
  IPendingPrescription,
  IClaimAlert,
  'identifier' | 'masterId'
> = (from) => {
  const { fromModel: prescription, additional } = from;
  const {
    identifier,
    prescription: prescriptionDetails,
    medication,
    recommendations,
    confirmation,
    pharmacies,
    offers,
  } = prescription;

  if (!confirmation) {
    throw new Error(ErrorConstants.NO_CONFIRMATION_FOUND(identifier));
  }

  const mainOffer = offers.find(({ offerId }) => {
    return offerId === confirmation.offerId;
  });

  if (!mainOffer) {
    throw new Error(ErrorConstants.NO_MAIN_OFFER_FOUND(identifier));
  }

  const { memberPaysTotal: price, planCoveragePays: planPrice } =
    mainOffer.price;

  const { fillOptions, referenceNumber, prescriber } = prescriptionDetails;

  if (!fillOptions?.length) {
    throw new Error(
      ErrorConstants.NO_FILL_OPTIONS_FOUND(identifier, referenceNumber)
    );
  }

  const { count, daysSupply: supply } = prescriptionDetails.fillOptions[0];

  const { strength, units: unit, form: formCode } = medication;

  const prescribedMedication = drugTransformerPrescribedMedication({
    fromModel: medication,
    additional: {
      drugDetails: { quantity: count, unit, formCode, supply, strength },
      price,
      planPrice,
      orderDate: new Date(confirmation.orderDate).toDateString(),
    },
  });

  let notificationType: ClaimNotification | undefined;

  const recommendationType = recommendations?.[0].type;

  const alternativeMedicationList = recommendations
    ? recommendationsMapper(recommendations, offers)
    : [];

  switch (recommendationType) {
    case 'reversal':
      notificationType = 'reversal';
      break;
    case 'notification':
      notificationType = 'bestPrice';
      break;
    case 'alternativeSubstitution':
      notificationType = 'alternativesAvailable';
      break;
    case 'genericSubstitution':
      notificationType = 'alternativesAvailable';
      break;
  }

  const claimAlert: IClaimAlert = {
    ...additional,
    notificationType: notificationType ?? 'reversal',
    prescribedMedication,
    alternativeMedicationList,
    pharmacyInfo: mapPharmacies(pharmacies),
    prescriber,
  };

  return claimAlert;
};

export const mapPharmacies = (pharmacies: IContactInfo[]): IContactInfo => {
  const { ncpdp, name, phone, email, hours, address } = pharmacies[0];
  return { ncpdp, email, name, phone, address, hours };
};
