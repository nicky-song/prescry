// Copyright 2021 Prescryptive Health, Inc.

import { IHealthRecordEvent } from '../../../models/health-record-event';

import { IBrokerReferralEvent } from '../../../models/broker-referral-event';
import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';

import { publishBrokerReferralEvent } from './publish-broker-referral-event';

jest.mock('../../../utils/service-bus/health-record-event-helper');
const publishHealthRecordEventMessageMock =
  publishHealthRecordEventMessage as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('publishBrokerReferralEvent', () => {
  it('should create referral healthrecord event', async () => {
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1592961686000);
    const healthRecordEventMock = {
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 1592961686,
      createdBy: 'rxassistant-api',
      tags: ['member-id'],
      eventType: 'referral/broker',
      eventData: {
        memberId: 'member-id',
        brokerId: 'broker-id',
        date: new Date('2020-06-24T01:21:26.000Z'),
      },
    } as IHealthRecordEvent<IBrokerReferralEvent>;

    await publishBrokerReferralEvent('member-id', 'broker-id');
    dateNowSpyMock.mockRestore();
    expect(publishHealthRecordEventMessageMock).toBeCalledWith(
      healthRecordEventMock
    );
  });
});
