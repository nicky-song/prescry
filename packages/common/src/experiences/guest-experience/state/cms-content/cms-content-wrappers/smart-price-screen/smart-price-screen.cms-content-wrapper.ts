// Copyright 2022 Prescryptive Health, Inc.

import { ISmartPriceScreenCMSContent } from '../../../../../../models/cms-content/smart-price-screen.cms-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const smartPriceScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISmartPriceScreenCMSContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.smartPriceScreen,
    2
  );

  return {
    startSavingToday: findContentValue('start-saving-today', uiContent),
    showYourPharmacist: findContentValue('show-your-pharmacist', uiContent),
    showYourPharmacistContent: findContentValue(
      'show-your-pharmacist-content',
      uiContent
    ),
    manageMyInformation: findContentValue('manage-my-information', uiContent),
    smartPriceCardHeader: findContentValue(
      'smart-price-card-header',
      uiContent
    ),
    smartPriceCardName: findContentValue('smart-price-card-name', uiContent),
    smartPriceCardMemberId: findContentValue(
      'smart-price-card-member-id',
      uiContent
    ),
    smartPriceCardGroup: findContentValue('smart-price-card-group', uiContent),
    smartPriceCardBin: findContentValue('smart-price-card-bin', uiContent),
    smartPriceCardPcn: findContentValue('smart-price-card-pcn', uiContent),
    smartPriceCardDefaultMessage: findContentValue(
      'smart-price-card-default-message',
      uiContent
    ),
    smartPriceCardCashPcnValue: findContentValue(
      'smart-price-card-cash-pcn-value',
      uiContent
    ),
    smartPriceCardCashGroupValue: findContentValue(
      'smart-price-card-cash-group-value',
      uiContent
    ),
    smartPriceCardCashBinValue: findContentValue(
      'smart-price-card-cash-bin-value',
      uiContent
    ),
  };
};
