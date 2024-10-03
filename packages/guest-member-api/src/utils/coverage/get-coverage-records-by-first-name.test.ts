// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../mock-data/configuration.mock';
import { IHumanName } from '../../models/fhir/human-name';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../models/fhir/patient/patient';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { matchFirstName } from '../fhir/human-name.helper';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { getCoverageRecordsByFirstName } from './get-coverage-records-by-first-name';

jest.mock('../get-master-id-from-coverage.helper');
const getMasterIdFromCoverageMock = getMasterIdFromCoverage as jest.Mock;

jest.mock('../external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('../fhir/human-name.helper');
const matchFirstNameMock = matchFirstName as jest.Mock;

describe('getCoverageRecordsByFirstName', () => {
  it('returns empty array if no coverage are found', async () => {
    const masterIdMock = 'master-id-mock';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    const firstNameMock = 'first-name-mock';

    getMasterIdFromCoverageMock.mockReturnValue(undefined);

    const actual = await getCoverageRecordsByFirstName(
      coveragesMock,
      firstNameMock,
      configurationMock
    );

    expect(getPatientByMasterIdMock).not.toBeCalled();
    expect(matchFirstNameMock).not.toBeCalled();
    expect(actual).toEqual([]);
  });

  it('returns empty array if no patient is found', async () => {
    const masterIdMock = 'master-id-mock';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    const firstNameMock = 'first-name-mock';

    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);
    getPatientByMasterIdMock.mockReturnValue(undefined);
    matchFirstNameMock.mockReturnValue(undefined);

    const actual = await getCoverageRecordsByFirstName(
      coveragesMock,
      firstNameMock,
      configurationMock
    );

    expect(getPatientByMasterIdMock).toHaveBeenCalledWith(
      masterIdMock,
      configurationMock
    );
    expect(matchFirstNameMock).not.toBeCalled();
    expect(actual).toEqual([]);
  });

  it('returns empty array if no patient is found', async () => {
    const masterIdMock = 'master-id-mock';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    const firstNameMock = 'first-name-mock';

    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);
    getPatientByMasterIdMock.mockReturnValue(undefined);
    matchFirstNameMock.mockReturnValue(undefined);

    const actual = await getCoverageRecordsByFirstName(
      coveragesMock,
      firstNameMock,
      configurationMock
    );

    expect(getPatientByMasterIdMock).toHaveBeenCalledWith(
      masterIdMock,
      configurationMock
    );
    expect(matchFirstNameMock).not.toBeCalled();
    expect(actual).toEqual([]);
  });

  it('returns coverages when first name match', async () => {
    const masterIdMock1 = 'master-id-mock';
    const masterIdMock2 = 'master-id-mock';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock1}`,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock2}`,
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    const firstNameMock = 'first-name-mock';

    const humanNameMock = [
      { family: 'family-mock', given: [firstNameMock] },
    ] as IHumanName[];

    const patientResponseMock: IPatient = {
      name: humanNameMock,
      birthDate: 'birthdate-mock',
    };

    getMasterIdFromCoverageMock
      .mockReturnValueOnce(masterIdMock1)
      .mockReturnValue(masterIdMock2);
    getPatientByMasterIdMock
      .mockReturnValueOnce(undefined)
      .mockReturnValue(patientResponseMock);
    matchFirstNameMock.mockReturnValue(humanNameMock);

    const actual = await getCoverageRecordsByFirstName(
      coveragesMock,
      firstNameMock,
      configurationMock
    );

    expect(getPatientByMasterIdMock).toHaveBeenNthCalledWith(
      1,
      masterIdMock1,
      configurationMock
    );
    expect(getPatientByMasterIdMock).toHaveBeenNthCalledWith(
      2,
      masterIdMock2,
      configurationMock
    );
    expect(matchFirstNameMock).toHaveBeenCalledTimes(1);
    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNameMock
    );
    expect(actual).toEqual([coverageResponseMock2]);
  });
});
