// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { prescriptionBenefitPlanScreenCMSContentWrapper } from './prescription-benefit-plan.screen.cms-content-wrapper';
import { IPrescriptionBenefitPlanScreenContent } from './prescription-benefit-plan.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const getContentMock = getContent as jest.Mock;
const findContentValueMock = findContentValue as jest.Mock;

describe('prescriptionBenefitPlanScreenCMSContentWrapper', () => {
  it('has correct content when field keys exist', () => {
    const claimHistoryLinkMock = 'claim-history-link-mock';
    const titleMock = 'title-mock';
    const learnMoreLinkMock = 'learn-more-link-mock';
    const openPlanDetailsMock = 'open-plan-details-mock';
    const openPlanDetailsNotAvailableMock =
      'open-plan-details-not-available-mock';

    findContentValueMock.mockReturnValueOnce(claimHistoryLinkMock);
    findContentValueMock.mockReturnValueOnce(titleMock);
    findContentValueMock.mockReturnValueOnce(learnMoreLinkMock);
    findContentValueMock.mockReturnValueOnce(openPlanDetailsMock);
    findContentValueMock.mockReturnValueOnce(openPlanDetailsNotAvailableMock);

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
        CmsGroupKey.prescriptionBenefitPlanScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = prescriptionBenefitPlanScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionBenefitPlanScreen,
      2
    );

    const expectedKeys = [
      'claim-history-link',
      'title',
      'learn-more-text',
      'open-plan-details',
      'open-plan-details-not-available',
    ];

    expect(findContentValueMock).toHaveBeenCalledTimes(expectedKeys.length);
    expectedKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    const expectedContent: IPrescriptionBenefitPlanScreenContent = {
      claimHistoryLink: claimHistoryLinkMock,
      title: titleMock,
      learnMoreText: learnMoreLinkMock,
      openPlanDetails: openPlanDetailsMock,
      openPlanDetailsNotAvailable: openPlanDetailsNotAvailableMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
