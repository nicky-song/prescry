// Copyright 2022 Prescryptive Health, Inc.

import { ISignInContent } from '../../../../../../models/cms-content/sign-in.ui-content';
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
import { signInCMSContentWrapper } from './sign-in.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('signInCMSContentWrapper', () => {
  it('has correct content', () => {
    const signInContentKeys: ISignInContent = {
      addMembershipHeader: 'add-membership-header',
      attestAuthorizationCheckboxLabel: 'attest-authorization-checkbox-label',
      pbmMemberInstructions: 'pbm-member-instructions',
      memberIdHelpText: 'member-id-help-text',
      lastNamePlaceholder: 'last-name-placeholder',
      firstNamePlaceholder: 'first-name-placeholder',
      createAccount: 'create-account',
      addMembership: 'add-membership',
      emailPlaceholder: 'email-placeholder',
      emailHelperText: 'email-helper-text',
      createAccountHeader: 'create-account-header',
      createAccountInstructions: 'create-account-instructions',
      invalidEmailErrorText: 'invalid-email-error-text',
      firstNameLabel: 'first-name-label',
      lastNameLabel: 'last-name-label',
      emailLabel: 'email-label',
      memberIdLabel: 'member-id-label',
      claimAlertHeader: 'claim-alert-header',
      loginScreenErrorMessage: 'login-screen-error-message',
      accountLockedHeaderText: 'account-locked-header-text',
      accountLockedWarningText: 'account-locked-warning-text',
      forgotPin: 'forgot-your-pin-text',
      forgotPinText: 'forgot-my-pin-text',
      loginPinScreenHeader: 'login-pin-screen-header',
      loginButtonText: 'login-button-label',
      maxPinVerifyError1: 'max-pin-verify-error-1',
      maxPinVerifyError2: 'max-pin-verify-error-2',
      maxPinVerifyError3: 'max-pin-verify-error-3',
      maxPinVerifyError4: 'max-pin-verify-error-4',
      resetButtonText: 'reset-button-label',
      loginPinScreenInfo: 'login-pin-screen-info',
      updatePinHeader: 'update-pin-header',
      nextButtonLabel: 'next-button-label',
      containerHeaderText: 'pin-welcome-screen-header',
      continueButtonCaption: 'continue-button-text',
      pinWelcomeInfoText1: 'pin-welcome-info-text-1',
      pinWelcomeInfoText2: 'pin-welcome-info-text-2',
      welcomeText: 'welcome-text',
      notHaveAccountHelpText: 'not-have-account-help-text',
      phoneNumberLoginCreateAccountText:
        'phone-number-login-create-account-text',
      phoneNumberLoginHeader: 'phone-number-login-header',
      enterCode: 'enter-code',
      enterCodeSent: 'enter-code-sent',
      phoneVerificationErrorText: 'phone-verification-error-text',
      phoneVerificationResentText: 'phone-verification-resent-text',
      resendCodeQuestionText: 'resend-code-question-text',
      resendLabel: 'resend-label',
      termsAndConditionsCheckboxLabel: 't-&-c-checkbox-label',
      phoneNumberRegistrationErrorMessage: 'phone-registration-error-message',
      providePhoneNumberMessage: 'provide-phone-number-message',
      relevantTextAlertsMessage: 'relevant-text-alerts-message',
      phoneVerificationHeaderText: 'phone-verification-header-text',
      verifyButtonLabel: 'verify-button-label',
      verifyIdentityHeader: 'verify-identity-header',
      verifyIdentityInstructions: 'verify-identity-instructions',
      otcPlaceholderText: 'otc-placeholder-text',
      resendCodeText: 'resend-code-text',
      verificationCodeConfirmationText: 'verification-code-confirmation-text',
      verificationCodeInstructions: 'verification-code-instructions',
      verifyIdentitySendCodeHeader: 'verify-identity-send-code-header',
      verifyIdentitySendCodeInstructions:
        'verify-identity-send-code-instructions',
    };

    const signInVals = Object.values(signInContentKeys);

    signInVals.forEach((val) => {
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
        CmsGroupKey.signIn,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = signInCMSContentWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.signIn,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(61);

    signInVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(signInContentKeys);
  });
});
