// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { medicineCabinetScreenCMSContentWrapper } from './medicine-cabinet.screen.cms-content-wrapper';
import { IMedicineCabinetScreenContent } from './medicine-cabinet.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const getContentMock = getContent as jest.Mock;
const findContentValueMock = findContentValue as jest.Mock;

describe('medicineCabinetScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const titleMock = 'title-mock';
    const prescriptionBenefitPlanLinkMock =
      'prescription-benefit-plan-link-mock';
    const seeMorePrescriptionsMock = 'see-more-prescriptions-mock';
    const noPrescriptionTextMock = 'no-prescription-text-mock';
    const howToSendPrescriptionTextMock = 'how-to-send-prescription-text-mock';
    const transferExistingPrescriptionHeadingMock =
      'transfer-existing-prescription-heading-mock';
    const transferExistingPrescriptionTextMock =
      'transfer-existing-prescription-text-mock';
    const sayTheWordPrescryptiveHeadingMock =
      'say-the-word-prescryptive-heading-mock';
    const sayTheWordPrescryptiveTextMock =
      'say-the-word-prescryptive-text-mock';
    const transferAPrescriptionLinkMock = 'transfer-a-prescription-link-mock';
    const learnMoreModalTextMock = 'learn-more-modal-text-mock';
    const learnMoreModalHeadingMock = 'learn-more-modal-heading-mock';
    const learnMoreTextMock = 'learn-more-text-mock';
    const loadingPrescriptionsTextMock = 'loading-prescriptions-text-mock';

    findContentValueMock.mockReturnValueOnce(prescriptionBenefitPlanLinkMock);
    findContentValueMock.mockReturnValueOnce(titleMock);
    findContentValueMock.mockReturnValueOnce(seeMorePrescriptionsMock);
    findContentValueMock.mockReturnValueOnce(noPrescriptionTextMock);
    findContentValueMock.mockReturnValueOnce(howToSendPrescriptionTextMock);
    findContentValueMock.mockReturnValueOnce(
      transferExistingPrescriptionHeadingMock
    );
    findContentValueMock.mockReturnValueOnce(
      transferExistingPrescriptionTextMock
    );
    findContentValueMock.mockReturnValueOnce(sayTheWordPrescryptiveHeadingMock);
    findContentValueMock.mockReturnValueOnce(sayTheWordPrescryptiveTextMock);
    findContentValueMock.mockReturnValueOnce(transferAPrescriptionLinkMock);
    findContentValueMock.mockReturnValueOnce(learnMoreModalTextMock);
    findContentValueMock.mockReturnValueOnce(learnMoreModalHeadingMock);
    findContentValueMock.mockReturnValueOnce(learnMoreTextMock);
    findContentValueMock.mockReturnValueOnce(loadingPrescriptionsTextMock);

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
        CmsGroupKey.medicineCabinetScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = medicineCabinetScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.medicineCabinetScreen,
      2
    );

    const expectedKeys = [
      'prescription-benefit-plan-link',
      'title',
      'see-more-prescriptions',
      'no-prescription-text',
      'how-to-send-prescription-text',
      'transfer-existing-prescription-heading',
      'transfer-existing-prescription-text',
      'say-the-word-prescryptive-heading',
      'say-the-word-prescryptive-text',
      'transfer-a-prescription-link',
      'learn-more-modal-text',
      'learn-more-modal-heading',
      'learn-more-text',
      'loading-prescriptions-text',
    ];

    expect(findContentValueMock).toHaveBeenCalledTimes(expectedKeys.length);
    expectedKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    const expectedContent: IMedicineCabinetScreenContent = {
      prescriptionBenefitPlanLink: prescriptionBenefitPlanLinkMock,
      title: titleMock,
      seeMorePrescriptionsLink: seeMorePrescriptionsMock,
      noPrescriptionText: noPrescriptionTextMock,
      howToSendPrescriptionText: howToSendPrescriptionTextMock,
      transferExistingPrescriptionHeading:
        transferExistingPrescriptionHeadingMock,
      transferExistingPrescriptionText: transferExistingPrescriptionTextMock,
      sayTheWordPrescryptiveHeading: sayTheWordPrescryptiveHeadingMock,
      sayTheWordPrescryptiveText: sayTheWordPrescryptiveTextMock,
      transferAPrescriptionLink: transferAPrescriptionLinkMock,
      learnMoreModalText: learnMoreModalTextMock,
      learnMoreModalHeading: learnMoreModalHeadingMock,
      learnMoreText: learnMoreTextMock,
      loadingPrescriptionsText: loadingPrescriptionsTextMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
