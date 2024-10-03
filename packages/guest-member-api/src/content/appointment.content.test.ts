// Copyright 2020 Prescryptive Health, Inc.

import { appointmentContent } from './appointment.content';

describe('AppointmentContent', () => {
  it('should have expected content', () => {
    expect(appointmentContent.appointmentAcceptText())
      .toEqual(`Prescryptive: Your appointment with {providerName} on {appointmentDate} at {appointmentTime} is confirmed.
Address: {address}, {city}, {state} {zip}

{cancellation-policy} To cancel, visit \n {cancellationSupport}`);
    expect(appointmentContent.administrationNasalDetail).toEqual(`Nasal Swab`);
    expect(appointmentContent.administrationNasalOrSwabDetail).toEqual(
      `Nasal Swab or Saliva Specimen`
    );
    expect(appointmentContent.administrationBloodSampleDetail).toEqual(
      `Blood Sample`
    );
    expect(appointmentContent.sourceOfSwabDetail).toEqual(
      `Pharmacist Administered/Observed`
    );
    expect(appointmentContent.testTypePcrDetail).toEqual(
      `Viral - COVID-19 (SARS-CoV-2) Molecular Assay By – RT-PCR (NAAT, Nucleic Acid Amplification Test)`
    );
    expect(appointmentContent.testTypeAntigenDetail).toEqual(
      `Viral – COVID-19 Antigen`
    );
    expect(appointmentContent.testTypeAntibodyDetail).toEqual(
      `SARS-CoV-2 Serology (COVID-19)`
    );
    expect(appointmentContent.phoneNumberLabel).toEqual(`Phone Number`);
    expect(appointmentContent.cliaLabel).toEqual(`CLIA`);
    expect(appointmentContent.patientLabel).toEqual(`Patient`);
    expect(appointmentContent.dobLabel).toEqual(`DOB`);
    expect(appointmentContent.serviceNameLabel).toEqual(`Service Name`);
    expect(appointmentContent.resultLabel).toEqual(`Result`);
    expect(appointmentContent.testType).toEqual(`Test Type`);
    expect(appointmentContent.dateOfService).toEqual(`Date of Service`);
    expect(appointmentContent.manufacturer).toEqual(`Manufacturer`);
    expect(appointmentContent.timeOfService).toEqual(`Time of service`);
    expect(appointmentContent.administeredMethod).toEqual(
      `Administered Method`
    );
    expect(appointmentContent.resultDateLabel).toEqual(`Result Date`);
    expect(appointmentContent.sourceOfSwabLabel).toEqual(`Source of swab`);
    expect(appointmentContent.testNotesLabel).toEqual(`Test Notes`);
    expect(appointmentContent.footerLabel).toEqual(
      `Access your digital test results on myPrescryptive at any time`
    );
    expect(appointmentContent.appointmentReceiptLabel).toEqual(
      `Appointment Receipt`
    );
    expect(appointmentContent.procedureCodeLabel).toEqual(`Procedure code`);
    expect(appointmentContent.diagnosisCodeLabel).toEqual(`Diagnosis code`);
    expect(appointmentContent.providerNameLabel).toEqual(`Provider's name`);
    expect(appointmentContent.testKitLabel).toEqual(`Test kit`);
    expect(appointmentContent.amountLabel).toEqual(`Amount`);
    expect(appointmentContent.totalLabel).toEqual(`Total (USD)`);
    expect(appointmentContent.paymentStatusLabel).toEqual(`Payment status`);
    expect(appointmentContent.npiLabel).toEqual(`NPI:`);
    expect(appointmentContent.orderLabel).toEqual(`Order #`);
  });
});
