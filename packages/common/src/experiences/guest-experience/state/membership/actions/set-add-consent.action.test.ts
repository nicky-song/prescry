// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsent } from '../../../../../models/air/add-consent.response';
import { setAddConsentAction } from './set-add-consent.action';

describe('setAddConsentAction', () => {
  it('returns action', () => {
    const addConsentMock: IAddConsent = {
      success: true,
      error: '',
    };

    const action = setAddConsentAction(addConsentMock);
    expect(action.type).toEqual('SET_ADD_CONSENT');
    expect(action.payload).toEqual({
      addConsent: addConsentMock,
    });
  });
});
