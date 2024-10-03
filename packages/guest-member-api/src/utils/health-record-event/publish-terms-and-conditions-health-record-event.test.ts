// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { ApiConstants } from '../../constants/api-constants';
import { IHealthRecordEvent } from '../../models/health-record-event';
import { ITermsAndConditionsAcceptance } from '../../models/platform/patient-account/properties/patient-account-terms-and-conditions';
import { publishHealthRecordEventMessage } from '../service-bus/health-record-event-helper';
import { publishTermsAndConditionsHealthRecordEvent } from './publish-terms-and-conditions-health-record-event';

jest.mock('../service-bus/health-record-event-helper');
const publishHealthRecordEventMessageMock =
  publishHealthRecordEventMessage as jest.Mock;

describe('publishTermsAndConditionsHealthRecordEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    publishHealthRecordEventMessageMock.mockResolvedValue(undefined);
  });

  it('publishes Health Record Event', async () => {
    const phoneNumberMock = 'phone-number';
    const termsAndConditionsAcceptanceMock = {
      allowSmsMessages: true,
    } as ITermsAndConditionsAcceptance;

    await publishTermsAndConditionsHealthRecordEvent(
      termsAndConditionsAcceptanceMock,
      phoneNumberMock
    );

    const expectedHealthRecordEvent: IHealthRecordEvent<ITermsAndConditionsAcceptance> =
      {
        identifiers: [
          { type: 'phoneHash', value: generateSHA512Hash(phoneNumberMock) },
        ],
        createdOn: UTCDate(getNewDate()),
        createdBy: ApiConstants.EVENT_APPLICATION_NAME,
        tags: [],
        eventType: 'patient-t-c-acceptance',
        eventData: termsAndConditionsAcceptanceMock,
      };
    expectToHaveBeenCalledOnceOnlyWith(
      publishHealthRecordEventMessageMock,
      expectedHealthRecordEvent
    );
  });
});
