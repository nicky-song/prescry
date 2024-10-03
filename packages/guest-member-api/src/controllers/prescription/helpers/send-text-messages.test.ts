// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { sendInformationTextIfApplicable } from './send-information-text-if-applicable';
import { sendCouponInformationTextIfApplicable } from './send-coupon-information-text-if-applicable';
import { getCMSCommunicationContent } from '../../../utils/external-api/cms-communication-content/get-cms-communication-content';
import { ITextMessageComponents, sendTextMessages } from './send-text-messages';
import { IConfiguration } from '../../../configuration';
import { Twilio } from 'twilio';
import { IPerson } from '@phx/common/src/models/person';
import { ICoupon } from '../../../models/coupon';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { Language, LanguageCode } from '@phx/common/src/models/language';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { EndpointVersion } from '../../../models/endpoint-version';

jest.mock('../helpers/send-information-text-if-applicable');
const sendInformationTextIfApplicableMock =
  sendInformationTextIfApplicable as jest.Mock;

jest.mock('../helpers/send-coupon-information-text-if-applicable');
const sendCouponInformationTextIfApplicableMock =
  sendCouponInformationTextIfApplicable as jest.Mock;

void sendInformationTextIfApplicableMock;
void sendCouponInformationTextIfApplicableMock;
void sendInformationTextIfApplicableMock;

jest.mock(
  '../../../utils/external-api/cms-communication-content/get-cms-communication-content'
);
const getCMSCommunicationContentMock = getCMSCommunicationContent as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

const phoneNumberMock = 'phone-number-mock';
const primaryMemberRxIdMock = 'primary-member-rx-id-mock';
const configurationMock = {} as IConfiguration;
const twilioClientMock = {} as Twilio;
const responseMock = {} as Response;
const personListMockSIE = [
  {
    phoneNumber: phoneNumberMock,
    primaryMemberRxId: primaryMemberRxIdMock,
    rxGroupType: RxGroupTypesEnum.SIE,
  } as IPerson,
];
const personListMockCASH = [
  {
    phoneNumber: phoneNumberMock,
    primaryMemberRxId: primaryMemberRxIdMock,
    rxGroupType: RxGroupTypesEnum.CASH,
  } as IPerson,
];
const isMock1 = true;
const isMock2 = undefined;
const couponMock1 = {} as ICoupon;
const couponMock2 = undefined;

const pbmTextInformationMessageMock = 'pbm-text-information-message-mock';
const cashTextInformationMessageMock = 'cash-text-information-message-mock';
const couponTextInformationMessageMock = 'coupon-text-information-message-mock';
const supportPBMPhoneMock = 'support-pbm-phone-mock';
const supportCashPhoneMock = 'support-cash-phone-mock';
const groupNumberTextMock = 'group-number-text-mock';
const pcnTextMock = 'pcn-text-mock';
const memberIdTextMock = 'member-id-text-mock';
const binTextMock = 'bin-text-mock';
const questionsTextMock = 'questions-text-mock';

const textMessagePartialComponents: Partial<ITextMessageComponents> = {
  groupNumberText: groupNumberTextMock,
  pcnText: pcnTextMock,
  memberIdText: memberIdTextMock,
  binText: binTextMock,
  questionsText: questionsTextMock,
};

