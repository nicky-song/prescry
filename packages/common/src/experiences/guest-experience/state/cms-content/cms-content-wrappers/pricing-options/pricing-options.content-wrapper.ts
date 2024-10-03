// Copyright 2023 Prescryptive Health, Inc.

import { IPricingOptionContent } from '../../../../../../models/cms-content/pricing-options.content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const pricingOptionsWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPricingOptionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.pricingOptions,
    2
  );

  return {
    pbmTitle: findContentValue('pbm-title', uiContent),
    pbmSubText: findContentValue('pbm-sub-text', uiContent),
    smartPriceTitle: findContentValue('smart-price-title', uiContent),
    smartPriceSubText: findContentValue('smart-price-sub-text', uiContent),
    thirdPartyTitle: findContentValue('third-party-title', uiContent),
    thirdPartySubText: findContentValue('third-party-sub-text', uiContent),
    noPriceLabel: findContentValue('no-price-label', uiContent),
    pricingOptionsTitle: findContentValue('pricing-options-title', uiContent),
    pricingOptionsDescription: findContentValue(
      'pricing-options-description',
      uiContent
    ),
    pricingOptionsFooterLabel: findContentValue(
      'pricing-options-footer-label',
      uiContent
    ),
  };
};
