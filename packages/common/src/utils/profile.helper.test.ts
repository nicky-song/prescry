// Copyright 2018 Prescryptive Health, Inc.

import { IFeaturesState } from '../experiences/guest-experience/guest-experience-features';
import { profileListMock } from '../experiences/guest-experience/__mocks__/profile-list.mock';
import {
  IProfile,
  IPrimaryProfile,
  RxGroupTypesEnum,
  IDependentProfile,
} from '../models/member-profile/member-profile-info';
import { ILimitedPatient } from '../models/patient-profile/limited-patient';
import {
  IActiveExpiredPatientsResponse,
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '../models/patient-profile/patient-profile';
import { CalculateAbsoluteAge } from './date-time-helper';
import {
  getHighestPriorityProfile,
  getProfileByMemberRxId,
  getProfileName,
  getProfilesByGroup,
  IMapPatientDependentsResponse,
  isPbmGroupType,
  isPbmMember,
  mapPatientDependents,
} from './profile.helper';

describe('getProfileName', () => {
  it('should return fullName if first-name and last-name are present', () => {
    const profileName = getProfileName('John', 'Doe');
    expect(profileName).toEqual('John Doe');
  });

  it('should return first-name if only first-name present', () => {
    const profileName = getProfileName('John', undefined);
    expect(profileName).toEqual('John');
  });

  it('should return last-name if only last-name present', () => {
    const profileName = getProfileName(undefined, 'Doe');
    expect(profileName).toEqual('Doe');
  });

  it('should return blank if both first-name and last-name absent', () => {
    const profileName = getProfileName(undefined, undefined);
    expect(profileName).toEqual('');
  });
});

describe('getProfilesByGroup', () => {
  it('should return an array of profiles for the given group', () => {
    const result = getProfilesByGroup(profileListMock, 'CASH');
    expect(result).toEqual([profileListMock[0]]);
  });

  it('should return an array of profiles for the given group from patientList as priority if patientList is passed', () => {
    const patientProfileResponseMock = {
      rxGroupType: RxGroupTypesEnum.CASH,
      primary: {
        firstName: 'first-name',
        lastName: 'last-name',
        dateOfBirth: '2000-01-01',
        phoneNumber: '+11111111111',
        recoveryEmail: 'email',
        memberId: 'member-id-mock',
        masterId: 'master-id-mock',
        rxGroupType: 'CASH',
        rxSubGroup: 'rx-sub-group',
      } as ILimitedPatient,
    } as IPatientProfileResponse;

    const patientListMock = [patientProfileResponseMock];

    const primaryMock = {
      firstName: patientProfileResponseMock?.primary?.firstName,
      lastName: patientProfileResponseMock?.primary?.lastName,
      dateOfBirth: patientProfileResponseMock?.primary?.dateOfBirth,
      rxGroupType: patientProfileResponseMock?.primary?.rxGroupType,
      rxSubGroup: patientProfileResponseMock?.primary?.rxSubGroup,
      phoneNumber: patientProfileResponseMock?.primary?.phoneNumber,
      masterId: patientProfileResponseMock?.primary.masterId,
      primaryMemberRxId: patientProfileResponseMock?.primary?.memberId,
      email: patientProfileResponseMock?.primary?.recoveryEmail,
      isPrimary: true,
    } as IPrimaryProfile;

    const profileMock = {
      rxGroupType: patientProfileResponseMock?.primary?.rxGroupType,
      primary: primaryMock,
    } as IProfile;

    const result = getProfilesByGroup(profileListMock, 'CASH', patientListMock);
    expect(result).toEqual([profileMock]);
  });

  describe('getHighestPriorityProfile', () => {
    it('should return undefined if no profiles are present', () => {
      const profileList = [] as IProfile[];
      expect(getHighestPriorityProfile(profileList)).toEqual(undefined);
    });
    it('should return cash profile if only cash profiles exist', () => {
      const profileList = [
        { rxGroupType: 'CASH', primary: {} as IPrimaryProfile } as IProfile,
      ];
      expect(getHighestPriorityProfile(profileList)).toEqual({
        rxGroupType: 'CASH',
        primary: {} as IPrimaryProfile,
      });
    });
    it('should return profile from patientList as priority if patientList is passed', () => {
      const profileList = [
        { rxGroupType: 'CASH', primary: {} as IPrimaryProfile } as IProfile,
      ];
      expect(getHighestPriorityProfile(profileList)).toEqual({
        rxGroupType: 'CASH',
        primary: {} as IPrimaryProfile,
      });
    });
    it('should return PBM profile if any PBM profiles exist', () => {
      const profileList = [
        {
          rxGroupType: 'CASH',
          primary: { identifier: '1234' } as IPrimaryProfile,
        },
        {
          rxGroupType: 'SIE',
          primary: { identifier: '2345' } as IPrimaryProfile,
        },
        {
          rxGroupType: 'CASH',
          primary: { identifier: '3456' } as IPrimaryProfile,
        },
      ];
      expect(getHighestPriorityProfile(profileList)).toEqual({
        rxGroupType: 'SIE',
        primary: { identifier: '2345' } as IPrimaryProfile,
      });
    });
  });
});

describe('getProfileByMemberRxId', () => {
  it('should return the profile matching the memberId passed:CASH Primary', () => {
    const result = getProfileByMemberRxId(profileListMock, 'CA7F7K01');
    expect(result).toEqual(profileListMock[0]);
  });
  it('should return the profile matching the memberId passed:CASH Child Members', () => {
    const result = getProfileByMemberRxId(profileListMock, 'CA7F7K03');
    expect(result).toEqual(profileListMock[0]);
  });
  it('should return the profile matching the memberId passed:CASH Adult Members', () => {
    const result = getProfileByMemberRxId(profileListMock, 'CA7F7K05');
    expect(result).toEqual(profileListMock[0]);
  });
  it('should return the profile matching the memberId passed:SIE Primary', () => {
    const result = getProfileByMemberRxId(profileListMock, 'SIECA7F7K01');
    expect(result).toEqual(profileListMock[1]);
  });
  it('should return the profile matching the memberId passed:SIE Adult Members', () => {
    const result = getProfileByMemberRxId(profileListMock, 'SIECA7F7K03');
    expect(result).toEqual(profileListMock[1]);
  });
});

describe('isPbmMember', () => {
  const primaryMemberMock: IPrimaryProfile = {
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '',
    identifier: '',
    phoneNumber: '',
    carrierPCN: 'carrierPCN',
    issuerNumber: 'issuerNumber',
    primaryMemberFamilyId: 'primaryMemberFamilyId',
    primaryMemberPersonCode: 'primaryMemberPersonCode',
    primaryMemberRxId: 'primaryMemberRxId',
    rxBin: 'rxBin',
    rxGroup: 'rxGroup',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxSubGroup: '',
  };

  it.each([
    [{ usegrouptypesie: true } as IFeaturesState, RxGroupTypesEnum.CASH, true],
    [
      { usegrouptypesie: false, usegrouptypecash: true } as IFeaturesState,
      RxGroupTypesEnum.SIE,
      false,
    ],
    [
      {
        usegrouptypesie: false,
        usegrouptypecash: false,
        usegrouptypecovid: true,
      } as IFeaturesState,
      RxGroupTypesEnum.SIE,
      false,
    ],
    [
      {
        usegrouptypesie: false,
        usegrouptypecash: false,
        usegrouptypecovid: false,
      } as IFeaturesState,
      RxGroupTypesEnum.CASH,
      false,
    ],
    [
      {
        usegrouptypesie: false,
        usegrouptypecash: false,
        usegrouptypecovid: false,
      } as IFeaturesState,
      RxGroupTypesEnum.COVID19,
      false,
    ],
    [
      {
        usegrouptypesie: false,
        usegrouptypecash: false,
        usegrouptypecovid: false,
      } as IFeaturesState,
      RxGroupTypesEnum.SIE,
      true,
    ],
  ])(
    'determines if user is a PBM plan member (features: %p, rxGroupType: %p)',
    (
      featuresMock: IFeaturesState,
      rxGroupTypeMock: RxGroupTypesEnum,
      expectedResult: boolean
    ) => {
      const profilesMock: IProfile[] = [
        {
          primary: primaryMemberMock,
          rxGroupType: rxGroupTypeMock,
        },
      ];

      expect(isPbmMember(profilesMock, featuresMock)).toEqual(expectedResult);
    }
  );
});

describe('isPbmGroupType', () => {
  it.each([
    [RxGroupTypesEnum.CASH, false],
    [RxGroupTypesEnum.COVID19, false],
    [RxGroupTypesEnum.SIE, true],
  ])(
    'determines PBM group types (groupType: %p)',
    (groupTypeMock: RxGroupTypesEnum, isPbmExpected: boolean) => {
      expect(isPbmGroupType(groupTypeMock)).toEqual(isPbmExpected);
    }
  );

  describe('mapPatientDependents', () => {
    it.each([[RxGroupTypesEnum.CASH], [RxGroupTypesEnum.SIE]])(
      'returns mapped dependents from patient dependents (rxGroupType %p)',
      (rxGroupTypeMock: RxGroupTypesEnum) => {
        const childPatientDependentCASHMock = {
          firstName: 'first-name',
          lastName: 'last-name',
          dateOfBirth: '2020-01-01',
          phoneNumber: '+11111111111',
          recoveryEmail: 'email',
          memberId: 'member-id-mock',
          masterId: 'master-id-mock',
          rxGroupType: 'CASH',
          rxSubGroup: 'rx-sub-group',
        } as ILimitedPatient;

        const adultPatientDependentCASHMock = {
          firstName: 'first-name',
          lastName: 'last-name',
          dateOfBirth: '2000-01-01',
          phoneNumber: '+11111111111',
          recoveryEmail: 'email',
          memberId: 'member-id-mock',
          masterId: 'master-id-mock',
          rxGroupType: 'CASH',
          rxSubGroup: 'rx-sub-group',
        } as ILimitedPatient;

        const childPatientDependentSIEMock = {
          firstName: 'first-name',
          lastName: 'last-name',
          dateOfBirth: '2020-01-01',
          phoneNumber: '+11111111111',
          recoveryEmail: 'email',
          memberId: 'member-id-mock',
          masterId: 'master-id-mock',
          rxGroupType: 'SIE',
          rxSubGroup: 'rx-sub-group',
        } as ILimitedPatient;

        const adultPatientDependentSIEMock = {
          firstName: 'first-name',
          lastName: 'last-name',
          dateOfBirth: '2000-01-01',
          phoneNumber: '+11111111111',
          recoveryEmail: 'email',
          memberId: 'member-id-mock',
          masterId: 'master-id-mock',
          rxGroupType: 'SIE',
          rxSubGroup: 'rx-sub-group',
        } as ILimitedPatient;

        const childActiveExpiredPatientCASHMock = {
          activePatients: [childPatientDependentCASHMock],
          expiredPatients: [],
        } as IActiveExpiredPatientsResponse;

        const adultActiveExpiredPatientCASHMock = {
          activePatients: [adultPatientDependentCASHMock],
          expiredPatients: [],
        } as IActiveExpiredPatientsResponse;

        const childActiveExpiredPatientSIEMock = {
          activePatients: [childPatientDependentSIEMock],
          expiredPatients: [],
        } as IActiveExpiredPatientsResponse;

        const adultActiveExpiredPatientSIEMock = {
          activePatients: [adultPatientDependentSIEMock],
          expiredPatients: [],
        } as IActiveExpiredPatientsResponse;

        const patientDependentsResponseMock1 = {
          rxGroupType: RxGroupTypesEnum.CASH,
          childMembers: childActiveExpiredPatientCASHMock,
          adultMembers: adultActiveExpiredPatientCASHMock,
        } as IPatientDependentsResponse;

        const patientDependentsResponseMock2 = {
          rxGroupType: RxGroupTypesEnum.SIE,
          childMembers: childActiveExpiredPatientSIEMock,
          adultMembers: adultActiveExpiredPatientSIEMock,
        } as IPatientDependentsResponse;

        const patientDependentsMock = [
          patientDependentsResponseMock1,
          patientDependentsResponseMock2,
        ];

        const childDependentMock = {
          firstName:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.firstName
              : childPatientDependentSIEMock.firstName,
          lastName:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.lastName
              : childPatientDependentSIEMock.lastName,
          phoneNumber:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.phoneNumber
              : childPatientDependentSIEMock.phoneNumber,
          email:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.recoveryEmail
              : childPatientDependentSIEMock.recoveryEmail,
          primaryMemberRxId:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.memberId
              : childPatientDependentSIEMock.memberId,
          masterId:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.masterId
              : childPatientDependentSIEMock.masterId,
          isPrimary: false,
          rxGroupType:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.rxGroupType
              : childPatientDependentSIEMock.rxGroupType,
          rxSubGroup:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.rxSubGroup
              : childPatientDependentSIEMock.rxSubGroup,
          age: CalculateAbsoluteAge(
            new Date(),
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? childPatientDependentCASHMock.dateOfBirth
              : childPatientDependentSIEMock.dateOfBirth
          ),
        } as IDependentProfile;

        const adultDependentMock = {
          firstName:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.firstName
              : adultPatientDependentSIEMock.firstName,
          lastName:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.lastName
              : adultPatientDependentSIEMock.lastName,
          phoneNumber:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.phoneNumber
              : adultPatientDependentSIEMock.phoneNumber,
          email:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.recoveryEmail
              : adultPatientDependentSIEMock.recoveryEmail,
          primaryMemberRxId:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.memberId
              : adultPatientDependentSIEMock.memberId,
          masterId:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.masterId
              : adultPatientDependentSIEMock.masterId,
          isPrimary: false,
          rxGroupType:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.rxGroupType
              : adultPatientDependentSIEMock.rxGroupType,
          rxSubGroup:
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.rxSubGroup
              : adultPatientDependentSIEMock.rxSubGroup,
          age: CalculateAbsoluteAge(
            new Date(),
            rxGroupTypeMock === RxGroupTypesEnum.CASH
              ? adultPatientDependentCASHMock.dateOfBirth
              : adultPatientDependentSIEMock.dateOfBirth
          ),
        } as IDependentProfile;

        const mapPatientDependentsResponseMock: IMapPatientDependentsResponse =
          {
            childDependents: [childDependentMock],
            adultDependents: [adultDependentMock],
          };

        const actual = mapPatientDependents(
          patientDependentsMock,
          rxGroupTypeMock
        );

        expect(actual).toEqual(mapPatientDependentsResponseMock);
      }
    );
  });
});
