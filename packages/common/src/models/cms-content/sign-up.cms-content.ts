// Copyright 2022 Prescryptive Health, Inc.

export interface ISignUpCMSContent {
  pbmSignUpHeader: string;
  pbmSignUpDescription: string;
  pbmBenefit1: string;
  pbmBenefit2: string;
  pbmBenefit3: string;
  continueButton: string;
  firstNameLabel: string;
  lastNameLabel: string;
  emailAddressLabel: string;
  phoneNumberLabel: string;
  memberIdLabel: string;
  memberIdPlaceholder: string;
  memberIdHelpText: string;
  phoneNumberHelpText: string;
  ageNotMetError: string;
  nextButtonLabel: string;
  createPinHeader: string;
  createPinScreenInfo: string;
  updatePinHeader: string;
  updatePinErrorMessage: string;
  confirmPinErrorMessage: string;
  verifyPinLabel: string;
  confirmPinScreenInfo: string;
  confirmPinHeader: string;
  accountNotFoundError: string;
  dataMismatchError: string;
  activationPersonMismatchError: string;
  noAccountError: string;
  unknownErrorType: string;
  createAccountHeader: string;
  createAccountInstructions: string;
  pbmMemberInstructions: string;
  haveAccountHelpText: string;
  signIn: string;
  ssoError: string;
  emailErrorMessage: string;
  smsNotSupported: string;
  prescriptionPersonTitle: string;
  prescriptionPersonInstructions: string;
}
