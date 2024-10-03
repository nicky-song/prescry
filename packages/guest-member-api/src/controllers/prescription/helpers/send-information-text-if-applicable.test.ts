// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { Twilio } from 'twilio';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { sendInformationTextIfApplicable } from './send-information-text-if-applicable';
import { ITextMessageComponents } from './send-text-messages';

jest.mock('twilio');

const mockCreate = jest.fn();
const twilioClientMock = {
  messages: {
    create: mockCreate,
  },
} as unknown as Twilio;

describe('sendInformationTextIfApplicable', () => {
  const personMock = {
    primaryMemberRxId: 'primary-member-rx-id-mock',
    primaryMemberFamilyId: 'primary-member-family-id-mock',
    rxGroup: 'rx-group-mock',
    rxBin: 'rx-bin-mock',
    carrierPCN: 'carrier-pcn-mock',
  } as IPerson;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should not send text message if text destination phone number is not defined', async () => {
    // Arrange
    const phoneNumberMock = undefined;
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: 'information-message-mock',
      contactPhoneNumber: 'contact-phone-number-mock',
      groupNumberText: 'group-number-text-mock',
      pcnText: 'pcn-text-mock',
      memberIdText: 'member-id-text-mock',
      binText: 'bin-text-mock',
      questionsText: 'questions-text-mock',
    };

    // Act
    await sendInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).not.toHaveBeenCalled();
  });

  it('Should not send text message if coupon is not found for the drug', async () => {
    // Arrange
    const phoneNumberMock = 'phone-number-mock';
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: 'information-message-mock',
      contactPhoneNumber: 'contact-phone-number-mock',
      groupNumberText: 'group-number-text-mock',
      pcnText: 'pcn-text-mock',
      memberIdText: 'member-id-text-mock',
      binText: 'bin-text-mock',
      questionsText: 'questions-text-mock',
    };

    // Act
    await sendInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      undefined,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).not.toHaveBeenCalled();
  });

  it('Should not send text message if information message is not found for the drug', async () => {
    // Arrange
    const phoneNumberMock = 'phone-number-mock';
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: undefined,
      contactPhoneNumber: 'contact-phone-number-mock',
      groupNumberText: 'group-number-text-mock',
      pcnText: 'pcn-text-mock',
      memberIdText: 'member-id-text-mock',
      binText: 'bin-text-mock',
      questionsText: 'questions-text-mock',
    };

    // Act
    await sendInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).not.toHaveBeenCalled();
  });

  it('Should not send text message if contact phone number is not found for the drug', async () => {
    // Arrange
    const phoneNumberMock = 'phone-number-mock';
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: 'information-message-mock',
      contactPhoneNumber: undefined,
      groupNumberText: 'group-number-text-mock',
      pcnText: 'pcn-text-mock',
      memberIdText: 'member-id-text-mock',
      binText: 'bin-text-mock',
      questionsText: 'questions-text-mock',
    };

    // Act
    await sendInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).not.toHaveBeenCalled();
  });

  it('Should send text message if phone number is defined, person exists, information message is defined, and contact phone number is defined', async () => {
    // Arrange
    const phoneNumberMock = 'phone-number-mock';
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: 'information-message-mock',
      contactPhoneNumber: 'contact-phone-number-mock',
      groupNumberText: 'group-number-text-mock:',
      pcnText: 'pcn-text-mock:',
      memberIdText: 'member-id-text-mock:',
      binText: 'bin-text-mock:',
      questionsText: 'questions-text-mock?',
    };

    // Act
    await sendInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).toHaveBeenCalledTimes(1);
    expect(twilioClientMock.messages.create).toHaveBeenNthCalledWith(1, {
      to: phoneNumberMock,
      body: `information-message-mock

member-id-text-mock: primary-member-family-id-mock
group-number-text-mock: rx-group-mock
bin-text-mock: rx-bin-mock
pcn-text-mock: carrier-pcn-mock

questions-text-mock? contact-phone-number-mock`,

      from: configurationMock.twilioMessagingFromPhoneNumber,
    });
  });
});
