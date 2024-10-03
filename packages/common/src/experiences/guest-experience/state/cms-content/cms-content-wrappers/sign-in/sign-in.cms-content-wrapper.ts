// Copyright 2022 Prescryptive Health, Inc.

import { ISignInContent } from '../../../../../../models/cms-content/sign-in.ui-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const signInCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISignInContent => {
  const uiContent = getContent(language, content, CmsGroupKey.signIn, 2);

  return {
    addMembershipHeader: findContentValue('add-membership-header', uiContent),
    attestAuthorizationCheckboxLabel: findContentValue(
      'attest-authorization-checkbox-label',
      uiContent
    ),
    pbmMemberInstructions: findContentValue(
      'pbm-member-instructions',
      uiContent
    ),
    memberIdHelpText: findContentValue('member-id-help-text', uiContent),
    lastNamePlaceholder: findContentValue('last-name-placeholder', uiContent),
    firstNamePlaceholder: findContentValue('first-name-placeholder', uiContent),
    createAccount: findContentValue('create-account', uiContent),
    addMembership: findContentValue('add-membership', uiContent),
    emailPlaceholder: findContentValue('email-placeholder', uiContent),
    emailHelperText: findContentValue('email-helper-text', uiContent),
    createAccountHeader: findContentValue('create-account-header', uiContent),
    createAccountInstructions: findContentValue(
      'create-account-instructions',
      uiContent
    ),
    invalidEmailErrorText: findContentValue(
      'invalid-email-error-text',
      uiContent
    ),
    firstNameLabel: findContentValue('first-name-label', uiContent),
    lastNameLabel: findContentValue('last-name-label', uiContent),
    emailLabel: findContentValue('email-label', uiContent),
    memberIdLabel: findContentValue('member-id-label', uiContent),
    claimAlertHeader: findContentValue('claim-alert-header', uiContent),
    loginScreenErrorMessage: findContentValue(
      'login-screen-error-message',
      uiContent
    ),
    accountLockedHeaderText: findContentValue(
      'account-locked-header-text',
      uiContent
    ),
    accountLockedWarningText: findContentValue(
      'account-locked-warning-text',
      uiContent
    ),
    forgotPin: findContentValue('forgot-your-pin-text', uiContent),
    forgotPinText: findContentValue('forgot-my-pin-text', uiContent),
    loginPinScreenHeader: findContentValue(
      'login-pin-screen-header',
      uiContent
    ),
    loginButtonText: findContentValue('login-button-label', uiContent),
    maxPinVerifyError1: findContentValue('max-pin-verify-error-1', uiContent),
    maxPinVerifyError2: findContentValue('max-pin-verify-error-2', uiContent),
    maxPinVerifyError3: findContentValue('max-pin-verify-error-3', uiContent),
    maxPinVerifyError4: findContentValue('max-pin-verify-error-4', uiContent),
    resetButtonText: findContentValue('reset-button-label', uiContent),
    loginPinScreenInfo: findContentValue('login-pin-screen-info', uiContent),
    updatePinHeader: findContentValue('update-pin-header', uiContent),
    nextButtonLabel: findContentValue('next-button-label', uiContent),
    containerHeaderText: findContentValue(
      'pin-welcome-screen-header',
      uiContent
    ),
    continueButtonCaption: findContentValue('continue-button-text', uiContent),
    pinWelcomeInfoText1: findContentValue('pin-welcome-info-text-1', uiContent),
    pinWelcomeInfoText2: findContentValue('pin-welcome-info-text-2', uiContent),
    welcomeText: findContentValue('welcome-text', uiContent),
    notHaveAccountHelpText: findContentValue(
      'not-have-account-help-text',
      uiContent
    ),
    phoneNumberLoginCreateAccountText: findContentValue(
      'phone-number-login-create-account-text',
      uiContent
    ),
    phoneNumberLoginHeader: findContentValue(
      'phone-number-login-header',
      uiContent
    ),
    enterCode: findContentValue('enter-code', uiContent),
    enterCodeSent: findContentValue('enter-code-sent', uiContent),
    phoneVerificationErrorText: findContentValue(
      'phone-verification-error-text',
      uiContent
    ),
    phoneVerificationResentText: findContentValue(
      'phone-verification-resent-text',
      uiContent
    ),
    resendCodeQuestionText: findContentValue(
      'resend-code-question-text',
      uiContent
    ),
    resendLabel: findContentValue('resend-label', uiContent),
    termsAndConditionsCheckboxLabel: findContentValue(
      't-&-c-checkbox-label',
      uiContent
    ),
    phoneNumberRegistrationErrorMessage: findContentValue(
      'phone-registration-error-message',
      uiContent
    ),
    providePhoneNumberMessage: findContentValue(
      'provide-phone-number-message',
      uiContent
    ),
    relevantTextAlertsMessage: findContentValue(
      'relevant-text-alerts-message',
      uiContent
    ),
    phoneVerificationHeaderText: findContentValue(
      'phone-verification-header-text',
      uiContent
    ),
    verifyButtonLabel: findContentValue('verify-button-label', uiContent),
    verifyIdentityHeader: findContentValue('verify-identity-header', uiContent),
    verifyIdentityInstructions: findContentValue(
      'verify-identity-instructions',
      uiContent
    ),
    otcPlaceholderText: findContentValue('otc-placeholder-text', uiContent),
    resendCodeText: findContentValue('resend-code-text', uiContent),
    verificationCodeConfirmationText: findContentValue(
      'verification-code-confirmation-text',
      uiContent
    ),
    verificationCodeInstructions: findContentValue(
      'verification-code-instructions',
      uiContent
    ),
    verifyIdentitySendCodeHeader: findContentValue(
      'verify-identity-send-code-header',
      uiContent
    ),
    verifyIdentitySendCodeInstructions: findContentValue(
      'verify-identity-send-code-instructions',
      uiContent
    ),
  };
};
