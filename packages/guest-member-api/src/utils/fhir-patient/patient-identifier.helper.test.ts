// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { mockPatient } from '../../mock-data/fhir-patient.mock';
import { Identifier } from '../../models/fhir/identifier';
import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../../models/fhir/patient/patient';
import { findIdentifierForCodeableConceptCode } from '../fhir/identifier.helper';
import {
  getFamilyIdFromPatient,
  getMemberIdFromPatient,
} from './patient-identifier.helper';

jest.mock('../fhir/identifier.helper');
const findIdentifierForCodeableConceptCodeMock =
  findIdentifierForCodeableConceptCode as jest.Mock;

type GetIdentifierHelper = (
  patient: IPatient | undefined
) => string | undefined;

describe('patientIdentifierHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[getFamilyIdFromPatient], [getMemberIdFromPatient]])(
    'returns undefined if no patient passed to %p',
    (getIdentifierHelper: GetIdentifierHelper) => {
      expect(getIdentifierHelper(undefined)).toBeUndefined();
    }
  );

  it.each([
    [getFamilyIdFromPatient, PatientIdentifierCodeableConceptCode.FAMILY_ID],
    [getMemberIdFromPatient, PatientIdentifierCodeableConceptCode.MEMBER_ID],
  ])(
    'returns undefined from %p if no codeable concept exists for id %p',
    (
      getIdentifierHelper: GetIdentifierHelper,
      expectedIdCode: PatientIdentifierCodeableConceptCode
    ) => {
      findIdentifierForCodeableConceptCodeMock.mockReturnValue(undefined);

      const id = getIdentifierHelper(mockPatient);

      expectToHaveBeenCalledOnceOnlyWith(
        findIdentifierForCodeableConceptCodeMock,
        mockPatient.identifier,
        expectedIdCode
      );
      expect(id).toBeUndefined();
    }
  );

  it.each([
    [getFamilyIdFromPatient, PatientIdentifierCodeableConceptCode.FAMILY_ID],
    [getMemberIdFromPatient, PatientIdentifierCodeableConceptCode.MEMBER_ID],
  ])(
    'returns id from %p when it exists for %p',
    (
      getIdentifierHelper: GetIdentifierHelper,
      expectedIdCode: PatientIdentifierCodeableConceptCode
    ) => {
      const idMock = 'id';
      const identifierMock: Identifier = {
        value: idMock,
      };
      findIdentifierForCodeableConceptCodeMock.mockReturnValue(identifierMock);

      const id = getIdentifierHelper(mockPatient);

      expectToHaveBeenCalledOnceOnlyWith(
        findIdentifierForCodeableConceptCodeMock,
        mockPatient.identifier,
        expectedIdCode
      );
      expect(id).toEqual(idMock);
    }
  );
});