describe('sendTextMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCMSCommunicationContentMock.mockReturnValue({
      pbmTextInformationMessage: pbmTextInformationMessageMock,
      cashTextInformationMessage: cashTextInformationMessageMock,
      couponTextInformationMessage: couponTextInformationMessageMock,
      supportPBMPhone: supportPBMPhoneMock,
      supportCashPhone: supportCashPhoneMock,
      groupNumberText: groupNumberTextMock,
      pcnText: pcnTextMock,
      memberIdText: memberIdTextMock,
      binText: binTextMock,
      questionsText: questionsTextMock,
    });
  });

  it.each([
    [undefined, 'en' as LanguageCode, 'English' as Language],
    ['v1' as EndpointVersion, 'en' as LanguageCode, 'English' as Language],
    ['v2' as EndpointVersion, 'en' as LanguageCode, 'English' as Language],
    [undefined, 'es' as LanguageCode, 'Spanish' as Language],
    ['v1' as EndpointVersion, 'es' as LanguageCode, 'Spanish' as Language],
    ['v2' as EndpointVersion, 'es' as LanguageCode, 'Spanish' as Language],
  ])(
    'calls getCMSCommunicationContent with correct parameters (versionMock: %p; languageCodeMock: %p; languageMock: %p)',
    async (
      versionMock: EndpointVersion | undefined,
      languageCodeMock: LanguageCode,
      languageMock: Language
    ) => {
      if (versionMock === 'v2') {
        getRequiredResponseLocalMock.mockReturnValue({
          userPreferences: { language: languageCodeMock },
        });
      } else {
        getRequiredResponseLocalMock.mockReturnValue({
          languageCode: languageCodeMock,
        });
      }
      await sendTextMessages(
        configurationMock,
        twilioClientMock,
        responseMock,
        isMock2,
        couponMock1,
        personListMockSIE[0],
        versionMock
      );

      expect(getCMSCommunicationContentMock).toHaveBeenCalledTimes(1);
      expect(getCMSCommunicationContentMock).toHaveBeenNthCalledWith(
        1,
        configurationMock,
        languageMock
      );
    }
  );

  it('sends mock PBM message as expected', async () => {
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: pbmTextInformationMessageMock,
      contactPhoneNumber: supportPBMPhoneMock,
      ...textMessagePartialComponents,
    };

    await sendTextMessages(
      configurationMock,
      twilioClientMock,
      responseMock,
      isMock1,
      couponMock1,
      personListMockSIE[0]
    );

    expect(sendInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personListMockSIE[0],
      textMessageComponentsMock
    );
    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenCalledTimes(0);
  });

  it('sends mock CASH + Coupon message as expected', async () => {
    const textMessageCashComponentsMock: ITextMessageComponents = {
      informationMessage: cashTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };
    const textMessageCouponComponentsMock: ITextMessageComponents = {
      informationMessage: couponTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };

    await sendTextMessages(
      configurationMock,
      twilioClientMock,
      responseMock,
      isMock1,
      couponMock1,
      personListMockCASH[0]
    );

    expect(sendInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personListMockCASH[0],
      textMessageCashComponentsMock
    );

    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      {
        GroupNumber: 'group-number-mock',
        PCN: 'pcn-mock',
        MemberId: 'member-id-mock',
        BIN: 'bin-mock',
      } as ICoupon,
      textMessageCouponComponentsMock
    );
  });

  it('sends PBM message as expected', async () => {
    const textMessageComponentsMock: ITextMessageComponents = {
      informationMessage: pbmTextInformationMessageMock,
      contactPhoneNumber: supportPBMPhoneMock,
      ...textMessagePartialComponents,
    };

    await sendTextMessages(
      configurationMock,
      twilioClientMock,
      responseMock,
      isMock2,
      couponMock1,
      personListMockSIE[0]
    );

    expect(sendInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personListMockSIE[0],
      textMessageComponentsMock
    );
    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenCalledTimes(0);
  });

  it('sends CASH message as expected', async () => {
    const textMessageCashComponentsMock: ITextMessageComponents = {
      informationMessage: cashTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };
    const textMessageCouponComponentsMock: ITextMessageComponents = {
      informationMessage: couponTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };

    await sendTextMessages(
      configurationMock,
      twilioClientMock,
      responseMock,
      isMock2,
      couponMock2,
      personListMockCASH[0]
    );

    expect(sendInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personListMockCASH[0],
      textMessageCashComponentsMock
    );

    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock2,
      textMessageCouponComponentsMock
    );
  });

  it('sends CASH + Coupon message as expected', async () => {
    const textMessageCashComponentsMock: ITextMessageComponents = {
      informationMessage: cashTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };
    const textMessageCouponComponentsMock: ITextMessageComponents = {
      informationMessage: couponTextInformationMessageMock,
      contactPhoneNumber: supportCashPhoneMock,
      ...textMessagePartialComponents,
    };

    await sendTextMessages(
      configurationMock,
      twilioClientMock,
      responseMock,
      isMock2,
      couponMock1,
      personListMockCASH[0]
    );

    expect(sendInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      personListMockCASH[0],
      textMessageCashComponentsMock
    );

    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenCalledTimes(1);
    expect(sendCouponInformationTextIfApplicableMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      phoneNumberMock,
      couponMock1,
      textMessageCouponComponentsMock
    );
  });
});
