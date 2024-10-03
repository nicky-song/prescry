// Copyright 2022 Prescryptive Health, Inc.

import { ISmartPriceScreenContent } from '../../experiences/guest-experience/smart-price-screen/smart-price-screen.ui-content.model';
import { ISmartPriceScreenCMSContent } from '../../models/cms-content/smart-price-screen.cms-content';
import { mapSmartPriceScreenContent } from './map-smart-price-screen-content.helper';

const smartPriceScreenCMSMock: ISmartPriceScreenCMSContent = {
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
  smartPriceCardDefaultMessage: 'smart-price-card-cash-default-message-mock',
  smartPriceCardCashPcnValue: 'smart-price-card-cash-pcn-value-mock',
  smartPriceCardCashGroupValue: 'smart-price-card-cash-group-value-mock',
  smartPriceCardCashBinValue: 'smart-price-card-cash-bin-value-mock',
};

describe('mapSmartPriceScreenContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedSmartPriceScreenContentMock: ISmartPriceScreenContent = {
      startSavingTodayLabel: smartPriceScreenCMSMock.startSavingToday,
      showYourPharmacistLabel: smartPriceScreenCMSMock.showYourPharmacist,
      showYourPharmacistContent:
        smartPriceScreenCMSMock.showYourPharmacistContent,
      manageMyInformationLabel: smartPriceScreenCMSMock.manageMyInformation,
      digitalIdCard: {
        sieUserHeader: smartPriceScreenCMSMock.smartPriceCardHeader,
        name: smartPriceScreenCMSMock.smartPriceCardName,
        memberId: smartPriceScreenCMSMock.smartPriceCardMemberId,
        group: smartPriceScreenCMSMock.smartPriceCardGroup,
        bin: smartPriceScreenCMSMock.smartPriceCardBin,
        pcn: smartPriceScreenCMSMock.smartPriceCardPcn,
      },
      unauthSmartPriceCard: {
        defaultMessage: smartPriceScreenCMSMock.smartPriceCardDefaultMessage,
        pcnValue: smartPriceScreenCMSMock.smartPriceCardCashPcnValue,
        groupValue: smartPriceScreenCMSMock.smartPriceCardCashGroupValue,
        binValue: smartPriceScreenCMSMock.smartPriceCardCashBinValue,
      },
    };

    const result = mapSmartPriceScreenContent(smartPriceScreenCMSMock);

    expect(result).toEqual(expectedSmartPriceScreenContentMock);
  });
});
