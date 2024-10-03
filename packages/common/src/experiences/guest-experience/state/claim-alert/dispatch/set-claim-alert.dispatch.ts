// Copyright 2022 Prescryptive Health, Inc.pharmacy

import { ClaimAlertDispatch } from './claim-alert.dispatch';
import { setClaimAlertAction } from '../actions/set-claim-alert.action';
import { IAlternativeMedication } from '../../../../../models/alternative-medication';
import { IPrescribedMedication } from '../../../../../models/prescribed-medication';
import { IContactInfo } from '../../../../../models/contact-info';
import { ClaimNotification } from '../../../../../utils/api-helpers/build-mock-claim-alert-args';

export const setClaimAlertDispatch = (
  dispatch: ClaimAlertDispatch,
  prescribedMedication?: IPrescribedMedication,
  alternativeMedicationList?: IAlternativeMedication[],
  pharmacyInfo?: IContactInfo,
  notificationType?: ClaimNotification,
  prescriber?: Pick<IContactInfo, 'name' | 'phone'>
) => {
  dispatch(
    setClaimAlertAction(
      prescribedMedication,
      alternativeMedicationList,
      pharmacyInfo,
      notificationType,
      prescriber
    )
  );
};
