// Copyright 2018 Prescryptive Health, Inc.

import {
  getPrescriptionReducerState,
  IPrescriptionsState,
  prescriptionsReducer,
} from './prescriptions-reducer';
import {
  IUpdatePrescriptionsAction,
  PrescriptionsStateActionKeys,
} from './prescriptions-reducer.actions';
import { mockPendingPrescriptionsList } from '../../__mocks__/scenario-two.mock';
import { mockPendingPrescriptionsList as genericPendingPrescriptionsList } from '../../__mocks__/scenario-one.mock';
import { RootState } from '../root-reducer';

describe('getPrescriptionReducerState', () => {
  it('returns the prescription reducer state', () => {
    const root = { prescription: {} } as RootState;
    const result = getPrescriptionReducerState(root);
    expect(result).toEqual(root.prescription);
  });
});

describe('prescriptionReducer.UPDATE_PRESCRIPTIONS', () => {
  it('returns state with recommendationType selected alternativeSubstitution', () => {
    const action: IUpdatePrescriptionsAction = {
      payload: {
        pendingPrescriptionsList: mockPendingPrescriptionsList,
        arePrescriptionsInitialized: true,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    };

    const state = {
      events: [],
      identifier: '',
      prescriptions: [],
    } as IPrescriptionsState;

    const result = prescriptionsReducer(state, action);

    expect(result.selectedPrescription).toBeDefined();
    const selected = result.selectedPrescription;

    expect(selected?.prescription).toBeDefined();

    const experience = selected?.recommendationExperience;
    expect(experience?.alternativeSubstitution).toBeDefined();
    expect(experience?.genericSubstitution).toBe(undefined);
  });

  it('returns state with recommendationType selected: generic substitution', () => {
    const action: IUpdatePrescriptionsAction = {
      payload: {
        pendingPrescriptionsList: genericPendingPrescriptionsList,
        arePrescriptionsInitialized: true,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    };

    const state = {
      events: [],
      identifier: '',
      prescriptions: [],
    } as IPrescriptionsState;

    const result = prescriptionsReducer(state, action);

    expect(result.selectedPrescription).toBeDefined();
    const selected = result.selectedPrescription;

    expect(selected?.prescription).toBeDefined();

    const experience = selected?.recommendationExperience;
    expect(experience?.genericSubstitution).toBeDefined();
    expect(experience?.alternativeSubstitution).toBe(undefined);
  });
});
