// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { ILimitedPatient } from '@phx/common/src/models/patient-profile/limited-patient';
import {
  IActiveExpiredPatientsResponse,
  IPatientDependentsResponse,
} from '@phx/common/src/models/patient-profile/patient-profile';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { Response } from 'express';
import { formatPhoneNumberForApi } from '@phx/common/src/utils/formatters/phone-number.formatter';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  mockAdultDependentPatient,
  mockChildDependentPatient,
  mockChildPbmDependentPatient,
  mockPatient,
  mockPatientWithEmail,
  mockPbmPatient,
} from '../../mock-data/fhir-patient.mock';
import { IAppLocals } from '../../models/app-locals';
import { IHumanName } from '../../models/fhir/human-name';
import { Identifier } from '../../models/fhir/identifier';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../../models/fhir/patient/patient';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../models/patient-profile';
import { getPatientCoverageByFamilyId } from '../coverage/get-patient-coverage-by-family-id';
import {
  buildFirstName,
  buildLastName,
  getHumanName,
  matchFirstName,
} from '../fhir/human-name.helper';
import {
  getMobileContactPhone,
  getPreferredEmailFromPatient,
} from './get-contact-info-from-patient';
import {
  arePatientIdentityDetailsValid,
  buildMemberId,
  buildPatientIdentifiers,
  doesPatientBirthDateMatch,
  doesPatientEmailMatch,
  doesPatientPhoneNumberMatch,
  doPatientFirstNameMatch,
  doPatientNamesMatch,
  formatDependentNumber,
  getAllActivePatientsForLoggedInUser,
  getAllMemberIdsFromPatients,
  getAllPrimaryMemberIdsFromPatients,
  getNextAvailablePersonCodePatientCoverages,
  getPatientDependentByMasterIdAndRxGroupType,
  getPatientWithMemberId,
  mapPatientDependentsToResponse,
  mapPatientToLimitedPatient,
} from './patient.helper';

jest.mock('./get-contact-info-from-patient');
const getMobileContactPhoneMock = getMobileContactPhone as jest.Mock;
const getPreferredEmailFromPatientMock =
  getPreferredEmailFromPatient as jest.Mock;

jest.mock('../fhir/human-name.helper');
const getHumanNameMock = getHumanName as jest.Mock;
const buildLastNameMock = buildLastName as jest.Mock;
const buildFirstNameMock = buildFirstName as jest.Mock;
const matchFirstNameMock = matchFirstName as jest.Mock;

jest.mock('../coverage/get-patient-coverage-by-family-id');
const getPatientCoverageByFamilyIdMock =
  getPatientCoverageByFamilyId as jest.Mock;

