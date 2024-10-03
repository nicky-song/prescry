// Copyright 2021 Prescryptive Health, Inc.

import { setConsentAction } from '../actions/set-consent.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const setConsentDispatch = (
  dispatch: AppointmentScreenDispatch,
  consentAccepted: boolean
) => dispatch(setConsentAction(consentAccepted));
