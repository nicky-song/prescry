// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { contactDoctorContainerCMSContentWrapper } from './contact-doctor-container.cms-content-wrapper';
import { IContactDoctorContainerContent } from './contact-doctor-container.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('contactDoctorContainerCMSContentWrapper', () => {
  it('has correct content', () => {
    const switchYourMedsTitleMock = 'switch-your-meds-title-mock';
    const switchYourMedsDescriptionMock = 'switch-your-meds-description-mock';
    const callNowButtonLabelMock = 'call-now-button-label-mock';

    findContentValueMock.mockReturnValueOnce(switchYourMedsTitleMock);
    findContentValueMock.mockReturnValueOnce(switchYourMedsDescriptionMock);
    findContentValueMock.mockReturnValueOnce(callNowButtonLabelMock);

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
        CmsGroupKey.contactDoctor,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = contactDoctorContainerCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.contactDoctor,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(3);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'switch-your-meds-title',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'switch-your-meds-description',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'call-now-button-label',
      uiContentMock
    );

    const expectedContent: IContactDoctorContainerContent = {
      switchYourMedsTitle: switchYourMedsTitleMock,
      switchYourMedsDescription: switchYourMedsDescriptionMock,
      callNowButtonLabel: callNowButtonLabelMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
