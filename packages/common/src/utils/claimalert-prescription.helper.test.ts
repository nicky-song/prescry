// Copyright 2022 Prescryptive Health, Inc.

import { ILoginScreenRouteProps } from '../experiences/guest-experience/login-screen/login-screen';
import { getClaimAlertOrPrescriptionIdFromUrl } from './claimalert-prescription.helper';

describe('getClaimAlertOrPrescriptionIdFromUrl', () => {
  it.each([
    ['/activate', undefined],
    ['results', undefined],
    ['/checkout/result', undefined],
    ['invite', undefined],
    ['/appointment/', undefined],
    ['/p/', undefined],
    [
      '/prescription/prescription-id',
      { prescriptionId: 'prescription-id', isBlockchain: false },
    ],
    [
      '/cabinet/bc/prescription-id',
      { prescriptionId: 'prescription-id', isBlockchain: true },
    ],
    ['/claim-alert-id/', { claimAlertId: 'claim-alert-id' }],
  ])(
    'renders expected content (urlPath: %p, output: %p)',
    (urlPath: string, expectedContent: ILoginScreenRouteProps | undefined) => {
      const actualContent = getClaimAlertOrPrescriptionIdFromUrl(urlPath);
      expect(actualContent).toEqual(expectedContent);
    }
  );
});
