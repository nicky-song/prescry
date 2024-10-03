// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyPatientInfoScreenContent } from './verify-patient-info.screen.content';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { verifyPatientInfoScreenCMSContentWrapper } from './verify-patient-info.screen.cms-content-wrapper';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('verifyPatientInfoScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const verifyPatientInfoTitleMock = 'verify-patient-info-title-mock';
    const verifyPatientInfoDescriptionMock =
      'verify-patient-info-description-mock';
    const firstNameLabelMock = 'first-name-label-mock';
    const firstNamePlaceholderMock = 'first-name-placeholder-mock';
    const lastNameLabelMock = 'last-name-label-mock';
    const lastNamePlaceholderMock = 'last-name-placeholder-mock';
    const dateOfBirthLabelMock = 'date-of-birth-label-mock';
    const authorizationStatementMock = 'authorization-statement-mock';
    const footerButtonLabelMock = 'footer-button-label-mock';

    findContentValueMock.mockReturnValueOnce(verifyPatientInfoTitleMock);
    findContentValueMock.mockReturnValueOnce(verifyPatientInfoDescriptionMock);
    findContentValueMock.mockReturnValueOnce(firstNameLabelMock);
    findContentValueMock.mockReturnValueOnce(firstNamePlaceholderMock);
    findContentValueMock.mockReturnValueOnce(lastNameLabelMock);
    findContentValueMock.mockReturnValueOnce(lastNamePlaceholderMock);
    findContentValueMock.mockReturnValueOnce(dateOfBirthLabelMock);
    findContentValueMock.mockReturnValueOnce(authorizationStatementMock);
    findContentValueMock.mockReturnValueOnce(footerButtonLabelMock);

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

    const result = verifyPatientInfoScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.verifyPatientInfoScreen,
      2
    );

    const expectedFieldKeys = [
      'verify-patient-info-title',
      'verify-patient-info-description',
      'first-name-label',
      'first-name-placeholder',
      'last-name-label',
      'last-name-placeholder',
      'date-of-birth-label',
      'authorization-statement',
      'footer-button-label',
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

    const expectedVerifyPatientInfoScreenCMSMock: IVerifyPatientInfoScreenContent =
      {
        verifyPatientInfoTitle: verifyPatientInfoTitleMock,
        verifyPatientInfoDescription: verifyPatientInfoDescriptionMock,
        firstNameLabel: firstNameLabelMock,
        firstNamePlaceholder: firstNamePlaceholderMock,
        lastNameLabel: lastNameLabelMock,
        lastNamePlaceholder: lastNamePlaceholderMock,
        dateOfBirthLabel: dateOfBirthLabelMock,
        authorizationStatement: authorizationStatementMock,
        footerButtonLabel: footerButtonLabelMock,
      };
    expect(result).toEqual(expectedVerifyPatientInfoScreenCMSMock);
  });
});
