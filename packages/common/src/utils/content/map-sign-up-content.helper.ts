// Copyright 2022 Prescryptive Health, Inc.

import { ISignUpCMSContent } from '../../models/cms-content/sign-up.cms-content';
import { ISignUpContent } from '../../models/cms-content/sign-up.ui-content';

export const mapSignUpContent = (
  uiContent: ISignUpCMSContent
): ISignUpContent => {
  return {
    continueButton: uiContent.continueButton,
    pbmBenefit1: uiContent.pbmBenefit1,
    pbmBenefit2: uiContent.pbmBenefit2,
    pbmBenefit3: uiContent.pbmBenefit3,
    pbmSignUpDescription: uiContent.pbmSignUpDescription,
    pbmSignUpHeader: uiContent.pbmSignUpHeader,
    emailAddressLabel: uiContent.emailAddressLabel,
    firstNameLabel: uiContent.firstNameLabel,
    lastNameLabel: uiContent.lastNameLabel,
    ageNotMetError: uiContent.ageNotMetError,
    memberIdHelpText: uiContent.memberIdHelpText,
    memberIdLabel: uiContent.memberIdLabel,
    memberIdPlaceholder: uiContent.memberIdPlaceholder,
    phoneNumberHelpText: uiContent.phoneNumberHelpText,
    phoneNumberLabel: uiContent.phoneNumberLabel,
    nextButtonLabel: uiContent.nextButtonLabel,
    createPinHeader: uiContent.createPinHeader,
    createPinScreenInfo: uiContent.createPinScreenInfo,
    updatePinErrorMessage: uiContent.updatePinErrorMessage,
    updatePinHeader: uiContent.updatePinHeader,
    confirmPinErrorMessage: uiContent.confirmPinErrorMessage,
    verifyPinLabel: uiContent.verifyPinLabel,
    confirmPinScreenInfo: uiContent.confirmPinScreenInfo,
    confirmPinHeader: uiContent.confirmPinHeader,
    accountNotFoundError: uiContent.accountNotFoundError,
    activationPersonMismatchError: uiContent.activationPersonMismatchError,
    createAccountHeader: uiContent.createAccountHeader,
    createAccountInstructions: uiContent.createAccountInstructions,
    dataMismatchError: uiContent.dataMismatchError,
    emailErrorMessage: uiContent.emailErrorMessage,
    haveAccountHelpText: uiContent.haveAccountHelpText,
    noAccountError: uiContent.noAccountError,
    pbmMemberInstructions: uiContent.pbmMemberInstructions,
    signIn: uiContent.signIn,
    ssoError: uiContent.ssoError,
    smsNotSupported: uiContent.smsNotSupported,
    unknownErrorType: uiContent.unknownErrorType,
    prescriptionPersonTitle: uiContent.prescriptionPersonTitle,
    prescriptionPersonInstructions: uiContent.prescriptionPersonInstructions,
  };
};
