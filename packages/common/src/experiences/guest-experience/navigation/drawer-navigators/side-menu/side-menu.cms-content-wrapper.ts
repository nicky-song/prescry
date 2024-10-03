// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { ISideMenuContent } from './side-menu.content';

export const sideMenuCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISideMenuContent => {
  const uiContent = getContent(language, content, CmsGroupKey.sideMenu, 2);

  return {
    favoritePharmaciesDrawerItemLabel: findContentValue(
      'favorite-pharmacies-drawer-item-label',
      uiContent
    ),
    idCardDrawerItemLabel: findContentValue(
      'id-card-drawer-item-label',
      uiContent
    ),
    benefitPlanDrawerItemLabel: findContentValue(
      'benefit-plan-drawer-item-label',
      uiContent
    ),
    profileDrawerItemLabel: findContentValue(
      'profile-drawer-item-label',
      uiContent
    ),
    supportDrawerItemLabel: findContentValue(
      'support-drawer-item-label',
      uiContent
    ),
    signOutDrawerItemLabel: findContentValue(
      'sign-out-drawer-item-label',
      uiContent
    ),
    medicineCabinetDrawerItemLabel: findContentValue(
      'medicine-cabinet-drawer-item-label',
      uiContent
    ),
    createAccountDrawerItemLabel: findContentValue(
      'create-account-drawer-item-label',
      uiContent
    ),
    joinEmployerPlanDrawerItemLabel: findContentValue(
      'join-employer-plan-drawer-item-label',
      uiContent
    ),
    contactUsDrawerItemLabel: findContentValue(
      'contact-us-drawer-item-label',
      uiContent
    ),
    closeButtonAccessibilityLabel: findContentValue(
      'close-button-accessibility-label',
      uiContent
    ),
    signInButton: findContentValue('sign-in-button-label', uiContent),
    copyRightText: findContentValue('copyright-text-label', uiContent),
    termsAndConditions: findContentValue('t-&-c-label', uiContent),
    privacyPolicy: findContentValue('privacy-policy-label', uiContent),
    planDeductiblesLabel: findContentValue('plan-deductibles-label', uiContent),
    rightsReservedText: findContentValue('rights-reserved-text', uiContent),
    languageDrawerItemLabel: findContentValue(
      'language-drawer-item-label',
      uiContent
    ),
    viewPrescryptiveCards: findContentValue(
      'view-prescryptive-cards',
      uiContent
    ),
  };
};
