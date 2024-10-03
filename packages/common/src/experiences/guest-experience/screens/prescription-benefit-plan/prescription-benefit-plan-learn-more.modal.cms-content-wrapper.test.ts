// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { prescriptionBenefitPlanLearnMoreModalCMSContentWrapper } from './prescription-benefit-plan-learn-more.modal.cms-content-wrapper';
import { IPrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const getContentMock = getContent as jest.Mock;
const findContentValueMock = findContentValue as jest.Mock;

describe('prescriptionBenefitPlanModalCMSContentWrapper', () => {
  it('has correct content when field keys exist', () => {
    const headingMock = 'heading';
    const deductiblesTitleMock = 'deductiblesTitle';
    const deductiblesDescriptionMock = 'deductiblesDescription';
    const outOfPocketTitleMock = 'outOfPocketTitle';
    const outOfPocketDescriptionMock = 'outOfPocketDescription';

    findContentValueMock.mockReturnValueOnce(headingMock);
    findContentValueMock.mockReturnValueOnce(deductiblesTitleMock);
    findContentValueMock.mockReturnValueOnce(deductiblesDescriptionMock);
    findContentValueMock.mockReturnValueOnce(outOfPocketTitleMock);
    findContentValueMock.mockReturnValueOnce(outOfPocketDescriptionMock);

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
        CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = prescriptionBenefitPlanLearnMoreModalCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(5);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'heading',
      uiContentMock
    );

    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'deductibles-title',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'deductibles-description',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'out-of-pocket-title',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'out-of-pocket-description',
      uiContentMock
    );
    const expectedContent: IPrescriptionBenefitPlanLearnMoreModal = {
      heading: headingMock,
      deductiblesTitle: deductiblesTitleMock,
      deductiblesDescription: deductiblesDescriptionMock,
      outOfPocketTitle: outOfPocketTitleMock,
      outOfPocketDescription: outOfPocketDescriptionMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
