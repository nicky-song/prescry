// Copyright 2022 Prescryptive Health, Inc.

import { ISignUpCMSContent } from '../../models/cms-content/sign-up.cms-content';
import { mapSignUpContent } from './map-sign-up-content.helper';
import { ISignUpContent } from '../../models/cms-content/sign-up.ui-content';

const signUpContentMock: ISignUpCMSContent = {
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
  ageNotMetError: 'age-not-met-error-mock',
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

describe('mapSignUpContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedSignUpContentMock: ISignUpContent = {
      confirmPinErrorMessage: signUpContentMock.confirmPinErrorMessage,
      confirmPinHeader: signUpContentMock.confirmPinHeader,
      confirmPinScreenInfo: signUpContentMock.confirmPinScreenInfo,
      continueButton: signUpContentMock.continueButton,
      emailAddressLabel: signUpContentMock.emailAddressLabel,
      firstNameLabel: signUpContentMock.firstNameLabel,
      lastNameLabel: signUpContentMock.lastNameLabel,
      ageNotMetError: signUpContentMock.ageNotMetError,
      memberIdHelpText: signUpContentMock.memberIdHelpText,
      memberIdLabel: signUpContentMock.memberIdLabel,
      memberIdPlaceholder: signUpContentMock.memberIdPlaceholder,
      nextButtonLabel: signUpContentMock.nextButtonLabel,
      pbmBenefit1: signUpContentMock.pbmBenefit1,
      pbmBenefit2: signUpContentMock.pbmBenefit2,
      pbmBenefit3: signUpContentMock.pbmBenefit3,
      pbmSignUpDescription: signUpContentMock.pbmSignUpDescription,
      pbmSignUpHeader: signUpContentMock.pbmSignUpHeader,
      phoneNumberHelpText: signUpContentMock.phoneNumberHelpText,
      phoneNumberLabel: signUpContentMock.phoneNumberLabel,
      createPinHeader: signUpContentMock.createPinHeader,
      createPinScreenInfo: signUpContentMock.createPinScreenInfo,
      updatePinErrorMessage: signUpContentMock.updatePinErrorMessage,
      updatePinHeader: signUpContentMock.updatePinHeader,
      verifyPinLabel: signUpContentMock.verifyPinLabel,
      accountNotFoundError: signUpContentMock.accountNotFoundError,
      activationPersonMismatchError:
        signUpContentMock.activationPersonMismatchError,
      createAccountHeader: signUpContentMock.createAccountHeader,
      createAccountInstructions: signUpContentMock.createAccountInstructions,
      dataMismatchError: signUpContentMock.dataMismatchError,
      emailErrorMessage: signUpContentMock.emailErrorMessage,
      haveAccountHelpText: signUpContentMock.haveAccountHelpText,
      noAccountError: signUpContentMock.noAccountError,
      pbmMemberInstructions: signUpContentMock.pbmMemberInstructions,
      signIn: signUpContentMock.signIn,
      smsNotSupported: signUpContentMock.smsNotSupported,
      unknownErrorType: signUpContentMock.unknownErrorType,
      prescriptionPersonTitle: signUpContentMock.prescriptionPersonTitle,
      prescriptionPersonInstructions:
        signUpContentMock.prescriptionPersonInstructions,
      ssoError: signUpContentMock.ssoError,
    };

    const result = mapSignUpContent(signUpContentMock);

    expect(result).toEqual(expectedSignUpContentMock);
  });
});
