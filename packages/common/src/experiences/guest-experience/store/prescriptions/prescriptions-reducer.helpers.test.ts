// Copyright 2018 Prescryptive Health, Inc.

import {
  IPendingPrescription,
  IPendingPrescriptionsList,
} from '../../../../models/pending-prescription';
import { IPharmacyOffer } from '../../../../models/pharmacy-offer';
import { mockTelemetryIds } from '../../__mocks__/pending-prescriptions.mock';
import { IPrescriptionsState } from './prescriptions-reducer';
import {
  IUpdatePrescriptionsAction,
  PrescriptionsStateActionKeys,
} from './prescriptions-reducer.actions';
import {
  reconcileAnySelectedOffer,
  reconcileAnySelectedPrescription,
  reduceUpdatePrescriptions,
} from './prescriptions-reducer.helpers';

interface IPendingPrescriptionOrderConfirmation {
  // TODO: change to use actual interface when it exists
  offerId: string;
  orderNumber: string;
  orderDate: Date;
}

describe('reconcileAnySelectedPrescription', () => {
  it('returns undefined if there are no prescriptions', () => {
    const result = reconcileAnySelectedPrescription([], {
      prescription: { identifier: 'xxx' } as IPendingPrescription,
    });
    expect(result).toBeUndefined();
  });

  it('returns undefined if provided selectedPrescription is no longer in the prescriptions list', () => {
    const prescriptions = [
      {
        identifier: 'a',
      },
      {
        identifier: 'b',
      },
    ] as IPendingPrescription[];

    const prescription = {
      identifier: 'c',
    } as IPendingPrescription;

    const result = reconcileAnySelectedPrescription(prescriptions, {
      prescription,
    });
    expect(result).toBeUndefined();
  });

  it('returns found prescription if selectedPrescription is in the prescriptions list', () => {
    const expectedPrescription = {
      identifier: 'b',
    } as IPendingPrescription;

    const actualPrescription = {
      identifier: 'b',
    } as IPendingPrescription;

    const prescriptionsList: IPendingPrescription[] = [];

    const other = {
      identifier: 'a',
    } as IPendingPrescription;

    prescriptionsList.push(other);
    prescriptionsList.push(expectedPrescription);

    const result = reconcileAnySelectedPrescription(prescriptionsList, {
      prescription: actualPrescription,
    });
    expect(result).toBeDefined();
    expect(result?.prescription).toBe(expectedPrescription);
  });
});

describe('reconcileAnySelectedOffer', () => {
  it('returns undefined if there is no reconciled selectedPrescription', () => {
    const result = reconcileAnySelectedOffer(undefined, {} as IPharmacyOffer);
    expect(result).toBeUndefined();
  });

  it('returns defaultOffer if there is no selected offer to find', () => {
    const defaultOffer = {} as IPharmacyOffer;
    const result = reconcileAnySelectedOffer(
      {
        prescription: {
          offers: [defaultOffer],
        },
      } as { prescription: IPendingPrescription },
      undefined
    );
    expect(result).toBe(defaultOffer);
  });

  it('returns given offer if matching offer is not found ', () => {
    const prescription = {
      offers: [{ offerId: 'a' }, { offerId: 'b' }],
    } as IPendingPrescription;

    const offer = {
      offerId: 'c',
    } as IPharmacyOffer;

    const result = reconcileAnySelectedOffer({ prescription }, offer);
    expect(result).toBe(offer);
  });

  it('returns updated offer (from prescription) if the existing offer matches one in the prescription', () => {
    const newOffer = { offerId: 'b' } as IPharmacyOffer;

    const prescription = {
      offers: [{ offerId: 'a' }, newOffer],
    } as IPendingPrescription;

    const offer = {
      offerId: newOffer.offerId,
    } as IPharmacyOffer;

    const result = reconcileAnySelectedOffer({ prescription }, offer);
    expect(result).toBe(newOffer);
  });
});

