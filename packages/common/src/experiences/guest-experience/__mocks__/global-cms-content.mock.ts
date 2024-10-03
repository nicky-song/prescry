// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../models/ui-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';

export const uiContentGroupMapMock = {
  content: [
    {
      fieldKey: 'learn-more',
      language: 'English',
      type: 'text',
      value: 'learn-more-text-mock',
    },
    {
      fieldKey: 'privacy-policy',
      language: 'English',
      type: 'text',
      value: 'privacy-policy-text-mock',
    },
    {
      fieldKey: 'support-linked-text',
      language: 'English',
      type: 'text',
      value: 'support-linked-text-mock',
    },
    {
      fieldKey: 'support-unlinked-text',
      language: 'English',
      type: 'text',
      value: 'support-unlinked-text-mock',
    },
    {
      fieldKey: 't-&-c',
      language: 'English',
      type: 'text',
      value: 'terms-and-conditions-text-mock',
    },
    {
      fieldKey: 'auth-home-search-button',
      language: 'English',
      type: 'text',
      value: 'auth-home-search-button-mock',
    },
    {
      fieldKey: 'ok-button',
      language: 'English',
      type: 'text',
      value: 'ok-button-mock',
    },
    {
      fieldKey: 'favorite-icon-button',
      language: 'English',
      type: 'text',
      value: 'favorite-icon-button-mock',
    },
    {
      fieldKey: 'unfavorite-icon-button',
      language: 'English',
      type: 'text',
      value: 'unfavorite-icon-button-mock',
    },
    {
      fieldKey: 'favorite-pharmacy-saved',
      language: 'English',
      type: 'text',
      value: 'favorite-pharmacy-saved-mock',
    },
    {
      fieldKey: 'favorite-pharmacy-unsaved',
      language: 'English',
      type: 'text',
      value: 'favorite-pharmacy-unsaved-mock',
    },
    {
      fieldKey: 'new-favorited-pharmacies-feature',
      language: 'English',
      type: 'text',
      value: 'new-favorited-pharmacies-feature-mock',
    },
    {
      fieldKey: 'favorite-tag-label',
      language: 'English',
      type: 'text',
      value: 'favorite-tag-label-mock',
    },
    {
      fieldKey: 'favoriting-pharmacy-error',
      language: 'English',
      type: 'text',
      value: 'favoriting-pharmacy-error-mock',
    },
    {
      fieldKey: 'unfavoriting-pharmacy-error',
      language: 'English',
      type: 'text',
      value: 'unfavoriting-pharmacy-error-mock',
    },
    {
      fieldKey: 'set-language-error',
      language: 'English',
      type: 'text',
      value: 'set-language-error-mock',
    },
    {
      fieldKey: 'best-value-label',
      language: 'English',
      type: 'text',
      value: 'best-value-label-mock',
    },
    {
      fieldKey: 'home-delivery-label',
      language: 'English',
      type: 'text',
      value: 'home-delivery-label-mock',
    },
    {
      fieldKey: 'plan-saves-tag-label',
      language: 'English',
      type: 'text',
      value: 'plan-saves-tag-label-mock',
    },
    {
      fieldKey: 'member-saves-tag-label',
      language: 'English',
      type: 'text',
      value: 'member-saves-tag-label-mock',
    },
    {
      fieldKey: 'combination-tag-label',
      language: 'English',
      type: 'text',
      value: 'combination-tag-label-mock',
    },
    {
      fieldKey: 'prescryptive-help',
      language: 'English',
      type: 'text',
      value: 'prescryptive-help-mock',
    },
  ],
  lastUpdated: 0,
  isContentLoading: true,
};

export const cmsContentWithGlobalMock: Map<string, IUIContentGroup> = new Map([
  [CmsGroupKey.global, uiContentGroupMapMock],
]);
