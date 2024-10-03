// Copyright 2023 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import moment from 'moment';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  cashCoverageDependentMock,
  coverageMock1,
} from '../../mock-data/fhir-coverage.mock';
import { mockPatient } from '../../mock-data/fhir-patient.mock';
import { getPatientCoverageByBeneficiaryId } from '../coverage/get-patient-coverage-by-beneficiary-id';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { mapPatientToPersonForAppointment } from './map-patient-to-person-for-appointment.helper';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';

jest.mock('../coverage/get-patient-coverage-by-beneficiary-id');
jest.mock('../fhir-patient/get-active-coverages-of-patient');
const getPatientCoverageByBeneficiaryIdMock =
  getPatientCoverageByBeneficiaryId as jest.Mock;
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('mapPatientToPersonForAppointment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns undefined if no active coverages found', async () => {
    getPatientCoverageByBeneficiaryIdMock.mockReturnValue(undefined);
    getActiveCoveragesOfPatientMock.mockReturnValue([]);

    const actual = await mapPatientToPersonForAppointment(
      mockPatient,
      configurationMock
    );

    expect(actual).toEqual(undefined);
  });

  it('returns undefined if multiple active coverages exist for patient', async () => {
    getPatientCoverageByBeneficiaryIdMock.mockReturnValue([
      cashCoverageDependentMock,
      cashCoverageDependentMock,
    ]);
    getActiveCoveragesOfPatientMock.mockReturnValue([
      cashCoverageDependentMock,
      cashCoverageDependentMock,
    ]);

    const actual = await mapPatientToPersonForAppointment(
      mockPatient,
      configurationMock
    );

    expect(actual).toEqual(undefined);
  });

  it('returns person mapped from patient', async () => {
    getPatientCoverageByBeneficiaryIdMock.mockReturnValue([coverageMock1]);
    getActiveCoveragesOfPatientMock.mockReturnValue([coverageMock1]);
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);
    const newCoverageMock1: Partial<ICoverage> = {
      ...coverageMock1,
      period: {
        start: coverageMock1.period?.start,
        end: moment(nowMock.toUTCString()).format('YYYY-MM-DD'),
      },
    };

    getPatientCoverageByBeneficiaryIdMock.mockReturnValue([newCoverageMock1]);

    const expectedPerson = {
      dateOfBirth: '1980-01-01',
      effectiveDate: moment(nowMock.toUTCString()).format('YYYYMMDD'),
      firstName: 'DIAN',
      isPrimary: false,
      lastName: 'ALAM',
      masterId: 'patient-id',
      phoneNumber: '+11111111111',
      primaryMemberFamilyId: 'family-id',
      primaryMemberPersonCode: '01',
      primaryMemberRxId: 'member-id',
    } as IPerson;

    const actual = await mapPatientToPersonForAppointment(
      mockPatient,
      configurationMock
    );

    expect(actual).toEqual(expectedPerson);
  });
});