describe('reduceUpdatePrescriptions', () => {
  it('returns the updated prescriptions', () => {
    const updatedPrescriptionMock = {
      identifier: 'updated',
      offers: [{}] as IPharmacyOffer[],
    } as IPendingPrescription;
    const updatedPrescriptions: IPendingPrescription[] = [
      updatedPrescriptionMock,
    ];
    const updatedList: IPendingPrescriptionsList = {
      events: [mockTelemetryIds],
      identifier: 'mocklist',
      prescriptions: updatedPrescriptions,
    };

    const existingPrescription: Partial<IPendingPrescription> = {
      identifier: 'old',
      offers: [{}] as IPharmacyOffer[],
    };

    const existingPrescriptions: IPendingPrescription[] = [
      existingPrescription as IPendingPrescription,
    ];

    const action: IUpdatePrescriptionsAction = {
      payload: {
        pendingPrescriptionsList: updatedList,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    };

    const state: IPrescriptionsState = {
      identifier: 'state-identifier',
      prescriptions: existingPrescriptions,
    };

    const result = reduceUpdatePrescriptions(state, action); // <!-- should be in the result

    expect(result).not.toBeUndefined();
    expect(result?.identifier).toEqual(updatedList.identifier);
    expect(result?.prescriptions.length).toBe(updatedPrescriptions.length);
    expect(result?.prescriptions[0]).toMatchObject(updatedPrescriptions[0]);
  });

  it('returns removes selectedOffer and selectedPrescription if they are removed from pending prescriptions', () => {
    const updatedPrescriptionMock = {
      identifier: 'updated',
    } as IPendingPrescription;
    const updatedPrescriptions: IPendingPrescription[] = [
      updatedPrescriptionMock,
    ];
    const updatedList: IPendingPrescriptionsList = {
      events: [mockTelemetryIds],
      identifier: 'mocklist',
      prescriptions: updatedPrescriptions,
    };

    const existingPrescription = {
      identifier: 'old',
    } as IPendingPrescription;
    const existingPrescriptions: IPendingPrescription[] = [
      existingPrescription,
    ];

    const action: IUpdatePrescriptionsAction = {
      payload: {
        pendingPrescriptionsList: updatedList,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    };

    const state: IPrescriptionsState = {
      identifier: 'state-identifier',
      prescriptions: existingPrescriptions,
      selectedOffer: {
        offerId: 'selected-offer-id',
      } as IPharmacyOffer,
      selectedPrescription: {
        prescription: {
          identifier: 'not-in-the-updates',
        } as IPendingPrescription,
        recommendationExperience: {},
      },
    };

    const result = reduceUpdatePrescriptions(state, action);

    expect(result).not.toBeUndefined();
    expect(result?.identifier).toEqual(updatedList.identifier);
    expect(result?.selectedOffer).toBeUndefined();
    expect(result?.selectedPrescription).toBeUndefined();
  });

  it('merges any order confirmations from existing prescriptions that are still in the updated results', () => {
    const updatedPrescriptionMock = {
      identifier: 'updatedx',
      offers: [] as IPharmacyOffer[],
    } as IPendingPrescription;
    const updatedPrescriptions: IPendingPrescription[] = [
      updatedPrescriptionMock,
    ];
    const updatedList: IPendingPrescriptionsList = {
      events: [mockTelemetryIds],
      identifier: 'mocklist',
      prescriptions: updatedPrescriptions,
    };

    const existingConfirmation: IPendingPrescriptionOrderConfirmation = {
      offerId: 'offerId',
      orderDate: new Date(Date.now()),
      orderNumber: 'order num',
    };
    const existingPrescription: IPendingPrescription = {
      confirmation: existingConfirmation,
      identifier: 'updatedx',
      offers: [] as IPharmacyOffer[],
    } as IPendingPrescription;
    const existingPrescriptions: IPendingPrescription[] = [
      existingPrescription,
    ];

    const action: IUpdatePrescriptionsAction = {
      payload: {
        pendingPrescriptionsList: updatedList,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    };

    const state: IPrescriptionsState = {
      identifier: 'state-identifier',
      prescriptions: existingPrescriptions,
    };

    const result = reduceUpdatePrescriptions(state, action); // <!-- should be in the result
    expect(result).not.toBeUndefined();
    expect(result?.identifier).toEqual(updatedList.identifier);
    expect(result?.prescriptions.length).toBe(1);
    expect(result?.prescriptions[0].identifier).toBe(
      updatedPrescriptionMock.identifier
    );
    expect(result?.prescriptions[0].confirmation).not.toBeUndefined();
    expect(result?.prescriptions[0].confirmation).toBe(existingConfirmation);
  });
});
