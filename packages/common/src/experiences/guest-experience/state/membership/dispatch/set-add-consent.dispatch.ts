// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsent } from '../../../../../models/air/add-consent.response';
import { setAddConsentAction } from '../actions/set-add-consent.action';
import { MembershipDispatch } from './membership.dispatch';

export const setAddConsentDispatch = (
  dispatch: MembershipDispatch,
  addConsent: IAddConsent
): void => dispatch(setAddConsentAction(addConsent));
