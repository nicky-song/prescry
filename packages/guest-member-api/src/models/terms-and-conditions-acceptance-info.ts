// Copyright 2018 Prescryptive Health, Inc.

import { ITermsAndConditionsAcceptance } from './platform/patient-account/properties/patient-account-terms-and-conditions';

export interface ITermsAndConditionsWithAuthTokenAcceptance
  extends ITermsAndConditionsAcceptance {
  authToken: string | string[] | undefined;
}
