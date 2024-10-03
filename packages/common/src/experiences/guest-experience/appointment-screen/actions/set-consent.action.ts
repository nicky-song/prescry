// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type ISetConsentAction = IAppointmentScreenAction<'SET_CONSENT'>;

export const setConsentAction = (
  consentAccepted: boolean
): ISetConsentAction => {
  const payload: Partial<IAppointmentScreenState> = {
    consentAccepted,
  };

  return {
    type: 'SET_CONSENT',
    payload,
  };
};
