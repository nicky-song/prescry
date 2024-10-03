// Copyright 2022 Prescryptive Health, Inc.

import { ISmartPriceScreenCMSContent } from '../../models/cms-content/smart-price-screen.cms-content';
import { ISmartPriceScreenContent } from '../../experiences/guest-experience/smart-price-screen/smart-price-screen.ui-content.model';

export const mapSmartPriceScreenContent = (
  uiContent: ISmartPriceScreenCMSContent
): ISmartPriceScreenContent => {
  return {
    startSavingTodayLabel: uiContent.startSavingToday,
    showYourPharmacistLabel: uiContent.showYourPharmacist,
    showYourPharmacistContent: uiContent.showYourPharmacistContent,
    manageMyInformationLabel: uiContent.manageMyInformation,
    digitalIdCard: {
      sieUserHeader: uiContent.smartPriceCardHeader,
      name: uiContent.smartPriceCardName,
      memberId: uiContent.smartPriceCardMemberId,
      group: uiContent.smartPriceCardGroup,
      bin: uiContent.smartPriceCardBin,
      pcn: uiContent.smartPriceCardPcn,
    },
    unauthSmartPriceCard: {
      defaultMessage: uiContent.smartPriceCardDefaultMessage,
      pcnValue: uiContent.smartPriceCardCashPcnValue,
      groupValue: uiContent.smartPriceCardCashGroupValue,
      binValue: uiContent.smartPriceCardCashBinValue,
    },
  };
};
