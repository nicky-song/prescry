// Copyright 2022 Prescryptive Health, Inc.

import {
  mockPatientEmailAndPhone,
  mockPatientNoTelecom,
  mockPatientOnlyEmail,
  mockPatientOnlyPhone,
  mockPatientUpdatedEmail,
} from '../../mock-data/fhir-patient.mock';
import { IPatient } from '../../models/fhir/patient/patient';

import { updatePatientContactInfo } from './update-patient-contact-info';

describe('updatePatientContactInfo', () => {
  it('Adds a telecom with new contact info if no telecom in patient', () => {
    const updatedPatient = updatePatientContactInfo(
      mockPatientNoTelecom,
      'home',
      'email',
      'test@prescryptive.com'
    );
    expect(updatedPatient).toEqual(mockPatientOnlyEmail);
  });
  it('Adds an element to telecom with new contact info if empty telecom in patient', () => {
    const mockPatientEmptyTelecom: IPatient = {
      ...mockPatientNoTelecom,
      telecom: [],
    };
    const updatedPatient = updatePatientContactInfo(
      mockPatientEmptyTelecom,
      'home',
      'email',
      'test@prescryptive.com'
    );
    expect(updatedPatient).toEqual(mockPatientOnlyEmail);
  });

  it('Updates the element in telecom with new contact info if it already exists in telecom in patient', () => {
    const updatedPatient = updatePatientContactInfo(
      mockPatientOnlyEmail,
      'home',
      'email',
      'testnew@prescryptive.com'
    );
    expect(updatedPatient).toEqual(mockPatientUpdatedEmail);
  });
  it('add new elements to telecom with contact info where there are other contact info available', () => {
    const updatedPatient = updatePatientContactInfo(
      mockPatientOnlyPhone,
      'home',
      'email',
      'test@prescryptive.com'
    );
    expect(updatedPatient).toEqual(mockPatientEmailAndPhone);
  });
});
