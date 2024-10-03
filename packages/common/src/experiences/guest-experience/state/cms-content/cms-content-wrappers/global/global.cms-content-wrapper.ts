// Copyright 2021 Prescryptive Health, Inc.

import { IGlobalContent } from '../../../../../../models/cms-content/global.content';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';

export const globalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IGlobalContent => {
  const uiContent = getContent(language, content, CmsGroupKey.global, 2);

  return {
    authSearchButton: findContentValue('auth-home-search-button', uiContent),
    closeDialog: findContentValue('close-dialog', uiContent),
    homeButton: findContentValue('home-button', uiContent),
    learnMore: findContentValue('learn-more', uiContent),
    okButton: findContentValue('ok-button', uiContent),
    privacyPolicy: findContentValue('privacy-policy', uiContent),
    providedBy: findContentValue('provided-by-label', uiContent),
    scrollToTop: findContentValue('scroll-to-top', uiContent),
    seeMore: findContentValue('see-more', uiContent),
    supportLinkedText: findContentValue('support-linked-text', uiContent),
    supportUnlinkedText: findContentValue('support-unlinked-text', uiContent),
    termsAndConditions: findContentValue('t-&-c', uiContent),
    favoriteIconButton: findContentValue('favorite-icon-button', uiContent),
    unfavoriteIconButton: findContentValue('unfavorite-icon-button', uiContent),
    favoritePharmacySaved: findContentValue(
      'favorite-pharmacy-saved',
      uiContent
    ),
    favoritePharmacyUnsaved: findContentValue(
      'favorite-pharmacy-unsaved',
      uiContent
    ),
    newFavoritedPharmaciesFeature: findContentValue(
      'new-favorited-pharmacies-feature',
      uiContent
    ),
    favoriteTagLabel: findContentValue('favorite-tag-label', uiContent),
    favoritingPharmacyError: findContentValue(
      'favoriting-pharmacy-error',
      uiContent
    ),
    unfavoritingPharmacyError: findContentValue(
      'unfavoriting-pharmacy-error',
      uiContent
    ),
    setLanguageError: findContentValue('set-language-error', uiContent),
    bestValueLabel: findContentValue('best-value-label', uiContent),
    homeDeliveryLabel: findContentValue('home-delivery-label', uiContent),
    planSavesTagLabel: findContentValue('plan-saves-tag-label', uiContent),
    memberSavesTagLabel: findContentValue('member-saves-tag-label', uiContent),
    combinationTagLabel: findContentValue('combination-tag-label', uiContent),
    bannerText: findContentValue('banner-text', uiContent),
    welcomeCaption: findContentValue('welcome-caption', uiContent),
    prescryptiveHelp: findContentValue('prescryptive-help', uiContent),
    needHelp: findContentValue('need-help', uiContent),
    contactUs: findContentValue('contact-us', uiContent),
  };
};
