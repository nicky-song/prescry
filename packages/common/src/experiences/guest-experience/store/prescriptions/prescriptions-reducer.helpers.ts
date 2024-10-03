// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescription } from '../../../../models/pending-prescription';
import { IPharmacyOffer } from '../../../../models/pharmacy-offer';
import { IPrescriptionsState } from './prescriptions-reducer';
import { IUpdatePrescriptionsAction } from './prescriptions-reducer.actions';
import { reduceRecommendationExperiences } from './prescriptions-reducer.recommendation-experience';

export function reduceUpdatePrescriptions(
  state: IPrescriptionsState,
  action: IUpdatePrescriptionsAction
): IPrescriptionsState | undefined {
  const updatedPrescriptionsList = action.payload.pendingPrescriptionsList;

  // merge existing prescriptions with updates, add new, remove existing that have not been updated
  // if the current selected prescription no longer exists, reset the selected prescription (and maybe warn the user?)
  // if the current selected offer no longer exists, reset the selected offer (and maybe warn the user?

  const prescriptions = (updatedPrescriptionsList.prescriptions || []).map(
    (eachUpdated) => {
      const existing = state.prescriptions.find(
        (eachExisting) => eachExisting.identifier === eachUpdated.identifier
      );
      const confirmation = (existing && existing.confirmation) || undefined;
      return {
        ...existing,
        ...eachUpdated,
        // include the existing confirmation if it exists: // TODO: this does not work
        ...((confirmation && { confirmation }) || undefined),
      };
    }
  );

  const selectedPrescription = reconcileAnySelectedPrescription(
    prescriptions,
    state.selectedPrescription
  );
  const selectedOffer = reconcileAnySelectedOffer(
    selectedPrescription,
    state.selectedOffer
  );

  return {
    events: updatedPrescriptionsList.events,
    identifier: updatedPrescriptionsList.identifier,
    prescriptions,
    selectedOffer,
    selectedPrescription,
  };
}

export function reconcileAnySelectedPrescription(
  prescriptions: IPendingPrescription[],
  selectedPrescription?: { prescription: IPendingPrescription }
) {
  if (selectedPrescription) {
    const existing = prescriptions.find(
      (f) => f.identifier === selectedPrescription.prescription.identifier
    );
    if (existing) {
      return {
        prescription: existing,
        recommendationExperience: reduceRecommendationExperiences(existing),
      };
    }
  } else if (prescriptions.length > 0) {
    const autoSelect = prescriptions[0];
    return {
      prescription: autoSelect,
      recommendationExperience: reduceRecommendationExperiences(autoSelect),
    };
  }
  return undefined;
}

export function reconcileAnySelectedOffer(
  reconciledSelectedPrescription?: { prescription: IPendingPrescription },
  selectedOffer?: IPharmacyOffer
) {
  if (reconciledSelectedPrescription) {
    const offers = reconciledSelectedPrescription.prescription.offers;
    if (selectedOffer) {
      const offer = offers.find((o) => o.offerId === selectedOffer.offerId);
      if (offer) {
        return offer;
      } else {
        return selectedOffer;
      }
    } else {
      const defaultOffer = offers.length > 0 ? offers[0] : undefined;
      return defaultOffer;
    }
  }
  return undefined;
}
