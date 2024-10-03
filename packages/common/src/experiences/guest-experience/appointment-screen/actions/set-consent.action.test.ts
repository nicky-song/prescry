// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { setConsentAction } from './set-consent.action';

describe('setConsentAction', () => {
  it.each([[false], [true]])(
    'returns action (consentAccepted: %p)',
    (consentAcceptedMock: boolean) => {
      const action = setConsentAction(consentAcceptedMock);

      expect(action.type).toEqual('SET_CONSENT');

      const expectedPayload: Partial<IAppointmentScreenState> = {
        consentAccepted: consentAcceptedMock,
      };
      expect(action.payload).toStrictEqual(expectedPayload);
    }
  );
});
