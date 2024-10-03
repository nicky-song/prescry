// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { ISwitchYourMedicationSlideUpModalContent } from './switch-your-medication.slide-up-modal.content';
import { switchYourMedicationSlideUpModalCMSContentWrapper } from './switch-your-medication.slide-up-modal.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('switchYourMedicationSlideUpModalCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedSwitchYourMedicationSlideUpModalCMSMock: ISwitchYourMedicationSlideUpModalContent =
      {
        heading: 'heading',
        description: 'description',
        genericsHeading: 'generics-heading',
        genericsDescription: 'generics-description',
        therapeuticAlternativesHeading: 'therapeutic-alternatives-heading',
        therapeuticAlternativesDescription:
          'therapeutic-alternatives-description',
        discretionaryAlternativesHeading: 'discretionary-alternatives-heading',
        discretionaryAlternativesDescription:
          'discretionary-alternatives-description',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.heading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.description
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.genericsHeading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.genericsDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.therapeuticAlternativesHeading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.therapeuticAlternativesDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.discretionaryAlternativesHeading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationSlideUpModalCMSMock.discretionaryAlternativesDescription
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
        CmsGroupKey.switchYourMedicationSlideUpModal,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = switchYourMedicationSlideUpModalCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.switchYourMedicationSlideUpModal,
      2
    );

    const expectedFieldKeys = [
      'heading',
      'description',
      'generics-heading',
      'generics-description',
      'therapeutic-alternatives-heading',
      'therapeutic-alternatives-description',
      'discretionary-alternatives-heading',
      'discretionary-alternatives-description',
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

    expect(result).toEqual(expectedSwitchYourMedicationSlideUpModalCMSMock);
  });
});
