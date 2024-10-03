// Copyright 2022 Prescryptive Health, Inc.

import { ISmartPriceScreenCMSContent } from '../../../../../../models/cms-content/smart-price-screen.cms-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { smartPriceScreenCMSContentWrapper } from './smart-price-screen.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('smartPriceScreenCMSContentWrapper', () => {
  it('should have correct content when field keys exist', () => {
    const smartPriceScreenCMSMock: Partial<ISmartPriceScreenCMSContent> = {
      startSavingToday: 'start-saving-today-value-mock',
      showYourPharmacist: 'show-your-pharmacist-value-mock',
      showYourPharmacistContent: 'show-your-pharmacist-content-value-mock',
      manageMyInformation: 'manage-my-information-value-mock',
      smartPriceCardHeader: 'smart-price-card-header-value-mock',
      smartPriceCardName: 'smart-price-card-name-value-mock',
      smartPriceCardMemberId: 'smart-price-card-member-id-value-mock',
      smartPriceCardGroup: 'smart-price-card-group-value-mock',
      smartPriceCardBin: 'smart-price-card-bin-value-mock',
      smartPriceCardPcn: 'smart-price-card-pcn-value-mock',
      smartPriceCardDefaultMessage:
        'smart-price-card-cash-default-message-mock',
      smartPriceCardCashPcnValue: 'smart-price-card-cash-pcn-value-mock',
      smartPriceCardCashGroupValue: 'smart-price-card-cash-group-value-mock',
      smartPriceCardCashBinValue: 'smart-price-card-cash-bin-value-mock',
    };
    const smartPriceVals = Object.values(smartPriceScreenCMSMock);

    smartPriceVals.forEach((val) => {
      findContentValueMock.mockReturnValueOnce(val);
    });

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.smartPriceScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = smartPriceScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.smartPriceScreen,
      2
    );

    const expectedFieldKeys = [
      'start-saving-today',
      'show-your-pharmacist',
      'show-your-pharmacist-content',
      'manage-my-information',
      'smart-price-card-header',
      'smart-price-card-name',
      'smart-price-card-member-id',
      'smart-price-card-group',
      'smart-price-card-bin',
      'smart-price-card-pcn',
      'smart-price-card-default-message',
      'smart-price-card-cash-pcn-value',
      'smart-price-card-cash-group-value',
      'smart-price-card-cash-bin-value',
    ];
    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(smartPriceScreenCMSMock);
  });
});
