// Copyright 2022 Prescryptive Health, Inc.

import staticContent from '../../../myrx/assets/json/ui-cms-content.json';
import { cobrandingKeyPrefix } from '../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { IUIContentGroup } from '../models/ui-content';
import { IUIContentResponse } from '../utils/content/ui-cms-content';

export const loadStaticContent = (): Map<string, IUIContentGroup> => {
  const content = new Map<string, IUIContentGroup>();

  staticContent.forEach((contentEntry: IUIContentResponse) => {
    const { groupKey, fieldKey, language, type, text: value } = contentEntry;

    const groupContent: IUIContentGroup = content.get(groupKey) ?? {
      content: [],
      lastUpdated: Date.now(),
      isContentLoading: false,
    };
    groupContent.content.push({ fieldKey, language, type, value });
    content.set(groupKey, groupContent);
  });

  const transcarentLogo =
    'data:image/png;base64,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';

  const cob01Content: IUIContentGroup = {
    content: [
      {
        fieldKey: 'logo',
        language: 'English',
        type: 'Asset',
        value: transcarentLogo,
      },
      {
        fieldKey: 'interstitial-content',
        language: 'English',
        type: 'RichText',
        value:
          '**Welcome!**\n\n**COB01** has partnered with MyRx to offer up to 80% in savings. Get started today!',
      },
      {
        fieldKey: 'id-card-logo',
        language: 'English',
        type: 'Asset',
        value: transcarentLogo,
      },
    ],
    lastUpdated: Date.now(),
    isContentLoading: false,
  };
  content.set(cobrandingKeyPrefix + 'COB01', cob01Content);

  const cob02Content: IUIContentGroup = {
    content: [
      {
        fieldKey: 'logo',
        language: 'English',
        type: 'Asset',
        value: transcarentLogo,
      },
      {
        fieldKey: 'interstitial-content',
        language: 'English',
        type: 'RichText',
        value:
          '**Welcome!**\n\n**COB02** has partnered with MyRx to offer up to 80% in savings. Get started today!',
      },
      {
        fieldKey: 'id-card-header-color',
        language: 'English',
        type: 'Text',
        value: '#e0e0e0',
      },
      {
        fieldKey: 'id-card-logo',
        language: 'English',
        type: 'Asset',
        value: transcarentLogo,
      },
    ],
    lastUpdated: Date.now(),
    isContentLoading: false,
  };
  content.set(cobrandingKeyPrefix + 'COB02', cob02Content);

  return content;
};
