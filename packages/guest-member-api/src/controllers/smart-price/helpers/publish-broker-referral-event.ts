// Copyright 2021 Prescryptive Health, Inc.

import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { IHealthRecordEvent } from '../../../models/health-record-event';
import { ApiConstants } from '../../../constants/api-constants';
import { IBrokerReferralEvent } from '../../../models/broker-referral-event';
import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';

export const publishBrokerReferralEvent = async (
  memberId: string,
  brokerId: string
) => {
  const date = new Date(Date.now());
  const currentTime = UTCDate(date);
  const referralHealthEventRecord: IHealthRecordEvent<IBrokerReferralEvent> = {
    identifiers: [
      {
        type: 'primaryMemberRxId',
        value: memberId,
      },
    ],
    createdOn: currentTime,
    createdBy: ApiConstants.EVENT_APPLICATION_NAME,
    tags: [memberId],
    eventType: ApiConstants.BROKER_REFERRAL_EVENT_TYPE,
    eventData: {
      brokerId,
      memberId,
      date,
    },
  };

  await publishHealthRecordEventMessage(referralHealthEventRecord);
};
