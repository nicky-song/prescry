// Copyright 2021 Prescryptive Health, Inc.

import {
  IprescriptionTransferConfirmationScreenContent,
  prescriptionTransferConfirmationScreenContent,
} from './prescription-transfer-confirmation.screen.content';

describe('PrescriptionTransferConfirmationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IprescriptionTransferConfirmationScreenContent = {
      heading: 'Your order',
      confirmationText: 'You should see a confirmation via text message.',
    };

    expect(prescriptionTransferConfirmationScreenContent).toEqual(
      expectedContent
    );
  });
});
