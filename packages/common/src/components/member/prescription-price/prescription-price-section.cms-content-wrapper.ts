// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';

export interface IPrescriptionPriceSectionContent {
  price: string;
  noPrice: string;
  youPay: string;
  planPays: string;
  assistanceProgram: string;
  contactPharmacyForPricing: string;
  skeletonPlaceHolder: string;
  withInsurance: string;
  verifyRealPrice: string;
  totalPrice: string;
}

export const prescriptionPriceSectionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionPriceSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionPriceSection,
    2
  );

  return {
    price: findContentValue('price', uiContent),
    noPrice: findContentValue('no-price', uiContent),
    youPay: findContentValue('you-pay', uiContent),
    planPays: findContentValue('plan-pays', uiContent),
    assistanceProgram: findContentValue('assistance-program', uiContent),
    contactPharmacyForPricing: findContentValue(
      'contact-pharmacy-for-pricing',
      uiContent
    ),
    skeletonPlaceHolder: findContentValue('skeleton-place-holder', uiContent),
    withInsurance: findContentValue('with-insurance', uiContent),
    verifyRealPrice: findContentValue('verify-real-price', uiContent),
    totalPrice: findContentValue('total-price', uiContent),
  };
};
