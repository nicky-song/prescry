// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '@phx/common/src/experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage, Language } from '@phx/common/src/models/language';
import { IConfiguration } from '../../../configuration';
import {
  CmsCommunicationFieldKeysEnum,
  cmsCommunicationValueConstants,
} from '../../../constants/cms-communication-content';
import { searchAndCacheCMSContent } from '../../../controllers/content/helpers/search-and-cache-cms-content';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ICMSContentSearchResponse } from '../cms-api-content/get-cms-api-content';
import { getCMSCommunicationContent } from './get-cms-communication-content';

jest.mock('../../../controllers/content/helpers/search-and-cache-cms-content');
const searchAndCacheCMSContentMock = searchAndCacheCMSContent as jest.Mock;

const pbmTextInformationMessageMock = 'pbm-text-information-message-mock';
const cashTextInformationMessageMock = 'cash-text-information-message-mock';
const couponTextInformationMessageMock = 'coupon-text-information-message-mock';
const pbmContactPhoneNumberMock = 'pbm-contact-phone-number-mock';
const cashContactPhoneNumberMock = 'cash-contact-phone-number-mock';
const groupNumberTextMock = 'group-number-text-mock';
const pcnTextMock = 'pcn-text-mock';
const memberIdTextMock = 'member-id-text-mock';
const binTextMock = 'bin-text-mock';
const questionsTextMock = 'questions-text-mock';

const communicationContentResponseMock: ICMSContentSearchResponse = {
  content: [
    {
      fieldKey: CmsCommunicationFieldKeysEnum.pbmTextInformationMessage,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: pbmTextInformationMessageMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.cashTextInformationMessage,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: cashTextInformationMessageMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.couponTextInformationMessage,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: couponTextInformationMessageMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.supportPBMPhone,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: pbmContactPhoneNumberMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.supportCashPhone,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: cashContactPhoneNumberMock,
    },

    {
      fieldKey: CmsCommunicationFieldKeysEnum.groupNumberText,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: groupNumberTextMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.pcnText,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: pcnTextMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.memberIdText,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: memberIdTextMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.binText,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: binTextMock,
    },
    {
      fieldKey: CmsCommunicationFieldKeysEnum.questionsText,
      groupKey: CmsGroupKey.communication,
      language: '',
      type: '',
      value: questionsTextMock,
    },
  ],
};

describe('getCMSCommunicationContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected content', async () => {
    searchAndCacheCMSContentMock.mockReturnValueOnce(
      communicationContentResponseMock
    );
    const expectedContent = {
      pbmTextInformationMessage: pbmTextInformationMessageMock,
      cashTextInformationMessage: cashTextInformationMessageMock,
      couponTextInformationMessage: couponTextInformationMessageMock,
      supportPBMPhone: pbmContactPhoneNumberMock,
      supportCashPhone: cashContactPhoneNumberMock,
      groupNumberText: groupNumberTextMock,
      pcnText: pcnTextMock,
      memberIdText: memberIdTextMock,
      binText: binTextMock,
      questionsText: questionsTextMock,
    };

    const configurationMock = {} as IConfiguration;

    const content = await getCMSCommunicationContent(
      configurationMock,
      undefined
    );
    expect(searchAndCacheCMSContentMock).toHaveBeenCalledWith(
      configurationMock,
      CmsGroupKey.communication,
      defaultLanguage,
      2
    );
    expect(content).toEqual(expectedContent);
  });

  it.each([['English' as Language], ['Spanish' as Language]])(
    'calls PrescriptionController constructor (version: %p)',
    async (language: Language) => {
      searchAndCacheCMSContentMock.mockReturnValueOnce({ content: [] });
      const staticVals = cmsCommunicationValueConstants.get(
        CmsGroupKey.communication
      );
      const expectedContent = {
        pbmTextInformationMessage: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.pbmTextInformationMessage)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        cashTextInformationMessage: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.cashTextInformationMessage)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        couponTextInformationMessage: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.couponTextInformationMessage)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        supportPBMPhone: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.supportPBMPhone)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        supportCashPhone: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.supportCashPhone)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        groupNumberText: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.groupNumberText)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        pcnText: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.pcnText)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        memberIdText: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.memberIdText)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        binText: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.binText)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
        questionsText: staticVals
          ?.get(CmsCommunicationFieldKeysEnum.questionsText)
          ?.find((communicationKey) => communicationKey.language === language)
          ?.text,
      };

      const content = await getCMSCommunicationContent(
        configurationMock,
        language
      );
      expect(searchAndCacheCMSContentMock).toHaveBeenCalledWith(
        configurationMock,
        CmsGroupKey.communication,
        language,
        2
      );
      expect(content).toEqual(expectedContent);
    }
  );
});
