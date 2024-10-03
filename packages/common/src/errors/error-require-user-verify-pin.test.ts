// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';
import { ErrorRequireUserVerifyPin } from './error-require-user-verify-pin';

describe('ErrorRequireUserVerifyPin', () => {
  it('should create instance of ErrorRequireUserSetPin', () => {
    const error = new ErrorRequireUserVerifyPin();
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
    expect(error).toEqual(new Error(ErrorConstants.errorRequireUserVerifyPin));
  });
  it('should create instance of ErrorRequireUserVerifyPin wih workflow', () => {
    const error = new ErrorRequireUserVerifyPin(true, 'prescriptionTransfer');
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
    expect(error).toEqual(new Error(ErrorConstants.errorRequireUserVerifyPin));
    expect(error.workflow).toEqual('prescriptionTransfer');
  });
});
