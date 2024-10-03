// Copyright 2020 Prescryptive Health, Inc.

export const appointmentContent = {
  appointmentAcceptText:
    () => `Prescryptive: Your appointment with {providerName} on {appointmentDate} at {appointmentTime} is confirmed.
Address: {address}, {city}, {state} {zip}

{cancellation-policy} To cancel, visit \n {cancellationSupport}`,
  administrationNasalDetail: 'Nasal Swab',
  administrationNasalOrSwabDetail: 'Nasal Swab or Saliva Specimen',
  administrationBloodSampleDetail: 'Blood Sample',
  sourceOfSwabDetail: 'Pharmacist Administered/Observed',
  testTypePcrDetail:
    'Viral - COVID-19 (SARS-CoV-2) Molecular Assay By – RT-PCR (NAAT, Nucleic Acid Amplification Test)',
  testTypeAntigenDetail: 'Viral – COVID-19 Antigen',
  testTypeAntibodyDetail: 'SARS-CoV-2 Serology (COVID-19)',
  phoneNumberLabel: 'Phone Number',
  cliaLabel: 'CLIA',
  patientLabel: 'Patient',
  dobLabel: 'DOB',
  serviceNameLabel: 'Service Name',
  resultLabel: 'Result',
  testType: 'Test Type',
  dateOfService: 'Date of Service',
  manufacturer: 'Manufacturer',
  timeOfService: 'Time of service',
  administeredMethod: 'Administered Method',
  resultDateLabel: 'Result Date',
  sourceOfSwabLabel: 'Source of swab',
  testNotesLabel: 'Test Notes',
  footerLabel: 'Access your digital test results on myPrescryptive at any time',
  taxIdLabel: 'Tax ID',
  appointmentReceiptLabel: 'Appointment Receipt',
  procedureCodeLabel: 'Procedure code',
  diagnosisCodeLabel: 'Diagnosis code',
  providerNameLabel: `Provider's name`,
  testKitLabel: 'Test kit',
  amountLabel: 'Amount',
  totalLabel: 'Total (USD)',
  paymentStatusLabel: 'Payment status',
  npiLabel: 'NPI:',
  orderLabel: 'Order #',
};
