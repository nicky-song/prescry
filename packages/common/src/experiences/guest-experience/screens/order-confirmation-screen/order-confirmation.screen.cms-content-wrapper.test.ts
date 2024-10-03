// Copyright 2021 Prescryptive Health, Inc.

import { IOrderConfirmationScreenContent } from './order-confirmation.screen.content';
import { orderConfirmationScreenCMSContentWrapper } from './order-confirmation.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('orderConfirmationScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IOrderConfirmationScreenContent = {
      offerDeliveryInfoTitle: 'offer-delivery-info-title-mock',
      offerDeliveryInfoDescription: 'offer-delivery-info-description-mock',
      pickUpHeading: 'pick-up-heading-mock',
      pickUpPreamble: 'pick-up-preamble-mock',
      whatIsNextHeader: 'what-is-next-header-mock',
      whatIsNextInstructions: 'what-is-next-instructions-mock',
      orderConfirmationTitleText: 'order-confirmation-title-text-mock',
      orderConfirmationConfirmationText:
        'order-confirmation-confirmation-text-mock',
      orderConfirmationEligibilityText:
        'order-confirmation-eligibility-text-mock',
      orderSectionHeader: 'order-section-header-mock',
      summaryTitle: 'order-confirmation-summary-title-mock',
      summaryOrderNumber: 'order-confirmation-summary-order-number-mock',
      summaryOrderDate: 'order-confirmation-summary-order-date-mock',
      summaryPlanPays: 'order-confirmation-summary-plan-pays-mock',
      summaryYouPay: 'order-confirmation-summary-you-pay-mock',
      pickUpOpen24Hours: 'order-confirmation-pickup-open-24-hours-mock',
      pickUpOpen: 'order-confirmation-pickup-open-mock',
      pickUpClosed: 'order-confirmation-pickup-closed-mock',
      pickUpOpensAt: 'order-confirmation-pickup-opens-at-mock',
      pickUpClosesAt: 'order-confirmation-pickup-closes-at-mock',
      prescriberInfoTitle: 'order-confirmation-prescriber-info-title-mock',
      insuranceCardNoticeText: 'insurance-card-notice-text-mock',
      estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedContent.offerDeliveryInfoTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.offerDeliveryInfoDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpHeading);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpPreamble);
    findContentValueMock.mockReturnValueOnce(expectedContent.whatIsNextHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.whatIsNextInstructions
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.orderConfirmationTitleText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.orderConfirmationConfirmationText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.orderConfirmationEligibilityText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.orderSectionHeader
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.summaryTitle);
    findContentValueMock.mockReturnValueOnce(expectedContent.summaryOrderDate);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.summaryOrderNumber
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.summaryPlanPays);
    findContentValueMock.mockReturnValueOnce(expectedContent.summaryYouPay);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpOpen24Hours);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpOpen);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpClosed);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpOpensAt);
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpClosesAt);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriberInfoTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.insuranceCardNoticeText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.estimatedPriceNoticeText
    );

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.orderConfirmation,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = orderConfirmationScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.orderConfirmation,
      2
    );

    const expectedFieldKeys = [
      'offer-delivery-info-title',
      'offer-delivery-info-description',
      'pick-up-heading',
      'pick-up-preamble',
      'what-is-next-header',
      'what-is-next-instructions',
      'order-confirmation-title-text',
      'order-confirmation-confirmation-text',
      'order-confirmation-eligibility-text',
      'order-section-header',
      'order-confirmation-summary-title',
      'order-confirmation-summary-order-date',
      'order-confirmation-summary-order-number',
      'order-confirmation-summary-plan-pays',
      'order-confirmation-summary-you-pay',
      'order-confirmation-pickup-open-24-hours',
      'order-confirmation-pickup-open',
      'order-confirmation-pickup-closed',
      'order-confirmation-pickup-opens-at',
      'order-confirmation-pickup-closes-at',
      'order-confirmation-prescriber-info-title',
      'insurance-card-notice-text',
      'estimated-price-notice-text',
    ];
    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(expectedContent);
  });
});
