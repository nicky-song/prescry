// Copyright 2021 Prescryptive Health, Inc.

import { setConsentAction } from '../actions/set-consent.action';
import { setConsentDispatch } from './set-consent.dispatch';

describe('setConsentDispatch', () => {
  it.each([[false], [true]])(
    'dispatches expected action (consentAccepted: %p)',
    (consentAcceptedMock) => {
      const dispatchMock = jest.fn();

      setConsentDispatch(dispatchMock, consentAcceptedMock);

      const expectedAction = setConsentAction(consentAcceptedMock);
      expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
    }
  );
});
