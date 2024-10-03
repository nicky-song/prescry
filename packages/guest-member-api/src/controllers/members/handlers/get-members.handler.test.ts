// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  IDependentProfile,
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';
import {
  getAllDependentsForPrimaryProfile,
  getLoggedInUserProfileForRxGroupType,
} from '../../../utils/person/get-dependent-person.helper';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { setMembersTelemetryIds } from '../../../utils/telemetry-helper';
import { getMemberInfoBasedOnProfileType } from '../helpers/get-member-info-by-profile-type.helper';
import { getMembersHandler } from './get-members.handler';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { mapAccountDetails } from '../../../utils/person/person-helper';
import { EndpointVersion } from '../../../models/endpoint-version';
import {
  mockAdultDependentPatient,
  mockChildDependentPatient,
  mockPatient,
  mockPbmPatient,
} from '../../../mock-data/fhir-patient.mock';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../../models/patient-profile';
import {
  getPatientAndDependentsInfo,
  IGetPatientAndDependentInfoResponse,
} from '../../../utils/fhir-patient/patient.helper';
import {
  IActiveExpiredPatientsResponse,
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '@phx/common/src/models/patient-profile/patient-profile';
import { ILimitedPatient } from '@phx/common/src/models/patient-profile/limited-patient';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('../../../utils/person/person-helper');
jest.mock('../helpers/get-member-info-by-profile-type.helper');
jest.mock('../../../utils/telemetry-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/request-helper');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../../databases/mongo-database/v1/setup/setup-database');
jest.mock('../../../configuration');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/fhir-patient/patient.helper');

const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;
const setMembersTelemetryIdsMock = setMembersTelemetryIds as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;
const getAllDependentsForPrimaryProfileMock =
  getAllDependentsForPrimaryProfile as jest.Mock;
const getMemberInfoBasedOnProfileTypeMock =
  getMemberInfoBasedOnProfileType as jest.Mock;
const mapAccountDetailsMock = mapAccountDetails as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;
const getPatientAndDependentsInfoMock =
  getPatientAndDependentsInfo as jest.Mock;

const primaryPersonCASHMock: IPrimaryProfile = {
  email: 'fake-email',
  identifier: 'identifier-1',
  primaryMemberRxId: 'fake-id1',
  phoneNumber: 'phone-number',
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '2000-01-01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  primaryMemberFamilyId: 'fake-family-id',
  primaryMemberPersonCode: '01',
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH01',
};

const primaryPersonSIEMock: IPrimaryProfile = {
  identifier: 'identifier-2',
  primaryMemberRxId: 'fake-id2',
  phoneNumber: 'phone-number',
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '2000-01-01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  primaryMemberFamilyId: 'fake-family-id2',
  primaryMemberPersonCode: '01',
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
};
const primaryPersonList = [
  {
    identifier: 'identifier-1',
    primaryMemberRxId: 'fake-id1',
    phoneNumber: 'phone-number',
    firstName: 'fake-first',
    lastName: 'fake-last',
    dateOfBirth: '2000-01-01',
    isPhoneNumberVerified: true,
    isPrimary: true,
    primaryMemberFamilyId: 'fake-family-id',
    primaryMemberPersonCode: '01',
    rxGroupType: 'CASH',
    rxSubGroup: 'CASH01',
  } as IPerson,
  {
    identifier: 'identifier-2',
    primaryMemberRxId: 'fake-id2',
    phoneNumber: 'phone-number',
    firstName: 'fake-first',
    lastName: 'fake-last',
    dateOfBirth: '2000-01-01',
    isPhoneNumberVerified: true,
    isPrimary: true,
    primaryMemberFamilyId: 'fake-family-id2',
    primaryMemberPersonCode: '01',
    rxGroupType: 'SIE',
    rxSubGroup: 'HMA01',
  } as IPerson,
];
const dependentsMock = [
  {
    identifier: 'identifier-3',
    primaryMemberRxId: 'fake-id3',
    phoneNumber: 'phone-number',
    firstName: 'fake-child-first',
    lastName: 'fake-child-last',
    dateOfBirth: '2015-01-01',
    primaryMemberFamilyId: 'fake-family-id',
    primaryMemberPersonCode: '02',
    rxSubGroup: '',
    rxGroupType: 'CASH',
  } as IPerson,
  {
    identifier: 'identifier-4',
    primaryMemberRxId: 'fake-id4',
    phoneNumber: 'phone-number',
    firstName: 'fake-first-child2',
    lastName: 'fake-last-child2',
    dateOfBirth: '2005-01-01',
    isPrimary: false,
    primaryMemberFamilyId: 'fake-family-id',
    primaryMemberPersonCode: '03',
    rxSubGroup: '',
    rxGroupType: 'CASH',
  } as IPerson,
  {
    identifier: 'identifier-5',
    primaryMemberRxId: 'fake-id5',
    phoneNumber: 'phone-number',
    firstName: 'fake-first-child5',
    lastName: 'fake-last-child5',
    dateOfBirth: '2005-01-01',
    isPrimary: false,
    primaryMemberFamilyId: 'fake-family-id2',
    primaryMemberPersonCode: '06',
    rxSubGroup: '',
    rxGroupType: 'SIE',
  } as IPerson,
  {
    identifier: 'identifier-6',
    primaryMemberRxId: 'fake-id6',
    phoneNumber: 'phone-number',
    firstName: 'fake-first-child6',
    lastName: 'fake-last-child6',
    dateOfBirth: '2007-01-01',
    isPrimary: false,
    primaryMemberFamilyId: 'fake-family-id2',
    primaryMemberPersonCode: '08',
    rxSubGroup: '',
    rxGroupType: 'SIE',
  } as IPerson,
];

const accountMock = {
  _id: 'id',
  firstName: 'firstname',
  lastName: 'lastname',
};
const responseMock = {
  locals: {
    account: accountMock,
    personList: primaryPersonList,
    dependents: dependentsMock,
  },
} as unknown as Response;

const requestMock = {
  query: {},
} as unknown as Request;

const adultFamilyMember: IDependentProfile = {
  primaryMemberFamilyId: 'fake-family-id',
  identifier: 'id2',
  firstName: 'fake-first2',
  lastName: 'fake-last2',
  primaryMemberRxId: 'primary-2',
  isPrimary: false,
  primaryMemberPersonCode: '02',
  isLimited: true,
  rxSubGroup: 'CASH01',
};
const childFamilyMember: IDependentProfile = {
  primaryMemberFamilyId: 'fake-family-id',
  identifier: 'id3',
  firstName: 'fake-first3',
  lastName: 'fake-last3',
  primaryMemberRxId: 'primary-3',
  isPrimary: false,
  primaryMemberPersonCode: '03',
  isLimited: true,
  rxSubGroup: 'CASH01',
};

const v1: EndpointVersion = 'v1';
const v2: EndpointVersion = 'v2';

const requestV2Mock = {
  headers: {
    [RequestHeaders.apiVersion]: v2,
  },
} as Request;

describe('getMembersHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return members info from account if phone number doesnt exist in person collection', async () => {
    const responseMockWithoutPerson = {
      locals: {
        account: {
          firstName: 'firstname',
          lastName: 'lastname',
          dateOfBirth: 'Fri 31st dec (Pacific Standard Time)',
          recoveryEmail: '',
          phoneNumber: '+12345678945',
        },
      },
    } as unknown as Response;
    getResponseLocalMock.mockReturnValueOnce(undefined);
    getRequiredResponseLocalMock.mockReturnValueOnce({
      firstName: 'firstname',
      lastName: 'lastname',
    });
    const favoritedPharmaciesMock = ['ncpdp-mock'];
    mapAccountDetailsMock.mockReturnValueOnce({
      firstName: 'firstname',
      lastName: 'lastname',
      dateOfBirth: '2000-01-01',
      recoveryEmail: '',
      phoneNumber: '+12345678945',
      favoritedPharmacies: favoritedPharmaciesMock,
    });
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(undefined);
    fetchRequestHeaderMock.mockReturnValue('mockRequestid');
    setMembersTelemetryIdsMock.mockReturnValueOnce('mocktelemetryid');
    await getMembersHandler(
      requestMock,
      responseMockWithoutPerson,
      databaseMock,
      configurationMock
    );
    expect(fetchRequestHeaderMock).toHaveBeenCalled();
    expect(mapAccountDetailsMock).toHaveBeenCalled();
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMockWithoutPerson,
      null,
      {
        account: {
          firstName: 'firstname',
          lastName: 'lastname',
          dateOfBirth: '2000-01-01',
          recoveryEmail: '',
          phoneNumber: '+12345678945',
          favoritedPharmacies: favoritedPharmaciesMock,
        },
        profileList: [],
      },
      'mocktelemetryid'
    );
  });

  it.each([[v1], [v2]])(
    'should return CASH members info from Person and accountInfo from account if phone number exists in person (endpoint version %p)',
    async (endpointVersionMock: EndpointVersion) => {
      const patientDependentsMock: IPatientDependents[] = [
        {
          rxGroupType: 'CASH',
          childMembers: {
            activePatients: [mockChildDependentPatient],
          },
          adultMembers: {
            activePatients: [mockAdultDependentPatient],
          },
        },
      ];

      const patientListMock: IPatientProfile[] = [
        {
          rxGroupType: 'CASH',
          primary: mockPatient,
        },
        {
          rxGroupType: 'SIE',
          primary: mockPbmPatient,
        },
      ];

      const patientProfileResponseMock = {
        rxGroupType: RxGroupTypesEnum.CASH,
        primary: {
          firstName: 'first-name',
          lastName: 'last-name',
          dateOfBirth: '2000-01-01',
          phoneNumber: '+11111111111',
          recoveryEmail: 'email',
        } as ILimitedPatient,
      } as IPatientProfileResponse;

      const activeExpiredPatientMock = {
        activePatients: [
          {
            firstName: 'first-name',
            lastName: 'last-name',
            dateOfBirth: '2000-01-01',
            phoneNumber: '+11111111111',
            recoveryEmail: 'email',
          } as ILimitedPatient,
        ],
        expiredPatients: [],
      } as IActiveExpiredPatientsResponse;

      const patientDependentsResponseMock = {
        rxGroupType: RxGroupTypesEnum.CASH,
        childMembers: activeExpiredPatientMock,
        adultMembers: activeExpiredPatientMock,
      } as IPatientDependentsResponse;

      const patients = [patientProfileResponseMock];
      const dependents = [patientDependentsResponseMock];

      const getPatientAndDependentsInfoResponseMock = {
        patients,
        dependents,
      } as IGetPatientAndDependentInfoResponse;

      getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(
        responseMock.locals.personList[0]
      );

      if (endpointVersionMock === 'v2') {
        getResponseLocalMock
          .mockReturnValueOnce(patientDependentsMock)
          .mockReturnValueOnce(patientListMock)
          .mockReturnValueOnce(dependentsMock)
          .mockReturnValue(primaryPersonList);

        getPatientAndDependentsInfoMock.mockReturnValue(
          getPatientAndDependentsInfoResponseMock
        );
      } else {
        getResponseLocalMock
          .mockReturnValueOnce(dependentsMock)
          .mockReturnValueOnce(primaryPersonList);
      }

      getRequiredResponseLocalMock.mockReturnValueOnce({
        firstName: 'firstname',
        lastName: 'lastname',
      });

      const resultProfile = {
        rxGroupType: 'CASH',
        primary: primaryPersonCASHMock,
        childMembers: [childFamilyMember],
        adultMembers: [adultFamilyMember],
      };
      getMemberInfoBasedOnProfileTypeMock.mockReturnValueOnce(resultProfile);
      fetchRequestHeaderMock.mockReturnValueOnce('request-id');
      setMembersTelemetryIdsMock.mockReturnValueOnce('mocktelemetryid');
      await getMembersHandler(
        endpointVersionMock === v1 ? requestMock : requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
      );

      expect(getAllDependentsForPrimaryProfileMock).not.toHaveBeenCalled();
      expect(getMemberInfoBasedOnProfileTypeMock).toHaveBeenCalledWith(
        responseMock.locals.personList[0],
        responseMock.locals.dependents,
        'CASH',
        configurationMock.childMemberAgeLimit
      );
      expect(mapAccountDetailsMock).toHaveBeenCalled();
      expect(successResponseMock).toHaveBeenCalledWith(
        responseMock,
        null,
        {
          account: mapAccountDetailsMock(responseMock.locals.account),
          profileList: [resultProfile],
          ...(endpointVersionMock === 'v2' && {
            patientList: patients,
            patientDependents: dependents,
          }),
        },
        'mocktelemetryid'
      );

      if (endpointVersionMock === 'v2') {
        expect(getPatientAndDependentsInfoMock).toHaveBeenCalledWith(
          patientListMock,
          patientDependentsMock
        );
      }
    }
  );

  it('should return SIE members info from Person and accountInfo from account if phone number exists in person is SIE profile', async () => {
    const SIEDependentsMock = [
      ...dependentsMock,
      {
        identifier: 'identifier-6',
        primaryMemberRxId: 'fake-id6',
        phoneNumber: 'phone-number',
        firstName: 'fake-first-child6',
        lastName: 'fake-last-child6',
        dateOfBirth: '2018-01-01',
        isPrimary: false,
        primaryMemberFamilyId: 'fake-family-id2',
        primaryMemberPersonCode: '08',
        rxSubGroup: 'HMA01',
        rxGroupType: 'SIE',
      } as IPerson,
    ];
    getResponseLocalMock
      .mockReturnValueOnce(dependentsMock)
      .mockReturnValueOnce(primaryPersonList);
    getRequiredResponseLocalMock.mockReturnValueOnce(accountMock);

    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(
      responseMock.locals.personList[1]
    );
    getAllDependentsForPrimaryProfileMock.mockReturnValue(SIEDependentsMock);

    const resultProfile = {
      rxGroupType: 'SIE',
      primary: primaryPersonSIEMock,
      childMembers: [childFamilyMember],
      adultMembers: [adultFamilyMember],
    };
    getMemberInfoBasedOnProfileTypeMock.mockReturnValueOnce(resultProfile);
    fetchRequestHeaderMock.mockReturnValueOnce('request-id');
    setMembersTelemetryIdsMock.mockReturnValueOnce('mocktelemetryid');
    await getMembersHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(getAllDependentsForPrimaryProfileMock).toHaveBeenCalled();
    expect(getAllDependentsForPrimaryProfileMock).toHaveBeenCalledWith(
      databaseMock,
      primaryPersonSIEMock,
      dependentsMock
    );
    expect(getMemberInfoBasedOnProfileTypeMock).toHaveBeenCalledWith(
      responseMock.locals.personList[1],
      SIEDependentsMock,
      'SIE',
      configurationMock.childMemberAgeLimit
    );
    expect(mapAccountDetailsMock).toHaveBeenCalled();
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      null,
      {
        account: mapAccountDetailsMock(responseMock.locals.account),
        profileList: [resultProfile],
      },
      'mocktelemetryid'
    );
  });
});
