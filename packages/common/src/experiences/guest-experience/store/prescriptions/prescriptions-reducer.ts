// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  IPendingPrescription,
  IPendingPrescriptionsList,
} from '../../../../models/pending-prescription';
import { IPharmacyOffer } from '../../../../models/pharmacy-offer';
import { IRecommendationExperience } from '../../../../models/recommendation-experience/recommendation-experience';
import { RootState } from '../root-reducer';
import {
  PrescriptionsStateActionKeys,
  PrescriptionsStateActionTypes,
} from './prescriptions-reducer.actions';
import { reduceUpdatePrescriptions } from './prescriptions-reducer.helpers';

export type PrescriptionRecommendationType =
  | 'genericSubstitution'
  | 'alternativeSubstitution'
  | 'transfer'
  | 'notification'
  | 'reversal';

export interface IPrescriptionsState extends IPendingPrescriptionsList {
  prescriptions: IPendingPrescription[];
  selectedOffer?: IPharmacyOffer;
  selectedPrescription?: {
    prescription: IPendingPrescription;
    recommendationExperience: IRecommendationExperience;
  };
}

export const defaultPrescriptionsState: IPrescriptionsState = {
  events: [],
  identifier: '',
  prescriptions: [],
};

export const getPrescriptionReducerState = ({ prescription }: RootState) =>
  prescription;

export const prescriptionsReducer: Reducer<
  IPrescriptionsState,
  PrescriptionsStateActionTypes
> = (
  state: IPrescriptionsState = defaultPrescriptionsState,
  action: PrescriptionsStateActionTypes
): IPrescriptionsState => {
  switch (action.type) {
    case PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS: {
      const prescriptions = reduceUpdatePrescriptions(state, action);
      if (prescriptions && action.payload.arePrescriptionsInitialized) {
        return prescriptions;
      }
      break;
    }
  }
  return state;
};
