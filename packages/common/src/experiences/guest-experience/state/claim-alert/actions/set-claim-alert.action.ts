// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from '../../../../../models/alternative-medication';
import { IContactInfo } from '../../../../../models/contact-info';
import { IPrescribedMedication } from '../../../../../models/prescribed-medication';
import { ClaimNotification } from '../../../../../utils/api-helpers/build-mock-claim-alert-args';
import { IClaimAlertAction } from './claim-alert.action';

export type ISetClaimAlertAction = IClaimAlertAction<'SET_CLAIM_ALERT'>;

export const setClaimAlertAction = (
  prescribedMedication?: IPrescribedMedication,
  alternativeMedicationList?: IAlternativeMedication[],
  pharmacyInfo?: IContactInfo,
  notificationType?: ClaimNotification,
  prescriber?: Pick<IContactInfo, 'name' | 'phone'>
): ISetClaimAlertAction => ({
  type: 'SET_CLAIM_ALERT',
  payload: {
    prescribedMedication,
    alternativeMedicationList,
    pharmacyInfo,
    notificationType,
    prescriber,
  },
});
