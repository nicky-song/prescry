// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { prescriptionPatientNameCMSContentWrapper } from './prescription-patient-name.cms-content-wrapper';
import { IPrescriptionPatientNameContent } from './prescription-patient-name.content';

jest.mock('../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('prescriptionPatientNameCMSContentWrapper', () => {
  it('has correct content', () => {
    const forPatientMock = 'for-patient-mock';

    findContentValueMock.mockReturnValueOnce(forPatientMock);

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
        CmsGroupKey.prescriptionPatientName,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = prescriptionPatientNameCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionPatientName,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(1);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'for-patient',
      uiContentMock
    );

    const expectedContent: IPrescriptionPatientNameContent = {
      forPatient: forPatientMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
