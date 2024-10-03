// Copyright 2021 Prescryptive Health, Inc.

import {
  recoveryEmailSuccessModalContent,
  IRecoveryEmailSuccessModalContent,
} from './recovery-email-success-modal.content';

describe('recoveryEmailSuccessModalContent', () => {
  it('has expected content', () => {
    const expectedRecoveryEmailSuccessModalContent: IRecoveryEmailSuccessModalContent =
      {
        buttonText: 'Close',
        mainText: 'Your email has been successfully added.',
        titleText: 'Email added',
      };

    expect(recoveryEmailSuccessModalContent).toEqual(
      expectedRecoveryEmailSuccessModalContent
    );
  });
});
