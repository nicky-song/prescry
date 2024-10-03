// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from '../../../../models/alternative-medication';
import { IContactInfo } from '../../../../models/contact-info';
import { IPrescribedMedication } from '../../../../models/prescribed-medication';
import { ClaimNotification } from '../../../../utils/api-helpers/build-mock-claim-alert-args';

export interface IClaimAlertState {
  prescribedMedication?: IPrescribedMedication;
  alternativeMedicationList?: IAlternativeMedication[];
  pharmacyInfo?: IContactInfo;
  notificationType?: ClaimNotification;
  prescriber?: Pick<IContactInfo, 'name' | 'phone'>;
}

export const defaultClaimAlertState: IClaimAlertState = {};
