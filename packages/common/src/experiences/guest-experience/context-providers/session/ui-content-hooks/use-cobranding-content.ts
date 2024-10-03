// Copyright 2022 Prescryptive Health, Inc.

import { ICobrandingContent } from '../../../../../models/cms-content/co-branding.ui-content';
import { CMSExperienceEnum } from '../../../../../models/cms-content/experience.cms-content';
import { useContent } from './use-content';

export const cobrandingKeyPrefix = 'co-branding-';

export const useCobrandingContent = (
  rxGroup = '',
  brokerAssociation = ''
): ICobrandingContent => {
  const rxGroupContentWithIsLoading = useContent<
    ICobrandingContent | undefined
  >(cobrandingGroupKey(rxGroup), undefined, CMSExperienceEnum.MYRX_COBRANDING);

  const brokerContentWithIsLoading = useContent<ICobrandingContent | undefined>(
    cobrandingGroupKey(brokerAssociation),
    undefined,
    CMSExperienceEnum.MYRX_COBRANDING
  );

  if (!isEmptyContent(rxGroupContentWithIsLoading?.content)) {
    return rxGroupContentWithIsLoading?.content ?? {};
  }

  if (!isEmptyContent(brokerContentWithIsLoading?.content)) {
    return brokerContentWithIsLoading?.content ?? {};
  }

  return {};
};

const cobrandingGroupKey = (cobrandingId: string): string =>
  cobrandingId ? `${cobrandingKeyPrefix}${cobrandingId}` : '';

const isEmptyContent = (content: ICobrandingContent = {}) =>
  !Object.values(content).some((value) => value);