describe('patientHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPatientCoverageByFamilyIdMock.mockResolvedValue(undefined);
  });

  describe('formatDependentNumber', () => {
    it.each([
      [1, '01'],
      [2, '02'],
      [10, '10'],
    ])(
      'formats dependent number %p',
      (dependentNumberMock: number, expected: string) => {
        expect(formatDependentNumber(dependentNumberMock)).toEqual(expected);
      }
    );
  });

  describe('buildMemberId', () => {
    const memberFamilyIdMock = 'member-family-id';

    it.each([
      [1, `${memberFamilyIdMock}01`],
      [2, `${memberFamilyIdMock}02`],
      [10, `${memberFamilyIdMock}10`],
    ])(
      'builds member id for dependent number %p',
      (dependentNumberMock: number, expected: string) => {
        expect(buildMemberId(memberFamilyIdMock, dependentNumberMock)).toEqual(
          expected
        );
      }
    );
  });

  describe('buildPatientIdentifiers', () => {
    it('builds identifiers for patient', () => {
      const familyIdMock = 'family-id';
      const memberIdMock = 'member-id';
      const phoneNumberMock = 'phone-number';

      const identifiers = buildPatientIdentifiers(
        familyIdMock,
        memberIdMock,
        phoneNumberMock
      );

      const identifierTypeSystemUrl =
        'http://hl7.org/fhir/ValueSet/identifier-type';
      const expectedIdentifiers: Identifier[] = [
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.PHONE_NUMBER,
                display: "Patient's MyRx Phone Number",
                system: identifierTypeSystemUrl,
              },
            ],
          },
          value: formatPhoneNumberForApi(phoneNumberMock),
        },
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
                display: 'Unique MyRx ID',
                system: identifierTypeSystemUrl,
              },
            ],
          },
          value: memberIdMock,
        },
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.FAMILY_ID,
                display: "Patient's Cash Family Id",
                system: identifierTypeSystemUrl,
              },
            ],
          },
          value: familyIdMock,
        },
      ];

      expect(identifiers).toEqual(expectedIdentifiers);
    });
  });

  describe('arePatientIdentityDetailsValid', () => {
    const patientBirthDateMock = 'patient-birth-date';
    const patientPhoneNumberMock = 'patient-phone-number';
    const patientEmailMock = 'patient-email';

    it.each([
      ['phone-number', 'email', 'birth-date', false, false],
      [patientPhoneNumberMock, 'email', 'birth-date', true, false],
      [patientPhoneNumberMock, patientEmailMock, 'birth-date', true, false],
      [
        patientPhoneNumberMock,
        patientEmailMock.toLowerCase(),
        patientBirthDateMock,
        true,
        true,
      ],
      [
        patientPhoneNumberMock,
        patientEmailMock.toUpperCase(),
        patientBirthDateMock,
        true,
        true,
      ],
    ])(
      'validates identity information (phoneNumber: %p, email:%p, birthDate: %p)',
      (
        phoneNumberMock: string,
        emailMock: string,
        birthDateMock: string,
        isGetPreferredEmailCallExpected: boolean,
        isValidExpected: boolean
      ) => {
        getMobileContactPhoneMock.mockReturnValue(patientPhoneNumberMock);
        getPreferredEmailFromPatientMock.mockReturnValue(patientEmailMock);

        const patientWithBirthDateMock: IPatient = {
          ...mockPatient,
          birthDate: patientBirthDateMock,
        };

        const isValid = arePatientIdentityDetailsValid(
          patientWithBirthDateMock,
          phoneNumberMock,
          emailMock,
          birthDateMock
        );

        expectToHaveBeenCalledOnceOnlyWith(
          getMobileContactPhoneMock,
          patientWithBirthDateMock
        );

        if (isGetPreferredEmailCallExpected) {
          expectToHaveBeenCalledOnceOnlyWith(
            getPreferredEmailFromPatientMock,
            patientWithBirthDateMock
          );
        }

        expect(isValid).toEqual(isValidExpected);
      }
    );
  });

  describe('doesPatientPhoneNumberMatch', () => {
    it.each([
      [undefined, '+11234567890', false],
      ['+11111111111', '+11234567890', false],
      ['+11234567890', '+11234567890', true],
    ])(
      'checks if patient phone number matches given phone number (patientMobileNumber: %p, phoneNumber: %p)',
      (
        patientMobileNumberMock: string | undefined,
        phoneNumberMock: string,
        isMatchExpected: boolean
      ) => {
        getMobileContactPhoneMock.mockReturnValue(patientMobileNumberMock);

        const matches = doesPatientPhoneNumberMatch(
          mockPatient,
          phoneNumberMock
        );
        expectToHaveBeenCalledOnceOnlyWith(
          getMobileContactPhoneMock,
          mockPatient
        );

        expect(matches).toEqual(isMatchExpected);
      }
    );
  });

  describe('doesPatientEmailMatch', () => {
    it.each([
      [undefined, 'email', false],
      ['email1', 'email2', false],
      ['email', 'email', true],
      ['EMAIL', 'email', true],
      ['email', 'EMAIL', true],
      ['EMAIL', 'EMAIL', true],
    ])(
      'checks if patient email matches given email (patientEmail: %p, email: %p)',
      (
        patientEmailMock: string | undefined,
        emailMock: string,
        isMatchExpected: boolean
      ) => {
        getPreferredEmailFromPatientMock.mockReturnValue(patientEmailMock);

        const matches = doesPatientEmailMatch(mockPatient, emailMock);
        expectToHaveBeenCalledOnceOnlyWith(
          getPreferredEmailFromPatientMock,
          mockPatient
        );

        expect(matches).toEqual(isMatchExpected);
      }
    );
  });

  describe('doesPatientBirthDateMatch', () => {
    it.each([
      ['2022-10-24', '2022-10-23', false],
      ['2022-10-24', '2022-10-24', true],
    ])(
      'checks if patient birth date matches given birth date (patientBirthDate: %p, birthDate: %p)',
      (
        patientBirthDate: string,
        birthDateMock: string,
        isMatchExpected: boolean
      ) => {
        const patientWithBirthDateMock: IPatient = {
          ...mockPatient,
          birthDate: patientBirthDate,
        };

        const matches = doesPatientBirthDateMatch(
          patientWithBirthDateMock,
          birthDateMock
        );

        expect(matches).toEqual(isMatchExpected);
      }
    );
  });

  describe('doPatientNamesMatch', () => {
    it.each([
      ['last-name', 'last-name', false, false],
      ['', 'last-name', true, false],
      ['last-name', 'last-name', true, true],
      ['last-name', 'LAST-NAME', true, true],
      ['LAST-NAME', 'last-name', true, true],
      ['LAST-NAME', 'LAST-NAME', true, true],
    ])(
      'checks if patient names matches given names (officialName: %p, lastName: %p, firstName: %p)',
      (
        patientLastNameMock: string,
        lastNameMock: string,
        firstNameMatchesMock: boolean,
        isMatchExpected: boolean
      ) => {
        buildLastNameMock.mockReturnValue(patientLastNameMock);
        matchFirstNameMock.mockReturnValue(firstNameMatchesMock);

        const namesMock: IHumanName = {
          use: 'official',
          family: 'family',
          given: ['first', 'middle'],
        };
        getHumanNameMock.mockReturnValue(namesMock);

        const firstNameMock = 'first-name';

        const matches = doPatientNamesMatch(
          mockPatient,
          firstNameMock,
          lastNameMock
        );

        expectToHaveBeenCalledOnceOnlyWith(
          getHumanNameMock,
          mockPatient.name,
          'official'
        );
        expectToHaveBeenCalledOnceOnlyWith(buildLastNameMock, namesMock);

        if (matchFirstNameMock.mock.calls.length) {
          expectToHaveBeenCalledOnceOnlyWith(
            matchFirstNameMock,
            firstNameMock,
            namesMock ? [namesMock] : []
          );
        }

        expect(matches).toEqual(isMatchExpected);
      }
    );
  });

  describe('getPatientWithMemberId', () => {
    const memberId1Mock = 'member-id1';
    const patient1Mock: IPatient = {
      ...mockPatient,
      identifier: [
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
              },
            ],
          },
          value: memberId1Mock,
        },
      ],
    };

    const memberId2Mock = 'member-id2';
    const patient2Mock: IPatient = {
      ...mockPatient,
      identifier: [
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
              },
            ],
          },
          value: memberId2Mock,
        },
      ],
    };

    it.each([
      ['x', undefined],
      [memberId1Mock, patient1Mock],
      [memberId2Mock, patient2Mock],
    ])(
      'gets patient, if any, with member id %p',
      (memberIdMock: string, expectedPatient: IPatient | undefined) => {
        const patientsMock: IPatient[] = [patient1Mock, patient2Mock];

        const patient = getPatientWithMemberId(patientsMock, memberIdMock);

        expect(patient).toEqual(expectedPatient);
      }
    );
  });

  describe('doPatientFirstNameMatch', () => {
    it.each([
      ['non-matching-first-name', false],
      ['first-name', true],
    ])(
      'checks if patient first name matches given first name (first name: %p, doFirstNameMatch %p)',
      (firstNameMock: string, doFirstNameMatch: boolean) => {
        matchFirstNameMock.mockReturnValue(doFirstNameMatch);

        const namesMock: IHumanName = {
          use: 'official',
          family: 'family',
          given: ['first-name', 'middle'],
        };
        getHumanNameMock.mockReturnValue(namesMock);

        const matches = doPatientFirstNameMatch(mockPatient, firstNameMock);

        expectToHaveBeenCalledOnceOnlyWith(
          getHumanNameMock,
          mockPatient.name,
          'official'
        );

        if (matchFirstNameMock.mock.calls.length) {
          expectToHaveBeenCalledOnceOnlyWith(
            matchFirstNameMock,
            firstNameMock,
            namesMock ? [namesMock] : []
          );
        }

        expect(matches).toEqual(doFirstNameMatch);
      }
    );
  });

  describe('getPatientDependentByMasterIdAndRxGroupType', () => {
    const patientDependentsMock: IPatientDependents[] = [
      {
        rxGroupType: RxGroupTypesEnum.CASH,
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
        adultMembers: {
          activePatients: [mockAdultDependentPatient],
        },
      },
    ];

    it('returns undefined if patient dependent is not found', () => {
      const invalidMasterId = 'invalid-master-id';

      const actual = getPatientDependentByMasterIdAndRxGroupType(
        patientDependentsMock,
        invalidMasterId,
        RxGroupTypesEnum.CASH
      );

      expect(actual).toEqual(undefined);
    });

    it('returns patient dependent if patient dependent is found', () => {
      const masterId = 'patient-id3';

      const actual = getPatientDependentByMasterIdAndRxGroupType(
        patientDependentsMock,
        masterId,
        RxGroupTypesEnum.CASH
      );

      const expectedPatientDependent = mockAdultDependentPatient;

      expect(actual).toEqual(expectedPatientDependent);
    });
  });

  describe('getNextAvailablePersonCodePatientCoverages', () => {
    it('returns default person code num when first dependent is created', async () => {
      const primaryMemberFamilyIdMock = 'family-id';

      getPatientCoverageByFamilyIdMock.mockResolvedValue(undefined);

      const actual = await getNextAvailablePersonCodePatientCoverages(
        primaryMemberFamilyIdMock,
        configurationMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientCoverageByFamilyIdMock,
        configurationMock,
        primaryMemberFamilyIdMock
      );

      expect(actual).toEqual(3);
    });

    it('returns next available person code num', async () => {
      const primaryMemberFamilyIdMock = 'family-id';

      const coverageResponseMock1: Partial<ICoverage> = {
        resourceType: 'Coverage',
        id: 'MOCK-ID1',
        status: 'active',
        subscriberId: 'family-id',
        dependent: '01',
      };

      const coverageResponseMock2: Partial<ICoverage> = {
        resourceType: 'Coverage',
        id: 'MOCK-ID2',
        status: 'active',
        subscriberId: 'family-id',
        dependent: '03',
      };

      getPatientCoverageByFamilyIdMock.mockResolvedValue([
        coverageResponseMock1,
        coverageResponseMock2,
      ]);

      const actual = await getNextAvailablePersonCodePatientCoverages(
        primaryMemberFamilyIdMock,
        configurationMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientCoverageByFamilyIdMock,
        configurationMock,
        primaryMemberFamilyIdMock
      );

      expect(actual).toEqual(4);
    });
  });

  describe('mapPatientDependentsToResponse', () => {
    const patientDependentsMock: IPatientDependents[] = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [],
        },
        adultMembers: {
          activePatients: [mockAdultDependentPatient],
        },
      },
    ];

    it('returns patient dependents response', () => {
      const childActiveExpiredPatientMock = {
        activePatients: [],
        expiredPatients: [],
      } as IActiveExpiredPatientsResponse;

      const adultActiveExpiredPatientMock = {
        activePatients: [
          {
            firstName: 'DIAN',
            lastName: 'ALAM',
            dateOfBirth: '2005-01-01',
            phoneNumber: '+9999999999',
            recoveryEmail: 'EMAIL',
            masterId: 'patient-id3',
            memberId: 'myrx-id-03',
            rxGroupType: 'CASH',
            rxSubGroup: 'CASH01',
          } as ILimitedPatient,
        ],
        expiredPatients: [],
      } as IActiveExpiredPatientsResponse;

      const patientDependentsResponseMock = {
        rxGroupType: RxGroupTypesEnum.CASH,
        childMembers: childActiveExpiredPatientMock,
        adultMembers: adultActiveExpiredPatientMock,
      } as IPatientDependentsResponse;

      const dependents = [patientDependentsResponseMock];

      getHumanNameMock.mockReturnValue(mockAdultDependentPatient.name);
      buildFirstNameMock.mockReturnValue('DIAN');
      buildLastNameMock.mockReturnValue('ALAM');
      getMobileContactPhoneMock.mockReturnValue('+9999999999');
      getPreferredEmailFromPatientMock.mockReturnValue('EMAIL');

      const actual = mapPatientDependentsToResponse(patientDependentsMock);

      expect(actual).toEqual(dependents);
    });
  });

  describe('mapPatientToLimitedPatient', () => {
    it('returns limited patient mapped from patient', () => {
      const actual = mapPatientToLimitedPatient(
        mockPatientWithEmail,
        RxGroupTypesEnum.CASH
      );

      const limitedPatientMock = {
        firstName: 'DIAN',
        lastName: 'ALAM',
        dateOfBirth: '1980-01-01',
        masterId: 'patient-id',
        memberId: 'member-id',
        phoneNumber: '+9999999999',
        recoveryEmail: 'EMAIL',
        rxGroupType: 'CASH',
        rxSubGroup: 'CASH01',
      } as ILimitedPatient;

      expect(actual).toEqual(limitedPatientMock);
    });
  });

  describe('getAllActivePatientsForLoggedInUser', () => {
    const expiredCashChildDependentPatientMock: IPatient = {
      ...mockChildDependentPatient,
      id: 'expired-cash-child',
    };
    const expiredPbmChildDependentPatientMock: IPatient = {
      ...mockChildDependentPatient,
      id: 'expired-pbm-child',
    };
    const expiredCashAdultDependentPatientMock: IPatient = {
      ...mockAdultDependentPatient,
      id: 'expired-cash-adult',
    };
    const expiredPbmAdultDependentPatientMock: IPatient = {
      ...mockChildDependentPatient,
      id: 'expired-pbm-adult',
    };

    const patientProfilesMock: IPatientProfile[] = [
      {
        rxGroupType: RxGroupTypesEnum.CASH,
        primary: mockPatient,
      },
      {
        rxGroupType: RxGroupTypesEnum.SIE,
        primary: mockPbmPatient,
      },
    ];
    const patientDependentsMock: IPatientDependents[] = [
      {
        rxGroupType: RxGroupTypesEnum.CASH,
        childMembers: {
          activePatients: [mockChildDependentPatient],
          expiredPatients: [expiredCashChildDependentPatientMock],
        },
        adultMembers: {
          activePatients: [mockAdultDependentPatient],
          expiredPatients: [expiredCashAdultDependentPatientMock],
        },
      },
      {
        rxGroupType: RxGroupTypesEnum.SIE,
        childMembers: {
          activePatients: [mockChildPbmDependentPatient],
          expiredPatients: [expiredPbmChildDependentPatientMock],
        },
        adultMembers: {
          activePatients: [],
          expiredPatients: [expiredPbmAdultDependentPatientMock],
        },
      },
    ];

    it.each([
      [[], [], []],
      [patientProfilesMock, [], [mockPatient, mockPbmPatient]],
      [
        patientProfilesMock,
        patientDependentsMock,
        [
          mockPatient,
          mockPbmPatient,
          mockChildDependentPatient,
          mockAdultDependentPatient,
          mockChildPbmDependentPatient,
        ],
      ],
    ])(
      'gets all active patient records from response object (profiles: %p, dependents: %p)',
      (
        patientProfilesMock: IPatientProfile[],
        patientDependentsMock: IPatientDependents[],
        expectedPatients: IPatient[]
      ) => {
        const responseLocals: Partial<IAppLocals> = {
          patientProfiles: patientProfilesMock,
          patientDependents: patientDependentsMock,
        };
        const responseMock = {
          locals: responseLocals,
        } as Response;

        const patients = getAllActivePatientsForLoggedInUser(responseMock);

        expect(patients.length).toEqual(expectedPatients.length);

        patients.forEach((patient) => {
          expect(expectedPatients).toContain(patient);
        });
      }
    );
  });

  describe('getAllMemberIdsFromPatients', () => {
    it('returns member ids from patients', () => {
      const memberIdMock1 = 'member-id-mock1';
      const memberIdMock2 = 'member-id-mock2';

      const patientMock1: IPatient = {
        ...mockPatient,
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'MYRX',
                },
              ],
            },
            value: memberIdMock1,
          },
        ],
      };

      const patientMock2: IPatient = {
        ...mockPatient,
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'MB',
                },
              ],
            },
            value: memberIdMock2,
          },
        ],
      };

      const patientsMock = [patientMock1, patientMock2];

      const expectedMemberIds = [memberIdMock1, memberIdMock2];

      const actual = getAllMemberIdsFromPatients(patientsMock);

      expect(actual).toEqual(expectedMemberIds);
    });
  });

  describe('getAllPrimaryMemberIdsFromPatients', () => {
    const patientProfilesMock: IPatientProfile[] = [
      {
        rxGroupType: RxGroupTypesEnum.CASH,
        primary: mockPatient,
      },
      {
        rxGroupType: RxGroupTypesEnum.SIE,
        primary: mockPbmPatient,
      },
    ];

    it.each([
      [[], []],
      [patientProfilesMock, ['member-id', 'member-id']],
    ])(
      'gets all primary member ids from response object (profiles: %p, dependents: %p)',
      (patientProfilesMock: IPatientProfile[], expectedMemberIds: string[]) => {
        const responseLocals: Partial<IAppLocals> = {
          patientProfiles: patientProfilesMock,
        };
        const responseMock = {
          locals: responseLocals,
        } as Response;

        const actual = getAllPrimaryMemberIdsFromPatients(responseMock);

        expect(actual.length).toEqual(expectedMemberIds.length);

        actual.forEach((memberId) => {
          expect(expectedMemberIds).toContain(memberId);
        });
      }
    );
  });
});
