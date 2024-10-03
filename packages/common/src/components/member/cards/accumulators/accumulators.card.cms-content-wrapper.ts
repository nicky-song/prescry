// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IAccumulatorsCardContent } from './accumulators.card.content';

export const accumulatorsCardCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IAccumulatorsCardContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.accumulatorsCard,
    2
  );

  return {
    deductible: findContentValue('deductible', uiContent),
    family: findContentValue('family', uiContent),
    individual: findContentValue('individual', uiContent),
    maxOutOfPocket: findContentValue('max-out-of-pocket', uiContent),
  };
};
