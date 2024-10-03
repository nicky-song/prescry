// Copyright 2020 Prescryptive Health, Inc.

import {
  AppointmentReceiptContent,
  IAppointmentReceiptContent,
} from './appointment-receipt.content';

describe('AppointmentLocationContent', () => {
  it('has expected content', () => {
    const expectedAppointmentReceiptContent: IAppointmentReceiptContent = {
      orderNumber: 'Order number',
      nameOfPatient: 'Name of patient',
      dateOfBirth: 'Date of birth',
      dateOfService: 'Date of service',
      placeOfService: 'Place of service',
      providersTaxId: `Provider's tax ID`,
      descriptionOfService: 'Description of service',
      procedureCode: 'Procedure code',
      diagnosisCode: 'Diagnosis code',
      providersLegalName: `Provider's legal name`,
      providersNpi: `Provider's NPI`,
      chargeForService: 'Charge for service',
      total: 'Total',
      paymentStatus: 'Payment Status',
      headerText: 'View receipt',
      statusPaid: 'Paid',
      statusNotRequired: 'Not required',
      statusRefunded: 'Refunded',
      testCostToPharmacy: 'Test kit',
      viewPDF: 'View PDF',
    };

    expect(AppointmentReceiptContent).toEqual(
      expectedAppointmentReceiptContent
    );
  });
});
