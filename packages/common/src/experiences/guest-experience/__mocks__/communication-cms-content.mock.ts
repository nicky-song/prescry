// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../models/ui-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';

export const uiContentGroupMapMock = {
  content: [
    {
      fieldKey: 'support-cash-phone',
      language: 'English',
      type: 'text',
      value: 'support-cash-phone-mock',
    },
    {
      fieldKey: 'support-pbm-phone',
      language: 'English',
      type: 'text',
      value: 'support-pbm-phone-text-mock',
    },
    {
      fieldKey: 'pbm-text-information-message',
      language: 'English',
      type: 'text',
      value: 'pbm-text-information-message-mock',
    },
    {
      fieldKey: 'cash-text-information-message',
      language: 'English',
      type: 'text',
      value: 'cash-text-information-message-mock',
    },
    {
      fieldKey: 'coupon-text-information-message',
      language: 'English',
      type: 'text',
      value: 'coupon-text-information-message-mock',
    },
  ],
  lastUpdated: 0,
  isContentLoading: true,
};

export const cmsContentWithCommunicationMock: Map<string, IUIContentGroup> =
  new Map([[CmsGroupKey.communication, uiContentGroupMapMock]]);
