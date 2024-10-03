// Copyright 2021 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { sendCouponInformationTextIfApplicable } from './send-coupon-information-text-if-applicable';
import { couponMock } from '../../../mock-data/coupon.mock';
import { ITextMessageComponents } from './send-text-messages';

jest.mock('twilio');

const mockCreate = jest.fn();
const twilioClientMock = {
  messages: {
    create: mockCreate,
  },
} as unknown as Twilio;

describe('sendCouponInformationTextIfApplicable', () => {
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
    await sendCouponInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock,
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
    await sendCouponInformationTextIfApplicable(
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
    await sendCouponInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock,
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
    await sendCouponInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).not.toHaveBeenCalled();
  });

  it('Should send text message if phone number is defined and a coupon exists', async () => {
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
    await sendCouponInformationTextIfApplicable(
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock,
      textMessageComponentsMock
    );

    // Assert
    expect(twilioClientMock.messages.create).toHaveBeenCalledTimes(1);
    expect(twilioClientMock.messages.create).toHaveBeenNthCalledWith(1, {
      to: phoneNumberMock,
      body: `information-message-mock

group-number-text-mock: EC95001001
pcn-text-mock: CN
member-id-text-mock: 58685267102
bin-text-mock: 004682

questions-text-mock? contact-phone-number-mock`,

      from: configurationMock.twilioMessagingFromPhoneNumber,
    });
  });
});
