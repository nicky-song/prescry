// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IClaimHistoryScreenContent } from './claim-history.screen.content';

export const claimHistoryScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IClaimHistoryScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.claimHistoryScreen,
    2
  );

  return {
    title: findContentValue('title', uiContent),
    emptyClaimsText: findContentValue('empty-claims-text', uiContent),
    emptyClaimsHeading: findContentValue('empty-claims-heading', uiContent),
    emptyClaimsWithPrescriptionText: findContentValue(
      'empty-claims-with-prescription-text',
      uiContent
    ),
    medicineCabinetButtonLabel: findContentValue(
      'medicine-cabinet-button-label',
      uiContent
    ),
    loadingClaimsText: findContentValue('loading-claims-text', uiContent),
    downloadButtonLabel: findContentValue('download-button-label', uiContent),
  };
};
