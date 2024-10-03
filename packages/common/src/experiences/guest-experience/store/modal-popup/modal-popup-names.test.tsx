// Copyright 2018 Prescryptive Health, Inc.

import { ModalPopupNames } from './modal-popup-names';

const mockModalPopupNames = {
  loginSuccessModal: 'loginSuccessModal',
  logoutModal: 'logoutModal',
  updatePinSuccessModal: 'updatePinSuccessModal',
};

describe('ModalPopupNames', () => {
  it('should match the object keys', () => {
    expect(Object.keys(mockModalPopupNames)).toMatchObject(
      Object.keys(ModalPopupNames)
    );
  });
});
