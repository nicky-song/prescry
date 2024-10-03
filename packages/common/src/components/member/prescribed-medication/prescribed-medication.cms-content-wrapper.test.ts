// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrescribedMedicationContent } from './prescribed-medication-content';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { prescribedMedicationCMSContentWrapper } from './prescribed-medication.cms-content-wrapper';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('prescribedMedicationCMSContentWrapper', () => {
  it('has correct content', () => {
    const prescribedMedicationContentKeys: IPrescribedMedicationContent = {
      title: 'title',
      youPay: 'you-pay',
      planPays: 'plan-pays',
      sentToMessage: 'sent-to-message',
      estimatedPriceMessage: 'estimated-price-message',
      sendToText: 'send-to-text',
    };

    const prescribedMedicationVals = Object.values(
      prescribedMedicationContentKeys
    );

    prescribedMedicationVals.forEach((val) => {
      findContentValueMock.mockReturnValueOnce(val);
    });

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
        CmsGroupKey.prescribedMedication,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = prescribedMedicationCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescribedMedication,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(6);

    prescribedMedicationVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(prescribedMedicationContentKeys);
  });
});
