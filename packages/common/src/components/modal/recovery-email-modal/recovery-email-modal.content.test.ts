// Copyright 2021 Prescryptive Health, Inc.

import { recoveryEmailModalContent } from './recovery-email-modal.content';

describe('recoveryEmailModalContent', () => {
  it('has expected content', () => {
    expect(recoveryEmailModalContent.buttonText).toEqual('Add');
    expect(recoveryEmailModalContent.emailError).toEqual(
      'Please enter a valid email address'
    );
    expect(recoveryEmailModalContent.emailPlaceHolder).toEqual('Email address');
    expect(recoveryEmailModalContent.mainText).toEqual(
      `Your recovery email is used to reach you in case we detect unusual activity in your account or you accidentally get locked out.`
    );
    expect(recoveryEmailModalContent.titleText).toEqual(`Add recovery email`);
  });
});
