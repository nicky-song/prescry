// Copyright 2018 Prescryptive Health, Inc.

import {
  ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
  ACTION_FINISH_PHONE_NUMBER_VERIFICATION,
  ACTION_CREATE_PERSON,
  ACTION_UPDATE_PERSON,
} from '../../constants/service-bus-actions';

import {
  publishPersonCreateMessage,
  publishPersonUpdateAddressMessage,
  publishPersonUpdateMessage,
  publishPhoneNumberVerificationMessage,
  publishUpdatePersonContactInformationMessage,
  publishPersonUpdatePatientDetailsMessage,
} from './person-update-helper';
import { initializeServiceBus } from './service-bus-helper';
import { IPerson } from '@phx/common/src/models/person';

const mockServiceBusClientClose = jest.fn();
const mockTopicClientClose = jest.fn();
const mockSend = jest.fn();
const mockCreateSender = jest.fn();
const mockCreateTopicClient = jest.fn();

const mockIdentifier = 'mock-identifier';
const mockPhoneNumber = 'mock-phoneNumber';

jest.mock('@azure/service-bus', () => ({
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockImplementation(() => {
      return {
        close: mockServiceBusClientClose,
        createTopicClient: mockCreateTopicClient.mockImplementation(() => {
          return {
            close: mockTopicClientClose,
            createSender: mockCreateSender.mockImplementation(() => {
              return {
                send: mockSend.mockReturnValue('send'),
              };
            }),
          };
        }),
      };
    }),
  },
}));

beforeEach(() => {
  mockSend.mockReset();
});

beforeAll(() => {
  const mockConnectionString = 'mock-connection-string';
  const mockUpdatePersonTopicName = 'mock-topic';
  const mockAccountTopicName = 'mock-account-topic';
  const mockHealthEventTopicName = 'mock-health-event-topic';
  const mockAppointmentCancelledEventTopicName =
    'mock-appointment-cancelled-event-topic';
  const mockCommonBusinessTopic = 'mock-common-business-topic';
  const mockCommonMonitoringEvent = 'mock-common-monitoring-topic';

  initializeServiceBus(
    mockConnectionString,
    mockUpdatePersonTopicName,
    mockAccountTopicName,
    mockHealthEventTopicName,
    mockAppointmentCancelledEventTopicName,
    mockCommonBusinessTopic,
    mockCommonMonitoringEvent
  );
});

describe('publishPersonUpdateMessage', () => {
  it('should calls send() with PersonUpdate in body', async () => {
    const mockEmail = 'mock-email';
    await publishPersonUpdateMessage(ACTION_UPDATE_PERSON_CONTACT_INFORMATION, {
      email: mockEmail,
      identifier: mockIdentifier,
      phoneNumber: mockPhoneNumber,
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
        person: {
          email: mockEmail,
          identifier: mockIdentifier,
          phoneNumber: mockPhoneNumber,
        },
      },
    });
  });
});

describe('publishPhoneNumberVerificationMessage() ', () => {
  it('should calls send() with message body', async () => {
    await publishPhoneNumberVerificationMessage(
      mockIdentifier,
      mockPhoneNumber
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_FINISH_PHONE_NUMBER_VERIFICATION,
        person: {
          identifier: 'mock-identifier',
          phoneNumber: 'mock-phoneNumber',
          recentlyUpdated: true,
          updatedFields: ['phoneNumber'],
        },
      },
    });
  });
});

describe('publishUpdatePersonContactInformationMessage', () => {
  it('should calls send() with PersonUpdate in body and secondaryAlertChildCareTakerIdentifier if isAdult flag is false', async () => {
    const mockEmail = 'mock-email';
    await publishUpdatePersonContactInformationMessage(
      mockIdentifier,
      'secondaryMemberIdentifier',
      false,
      mockPhoneNumber,
      mockEmail
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
        person: {
          email: 'mock-email',
          identifier: 'mock-identifier',
          phoneNumber: 'mock-phoneNumber',
          secondaryAlertChildCareTakerIdentifier: 'secondaryMemberIdentifier',
        },
      },
    });
  });

  it('should calls send() with PersonUpdate in body and secondaryAlertCarbonCopyIdentifier if isAdult flag is true', async () => {
    const mockEmail = 'mock-email';
    await publishUpdatePersonContactInformationMessage(
      mockIdentifier,
      'secondaryMemberIdentifier',
      true,
      mockPhoneNumber,
      mockEmail
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
        person: {
          email: 'mock-email',
          identifier: 'mock-identifier',
          phoneNumber: 'mock-phoneNumber',
          secondaryAlertCarbonCopyIdentifier: 'secondaryMemberIdentifier',
        },
      },
    });
  });
});

describe('publishPersonUpdateAddressMessage', () => {
  it('should calls send() with address values in body', async () => {
    await publishPersonUpdateAddressMessage(
      mockIdentifier,
      'address1',
      '',
      'city',
      'state',
      '99999',
      'county'
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_UPDATE_PERSON,
        person: {
          identifier: 'mock-identifier',
          address1: 'address1',
          address2: '',
          city: 'city',
          state: 'state',
          zip: '99999',
          county: 'county',
          recentlyUpdated: true,
          updatedFields: [
            'address1',
            'address2',
            'city',
            'state',
            'zip',
            'county',
          ],
        },
      },
    });
  });
});

describe('publishPersonCreateMessage', () => {
  it('should calls send() with CreatePerson action in body', async () => {
    const personMock: IPerson = {
      dateOfBirth: '1990-01-01',
      email: 'mockEmail',
      firstName: 'John',
      identifier: '',
      isPhoneNumberVerified: true,
      isPrimary: true,
      lastName: 'mockLastName',
      phoneNumber: 'mockPhoneNumber',
      primaryMemberFamilyId: 'family-id',
      primaryMemberPersonCode: 'person-code-id1',
      primaryMemberRxId: 'mock-id1',
      rxGroupType: 'CASH',
      rxGroup: 'group1',
      rxBin: 'rx-bin',
      carrierPCN: 'pcn',
    };
    await publishPersonCreateMessage(personMock);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_CREATE_PERSON,
        person: personMock,
      },
    });
  });

  describe('publishPersonUpdateMasterIdMessage', () => {
    it('should calls send() with masterId & accountId in body', async () => {
      await publishPersonUpdatePatientDetailsMessage(
        mockIdentifier,
        'master-id',
        'account-id'
      );
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith({
        body: {
          action: ACTION_UPDATE_PERSON,
          person: {
            identifier: 'mock-identifier',
            masterId: 'master-id',
            accountId: 'account-id',
          },
        },
      });
    });
  });
});
