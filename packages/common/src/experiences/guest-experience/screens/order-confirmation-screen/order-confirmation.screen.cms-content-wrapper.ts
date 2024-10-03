// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { Language } from '../../../../models/language';
import { IOrderConfirmationScreenContent } from './order-confirmation.screen.content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

export const orderConfirmationScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IOrderConfirmationScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.orderConfirmation,
    2
  );

  return {
    offerDeliveryInfoTitle: findContentValue(
      'offer-delivery-info-title',
      uiContent
    ),
    offerDeliveryInfoDescription: findContentValue(
      'offer-delivery-info-description',
      uiContent
    ),
    pickUpHeading: findContentValue('pick-up-heading', uiContent),
    pickUpPreamble: findContentValue('pick-up-preamble', uiContent),
    whatIsNextHeader: findContentValue('what-is-next-header', uiContent),
    whatIsNextInstructions: findContentValue(
      'what-is-next-instructions',
      uiContent
    ),
    orderConfirmationTitleText: findContentValue(
      'order-confirmation-title-text',
      uiContent
    ),
    orderConfirmationConfirmationText: findContentValue(
      'order-confirmation-confirmation-text',
      uiContent
    ),
    orderConfirmationEligibilityText: findContentValue(
      'order-confirmation-eligibility-text',
      uiContent
    ),
    orderSectionHeader: findContentValue('order-section-header', uiContent),
    summaryTitle: findContentValue(
      'order-confirmation-summary-title',
      uiContent
    ),
    summaryOrderDate: findContentValue(
      'order-confirmation-summary-order-date',
      uiContent
    ),
    summaryOrderNumber: findContentValue(
      'order-confirmation-summary-order-number',
      uiContent
    ),
    summaryPlanPays: findContentValue(
      'order-confirmation-summary-plan-pays',
      uiContent
    ),
    summaryYouPay: findContentValue(
      'order-confirmation-summary-you-pay',
      uiContent
    ),
    pickUpOpen24Hours: findContentValue(
      'order-confirmation-pickup-open-24-hours',
      uiContent
    ),
    pickUpOpen: findContentValue('order-confirmation-pickup-open', uiContent),
    pickUpClosed: findContentValue(
      'order-confirmation-pickup-closed',
      uiContent
    ),
    pickUpOpensAt: findContentValue(
      'order-confirmation-pickup-opens-at',
      uiContent
    ),
    pickUpClosesAt: findContentValue(
      'order-confirmation-pickup-closes-at',
      uiContent
    ),
    prescriberInfoTitle: findContentValue(
      'order-confirmation-prescriber-info-title',
      uiContent
    ),
    insuranceCardNoticeText: findContentValue(
      'insurance-card-notice-text',
      uiContent
    ),
    estimatedPriceNoticeText: findContentValue(
      'estimated-price-notice-text',
      uiContent
    ),
  };
};
