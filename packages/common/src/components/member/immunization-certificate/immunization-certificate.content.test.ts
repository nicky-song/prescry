// Copyright 2021 Prescryptive Health, Inc.

import { ImmunizationCertificateContent } from './immunization-certificate.content';

describe('ImmunizationCertificateContent', () => {
  it('has expected result-agnostic styles', () => {
    expect(ImmunizationCertificateContent.dose).toEqual(`dose`);
    expect(ImmunizationCertificateContent.date).toEqual(`Date`);
    expect(ImmunizationCertificateContent.placeOfService).toEqual(
      `Place of service`
    );
    expect(ImmunizationCertificateContent.lotNumber).toEqual(`Lot number`);
  });
});
