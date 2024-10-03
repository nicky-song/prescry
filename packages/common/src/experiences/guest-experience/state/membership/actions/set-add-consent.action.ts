// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsent } from '../../../../../models/air/add-consent.response';
import { IMembershipAction } from './membership.action';

export type ISetAddConsentAction = IMembershipAction<'SET_ADD_CONSENT'>;

export const setAddConsentAction = (
  addConsent: IAddConsent
): ISetAddConsentAction => ({
  payload: { addConsent },
  type: 'SET_ADD_CONSENT',
});
