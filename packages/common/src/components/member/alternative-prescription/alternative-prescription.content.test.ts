// Copyright 2021 Prescryptive Health, Inc.

import { alternativePrescriptionContent } from './alternative-prescription.content';

describe('ClaimAlertSavingDetailsContent', () => {
  it('has expected content', () => {
    expect(alternativePrescriptionContent.youPayLabel()).toEqual('You pay');
    expect(alternativePrescriptionContent.employerPayLabel()).toEqual(
      'Your plan pays'
    );
  });
});
