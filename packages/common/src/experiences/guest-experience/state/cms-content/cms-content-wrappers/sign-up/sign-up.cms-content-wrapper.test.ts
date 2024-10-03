// Copyright 2022 Prescryptive Health, Inc.

import { ISignUpCMSContent } from '../../../../../../models/cms-content/sign-up.cms-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { signUpCMSContentWrapper } from './sign-up.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('signUpCMSContentWrapper', () => {
  it('should have correct content when field keys exist with default language', () => {
    const expectedContent: ISignUpCMSContent = {
      pbmSignUpHeader: 'pbm-sign-up-header-mock',
      pbmSignUpDescription: 'pbm-sign-up-description-mock',
      pbmBenefit1: 'pbm-benefit-1-mock',
      pbmBenefit2: 'pbm-benefit-2-mock',
      pbmBenefit3: 'pbm-benefit-3-mock',
      confirmPinErrorMessage: 'confirm-pin-error-message-mock',
      confirmPinHeader: 'confirm-pin-header-mock',
      confirmPinScreenInfo: 'confirm-pin-screen-info-mock',
      continueButton: 'continue-button-mock',
      emailAddressLabel: 'email-address-label-mock',
      firstNameLabel: 'first-name-label-mock',
      lastNameLabel: 'last-name-label-mock',
      ageNotMetError: 'age-not-met-error',
      memberIdHelpText: 'member-id-help-text-mock',
      memberIdLabel: 'member-id-label-mock',
      memberIdPlaceholder: 'member-id-placeholder-mock',
      nextButtonLabel: 'next-button-label-mock',
      phoneNumberHelpText: 'phone-number-help-text-mock',
      phoneNumberLabel: 'phone-number-label-mock',
      createPinHeader: 'create-pin-header-mock',
      createPinScreenInfo: 'create-pin-screen-info-mock',
      updatePinErrorMessage: 'update-pin-error-message-mock',
      updatePinHeader: 'update-pin-header-mock',
      verifyPinLabel: 'verify-pin-label-mock',
      accountNotFoundError: 'account-not-found-error-mock',
      activationPersonMismatchError: 'activation-person-mismatch-error-mock',
      createAccountHeader: 'create-account-header-mock',
      createAccountInstructions: 'create-account-instructions-mock',
      dataMismatchError: 'data-mismatch-error-mock',
      emailErrorMessage: 'email-error-message-mock',
      haveAccountHelpText: 'have-account-help-text-mock',
      noAccountError: 'no-account-error-mock',
      pbmMemberInstructions: 'pbm-member-instructions-mock',
      signIn: 'sign-in-mock',
      smsNotSupported: 'sms-not-supported-mock',
      unknownErrorType: 'unknown-error-type-mock',
      prescriptionPersonTitle: 'prescription-person-title-mock',
      prescriptionPersonInstructions: 'prescription-person-instructions-mock',
      ssoError: 'sso-error-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.pbmSignUpHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.pbmSignUpDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmBenefit1);
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmBenefit2);
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmBenefit3);
    findContentValueMock.mockReturnValueOnce(expectedContent.continueButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.firstNameLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.lastNameLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.emailAddressLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.phoneNumberLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.memberIdLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.memberIdPlaceholder
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.memberIdHelpText);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.phoneNumberHelpText
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.ageNotMetError);
    findContentValueMock.mockReturnValueOnce(expectedContent.nextButtonLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.createPinHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.createPinScreenInfo
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.updatePinHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.updatePinErrorMessage
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.confirmPinErrorMessage
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.confirmPinHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.confirmPinScreenInfo
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.verifyPinLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.accountNotFoundError
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.dataMismatchError);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.activationPersonMismatchError
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.noAccountError);
    findContentValueMock.mockReturnValueOnce(expectedContent.unknownErrorType);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.createAccountHeader
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.createAccountInstructions
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.emailErrorMessage);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.haveAccountHelpText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.pbmMemberInstructions
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.signIn);
    findContentValueMock.mockReturnValueOnce(expectedContent.smsNotSupported);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionPersonTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionPersonInstructions
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.ssoError);
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
        CmsGroupKey.signUp,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = signUpCMSContentWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.signUp,
      2
    );

    const expectedFieldKeys = [
      'pbm-sign-up-header',
      'pbm-sign-up-description',
      'pbm-benefit-1',
      'pbm-benefit-2',
      'pbm-benefit-3',
      'continue-button',
      'first-name-label',
      'last-name-label',
      'email-address-label',
      'phone-number-label',
      'member-id-label',
      'member-id-placeholder',
      'member-id-help-text',
      'phone-number-help-text',
      'age-not-met-error',
      'next-button-label',
      'create-pin-header',
      'create-pin-screen-info',
      'update-pin-header',
      'update-pin-error-message',
      'confirm-pin-error-message',
      'confirm-pin-header',
      'confirm-pin-screen-info',
      'verify-pin-label',
      'account-not-found-error',
      'data-mismatch-error',
      'activation-person-mismatch-error',
      'no-account-error',
      'unknown-error-type',
      'create-account-header',
      'create-account-instructions',
      'email-error-message',
      'have-account-help-text',
      'pbm-member-instructions',
      'sign-in',
      'sms-not-supported',
      'prescription-person-title',
      'prescription-person-instructions',
      'sso-error',
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

    expect(result).toEqual(expectedContent);
  });
});
