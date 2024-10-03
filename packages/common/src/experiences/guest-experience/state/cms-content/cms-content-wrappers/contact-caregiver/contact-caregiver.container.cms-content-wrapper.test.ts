// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { contactCareGiverCMSContentWrapper } from './contact-caregiver.container.cms-content-wrapper';

import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { IContactCaregiverContainerContent } from '../../../../../../models/cms-content/contact-caregiver.container.content';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('contactCareGiverCMSContentWrapper', () => {
  it('has correct content', () => {
    const title = 'Contact your caregiver';
    const titleDescription =
      'You must meet certain age requirements to have a myPrescryptive account. Only your caregiver can manage your prescriptions.';
    const subTitle = 'Here is more information about caregivers and dependents';
    const subDependentsTitle = 'dependents';
    const subDependentsInfo =
      'are people who are not able to take care of themseleves, either because they do not meet the legal age requirements, or because they have a medical condition.';
    const subCaregiversTitle = 'Caregivers';
    const subCaregiversInfo =
      'help take care of dependents, including managing their healthcare and making medical decisions.';
    const subCaretipInfo =
      'In the US, the parent or legal guardian is typically the caregiver for a minor dependent, but a court can appoint a guardian if necessary.';
    const helpLinkTitle = 'Prescryptive is ready to help.';
    const helpLinkText = 'Contact Us';
    const helpLinkInfo = 'if you have any questions';
    const providedBy = 'Provided by';

    findContentValueMock.mockReturnValueOnce(title);
    findContentValueMock.mockReturnValueOnce(titleDescription);
    findContentValueMock.mockReturnValueOnce(subTitle);
    findContentValueMock.mockReturnValueOnce(subDependentsTitle);
    findContentValueMock.mockReturnValueOnce(subDependentsInfo);
    findContentValueMock.mockReturnValueOnce(subCaregiversTitle);
    findContentValueMock.mockReturnValueOnce(subCaregiversInfo);
    findContentValueMock.mockReturnValueOnce(subCaretipInfo);
    findContentValueMock.mockReturnValueOnce(helpLinkTitle);
    findContentValueMock.mockReturnValueOnce(helpLinkText);
    findContentValueMock.mockReturnValueOnce(helpLinkInfo);
    findContentValueMock.mockReturnValueOnce(providedBy);

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
        CmsGroupKey.verifyPatientInfoScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = contactCareGiverCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.contactCareGiver,
      2
    );

    const expectedFieldKeys = [
      'contact-caregiver-title',
      'contact-caregiver-title-description',
      'contact-caregiver-subtitle',
      'contact-caregiver-sub-dependents-title',
      'contact-caregiver-sub-dependents-info',
      'contact-caregiver-sub-caregivers-title',
      'contact-caregiver-sub-caregivers-info',
      'contact-caregiver-sub-caretip-info',
      'contact-caregiver-help-link-title',
      'contact-caregiver-help-link-text',
      'contact-caregiver-help-link-info',
      'contact-caregiver-provided-by',
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

    const expectedContactCareGiverCMSMock: IContactCaregiverContainerContent = {
      title,
      titleDescription,
      subTitle,
      subItems: [
        {
          id: 'dependents',
          title: subDependentsTitle,
          info: subDependentsInfo,
        },
        {
          id: 'caregivers',
          title: subCaregiversTitle,
          info: subCaregiversInfo,
        },
        {
          id: 'caretip',
          info: subCaretipInfo,
        },
      ],
      helpLinkTitle,
      helpLinkText,
      helpLinkInfo,
      providedBy,
    };
    expect(result).toEqual(expectedContactCareGiverCMSMock);
  });
});
