// Copyright 2022 Prescryptive Health, Inc.

import { switchYourMedicationScreenCMSContentWrapper } from './switch-your-medication.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { ISwitchYourMedicationScreenContent } from './switch-your-medication.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('switchYourMedicationScreenCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedSwitchYourMedicationCMSMock: ISwitchYourMedicationScreenContent =
      {
        title: 'title',
        switchingMedicationLabel: 'switching-medication-label',
        combinationTitle: 'combination-title',
        singleTitle: 'single-title',
        description: 'description',
        callButtonLabel: 'call-button-label',
        actionButtonLabel: 'action-button-label',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.title
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.switchingMedicationLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.combinationTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.singleTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.description
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.callButtonLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedSwitchYourMedicationCMSMock.actionButtonLabel
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
        CmsGroupKey.switchYourMedication,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = switchYourMedicationScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.switchYourMedication,
      2
    );

    const expectedFieldKeys = [
      'title',
      'switching-medication-label',
      'combination-title',
      'single-title',
      'description',
      'call-button-label',
      'action-button-label',
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

    expect(result).toEqual(expectedSwitchYourMedicationCMSMock);
  });
});
