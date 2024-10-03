// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsent } from '../../../../../models/air/add-consent.response';
import { setAddConsentAction } from '../actions/set-add-consent.action';
import { setAddConsentDispatch } from './set-add-consent.dispatch';

describe('setAddConsentDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const addConsentMock: IAddConsent = {
      success: true,
      error: '',
    };

    setAddConsentDispatch(dispatchMock, addConsentMock);

    const expectedAction = setAddConsentAction(addConsentMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
