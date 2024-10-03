// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../models/ui-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';

export const uiContentGroupMapMock = {
  content: [
    {
      fieldKey: 'pricing-at',
      language: 'English',
      type: 'text',
      value: 'pricing-at-mock',
    },
  ],
  lastUpdated: 0,
  isContentLoading: true,
};

export const cmsContentWithAlternativesMock: Map<string, IUIContentGroup> =
  new Map([[CmsGroupKey.alternatives, uiContentGroupMapMock]]);
