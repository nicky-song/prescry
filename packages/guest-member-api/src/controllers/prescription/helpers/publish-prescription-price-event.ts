// Copyright 2021 Prescryptive Health, Inc.

import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { ApiConstants } from '../../../constants/api-constants';
import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';
import {
  IPrescriptionPrice,
  IPrescriptionPriceEvent,
} from '../../../models/prescription-price-event';

export const publishPrescriptionPriceEvent = async (
  memberId: string,
  prescriptionPriceInfo: IPrescriptionPrice
) => {
  const date = new Date(Date.now());
  const currentTime = UTCDate(date);
  const prescriptionPriceHealthEventRecord: IPrescriptionPriceEvent = {
    identifiers: [
      {
        type: 'primaryMemberRxId',
        value: memberId,
      },
    ],
    createdOn: currentTime,
    createdBy: ApiConstants.EVENT_APPLICATION_NAME,
    tags: [memberId],
    eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE,
    eventData: prescriptionPriceInfo,
  };

  await publishHealthRecordEventMessage(prescriptionPriceHealthEventRecord);
};
