// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';
import { ErrorRequireUserSetPin } from './error-require-user-set-pin';

describe('ErrorRequireUserSetPin', () => {
  it('should create instance of ErrorRequireUserSetPin', () => {
    const error = new ErrorRequireUserSetPin();
    expect(error).toBeInstanceOf(ErrorRequireUserSetPin);
    expect(error).toEqual(new Error(ErrorConstants.errorRequireUserSetPin));
  });
  it('should create instance of ErrorRequireUserSetPin wih workflow', () => {
    const error = new ErrorRequireUserSetPin('prescriptionTransfer');
    expect(error).toBeInstanceOf(ErrorRequireUserSetPin);
    expect(error).toEqual(new Error(ErrorConstants.errorRequireUserSetPin));
    expect(error.workflow).toEqual('prescriptionTransfer');
  });
});
