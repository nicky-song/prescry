// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { ITransferFlowCMSContent } from '../../../../../../models/cms-content/transfer-flow.cms-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';

export const transferFlowCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ITransferFlowCMSContent => {
  const uiContent = getContent(language, content, CmsGroupKey.transferFlow, 2);

  return {
    mailOrderPharmacyDescription: findContentValue(
      'pharmacy-description-mail-order',
      uiContent
    ),
    outOfNetworkPharmacyDescription: findContentValue(
      'pharmacy-description-out-of-network',
      uiContent
    ),
    deliveryInfoHeader: findContentValue('delivery-info-header', uiContent),
    deliveryInfoDescription: findContentValue(
      'delivery-info-description',
      uiContent
    ),
    couponDeliveryInfoDescription: findContentValue(
      'delivery-info-coupon-description',
      uiContent
    ),
    pickUpHeader: findContentValue('pick-up-header', uiContent),
    sendButton: findContentValue('send-to-pharmacy', uiContent),
    estimatedPriceNoticeText: findContentValue(
      'estimated-price-notice-text',
      uiContent
    ),
  };
};
