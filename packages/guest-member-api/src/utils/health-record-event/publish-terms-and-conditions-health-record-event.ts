// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { ApiConstants } from '../../constants/api-constants';
import { IHealthRecordEvent } from '../../models/health-record-event';
import { ITermsAndConditionsAcceptance } from '../../models/platform/patient-account/properties/patient-account-terms-and-conditions';
import { publishHealthRecordEventMessage } from '../service-bus/health-record-event-helper';

export const publishTermsAndConditionsHealthRecordEvent = async (
  termsAndConditionsAcceptance: ITermsAndConditionsAcceptance,
  phoneNumber: string
): Promise<void> => {
  const healthRecordEvent: IHealthRecordEvent<ITermsAndConditionsAcceptance> = {
    identifiers: [
      { type: 'phoneHash', value: generateSHA512Hash(phoneNumber) },
    ],
    createdOn: UTCDate(getNewDate()),
    createdBy: ApiConstants.EVENT_APPLICATION_NAME,
    tags: [],
    eventType: 'patient-t-c-acceptance',
    eventData: termsAndConditionsAcceptance,
  };
  await publishHealthRecordEventMessage(healthRecordEvent);
};
