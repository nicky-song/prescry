// Copyright 2022 Prescryptive Health, Inc.

import type { ISignUpCMSContent } from '../../../../../../models/cms-content/sign-up.cms-content';
import { Language } from '../../../../../../models/language';
import type { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const signUpCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISignUpCMSContent => {
  const uiContent = getContent(language, content, CmsGroupKey.signUp, 2);

  return {
    pbmSignUpHeader: findContentValue('pbm-sign-up-header', uiContent),
    pbmSignUpDescription: findContentValue(
      'pbm-sign-up-description',
      uiContent
    ),
    pbmBenefit1: findContentValue('pbm-benefit-1', uiContent),
    pbmBenefit2: findContentValue('pbm-benefit-2', uiContent),
    pbmBenefit3: findContentValue('pbm-benefit-3', uiContent),
    continueButton: findContentValue('continue-button', uiContent),
    firstNameLabel: findContentValue('first-name-label', uiContent),
    lastNameLabel: findContentValue('last-name-label', uiContent),
    emailAddressLabel: findContentValue('email-address-label', uiContent),
    phoneNumberLabel: findContentValue('phone-number-label', uiContent),
    memberIdLabel: findContentValue('member-id-label', uiContent),
    memberIdPlaceholder: findContentValue('member-id-placeholder', uiContent),
    memberIdHelpText: findContentValue('member-id-help-text', uiContent),
    phoneNumberHelpText: findContentValue('phone-number-help-text', uiContent),
    ageNotMetError: findContentValue('age-not-met-error', uiContent),
    nextButtonLabel: findContentValue('next-button-label', uiContent),
    createPinHeader: findContentValue('create-pin-header', uiContent),
    createPinScreenInfo: findContentValue('create-pin-screen-info', uiContent),
    updatePinHeader: findContentValue('update-pin-header', uiContent),
    updatePinErrorMessage: findContentValue(
      'update-pin-error-message',
      uiContent
    ),
    confirmPinErrorMessage: findContentValue(
      'confirm-pin-error-message',
      uiContent
    ),
    confirmPinHeader: findContentValue('confirm-pin-header', uiContent),
    confirmPinScreenInfo: findContentValue(
      'confirm-pin-screen-info',
      uiContent
    ),
    verifyPinLabel: findContentValue('verify-pin-label', uiContent),
    accountNotFoundError: findContentValue(
      'account-not-found-error',
      uiContent
    ),
    dataMismatchError: findContentValue('data-mismatch-error', uiContent),
    activationPersonMismatchError: findContentValue(
      'activation-person-mismatch-error',
      uiContent
    ),
    noAccountError: findContentValue('no-account-error', uiContent),
    unknownErrorType: findContentValue('unknown-error-type', uiContent),
    createAccountHeader: findContentValue('create-account-header', uiContent),
    createAccountInstructions: findContentValue(
      'create-account-instructions',
      uiContent
    ),
    emailErrorMessage: findContentValue('email-error-message', uiContent),
    haveAccountHelpText: findContentValue('have-account-help-text', uiContent),
    pbmMemberInstructions: findContentValue(
      'pbm-member-instructions',
      uiContent
    ),
    signIn: findContentValue('sign-in', uiContent),
    smsNotSupported: findContentValue('sms-not-supported', uiContent),
    prescriptionPersonTitle: findContentValue(
      'prescription-person-title',
      uiContent
    ),
    prescriptionPersonInstructions: findContentValue(
      'prescription-person-instructions',
      uiContent
    ),
    ssoError: findContentValue('sso-error', uiContent),
  };
};
