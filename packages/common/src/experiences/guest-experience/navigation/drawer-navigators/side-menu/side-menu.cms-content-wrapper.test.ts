// Copyright 2022 Prescryptive Health, Inc.

import { ISideMenuContent } from './side-menu.content';
import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { sideMenuCMSContentWrapper } from './side-menu.cms-content-wrapper';

jest.mock('../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('sideMenuCMSContentWrapper', () => {
  const favoritePharmaciesDrawerItemLabelMock =
    'favorite-pharmacies-drawer-item-label-mock';
  const idCardDrawerItemLabelMock = 'id-card-drawer-item-label-mock';
  const benefitPlanDrawerItemLabelMock = 'benefit-plan-drawer-item-label-mock';
  const profileDrawerItemLabelMock = 'profile-drawer-item-label-mock';
  const supportDrawerItemLabelMock = 'support-drawer-item-label-mock';
  const signOutDrawerItemLabelMock = 'sign-out-drawer-item-label-mock';
  const medicineCabinetDrawerItemLabelMock =
    'medicine-cabinet-drawer-item-label-mock';
  const createAccountDrawerItemLabelMock =
    'create-account-drawer-item-label-mock';
  const joinEmployerPlanDrawerItemLabelMock =
    'join-employer-plan-drawer-item-label-mock';
  const contactUsDrawerItemLabelMock = 'contact-us-drawer-item-label-mock';
  const closeButtonAccessibilityLabelMock =
    'close-button-accessibility-label-mock';
  const signInButtonLabelMock = 'sign-in-button-mock';
  const copyRightTextLabelMock = 'copyright-text-mock';
  const termsAndConditionsLabelMock = 't-&-c-mock';
  const privacyPolicyLabelMock = 'privacy-policy-mock';
  const planDeductiblesLabelMock = 'plan-deductibles-label-mock';
  const rightsReservedTextMock = 'rights-reserved-text-mock';
  const languageDrawerItemLabelMock = 'language-drawer-item-label-mock';
  const viewPrescryptiveCardsMock = 'view-prescryptive-cards-mock';

  it('has correct content', () => {
    const sideMenuCMSMock: ISideMenuContent = {
      favoritePharmaciesDrawerItemLabel: favoritePharmaciesDrawerItemLabelMock,
      idCardDrawerItemLabel: idCardDrawerItemLabelMock,
      benefitPlanDrawerItemLabel: benefitPlanDrawerItemLabelMock,
      profileDrawerItemLabel: profileDrawerItemLabelMock,
      supportDrawerItemLabel: supportDrawerItemLabelMock,
      signOutDrawerItemLabel: signOutDrawerItemLabelMock,
      medicineCabinetDrawerItemLabel: medicineCabinetDrawerItemLabelMock,
      createAccountDrawerItemLabel: createAccountDrawerItemLabelMock,
      joinEmployerPlanDrawerItemLabel: joinEmployerPlanDrawerItemLabelMock,
      contactUsDrawerItemLabel: contactUsDrawerItemLabelMock,
      closeButtonAccessibilityLabel: closeButtonAccessibilityLabelMock,
      signInButton: signInButtonLabelMock,
      copyRightText: copyRightTextLabelMock,
      termsAndConditions: termsAndConditionsLabelMock,
      privacyPolicy: privacyPolicyLabelMock,
      planDeductiblesLabel: planDeductiblesLabelMock,
      rightsReservedText: rightsReservedTextMock,
      languageDrawerItemLabel: languageDrawerItemLabelMock,
      viewPrescryptiveCards: viewPrescryptiveCardsMock,
    };

    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.favoritePharmaciesDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.idCardDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.benefitPlanDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.profileDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.supportDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.signOutDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.medicineCabinetDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.createAccountDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.joinEmployerPlanDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.contactUsDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.closeButtonAccessibilityLabel
    );
    findContentValueMock.mockReturnValueOnce(sideMenuCMSMock.signInButton);
    findContentValueMock.mockReturnValueOnce(sideMenuCMSMock.copyRightText);
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.termsAndConditions
    );
    findContentValueMock.mockReturnValueOnce(sideMenuCMSMock.privacyPolicy);
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.planDeductiblesLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.rightsReservedText
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.languageDrawerItemLabel
    );
    findContentValueMock.mockReturnValueOnce(
      sideMenuCMSMock.viewPrescryptiveCards
    );

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
        CmsGroupKey.sideMenu,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = sideMenuCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.sideMenu,
      2
    );

    const expectedFieldKeys = [
      'favorite-pharmacies-drawer-item-label',
      'id-card-drawer-item-label',
      'benefit-plan-drawer-item-label',
      'profile-drawer-item-label',
      'support-drawer-item-label',
      'sign-out-drawer-item-label',
      'medicine-cabinet-drawer-item-label',
      'create-account-drawer-item-label',
      'join-employer-plan-drawer-item-label',
      'contact-us-drawer-item-label',
      'close-button-accessibility-label',
      'sign-in-button-label',
      'copyright-text-label',
      't-&-c-label',
      'privacy-policy-label',
      'plan-deductibles-label',
      'rights-reserved-text',
      'language-drawer-item-label',
      'view-prescryptive-cards',
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

    expect(result).toEqual(sideMenuCMSMock);
  });
});
