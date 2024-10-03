// Copyright 2020 Prescryptive Health, Inc.

export interface IAppointmentReceiptContent {
  orderNumber: string;
  nameOfPatient: string;
  dateOfBirth: string;
  dateOfService: string;
  placeOfService: string;
  providersTaxId: string;
  descriptionOfService: string;
  procedureCode: string;
  diagnosisCode: string;
  providersLegalName: string;
  providersNpi: string;
  chargeForService: string;
  total: string;
  paymentStatus: string;
  headerText: string;
  statusPaid: string;
  statusNotRequired: string;
  statusRefunded: string;
  testCostToPharmacy: string;
  viewPDF: string;
}

export const AppointmentReceiptContent: IAppointmentReceiptContent = {
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
