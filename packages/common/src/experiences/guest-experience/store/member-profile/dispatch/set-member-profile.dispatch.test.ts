// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import {
  ILimitedAccount,
  RxGroupTypesEnum,
} from '../../../../../models/member-profile/member-profile-info';
import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import {
  IActiveExpiredPatientsResponse,
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '../../../../../models/patient-profile/patient-profile';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import {
  formatAccountDetailsToPascalCase,
  formatMemberProfileListToPascalCase,
} from '../../member-list-info/utils/format-member-details-to-pascal-case';
import { setMemberProfileAction } from '../actions/set-member-profile.action';
import { setMemberProfileDispatch } from './set-member-profile.dispatch';

jest.mock('../../member-list-info/utils/format-member-details-to-pascal-case');
const formatAccountDetailsToPascalCaseMock =
  formatAccountDetailsToPascalCase as jest.Mock;
const formatMemberProfileListToPascalCaseMock =
  formatMemberProfileListToPascalCase as jest.Mock;

jest.mock('../actions/set-member-profile.action');
const setMemberProfileActionMock = setMemberProfileAction as jest.Mock;

describe('setMemberProfileDispatch', () => {
  it('dispatches members info action', async () => {
    const accountMock: ILimitedAccount = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      phoneNumber: 'fake-phone',
      recoveryEmail: 'test@test.com',
      favoritedPharmacies: [],
    };

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

    const patientListMock = [patientProfileResponseMock];
    const patientDependentsMock = [patientDependentsResponseMock];

    const responseData: IMemberInfoResponseData = {
      account: accountMock,
      profileList: profileListMock,
      patientDependents: patientDependentsMock,
      patientList: patientListMock,
    };

    formatAccountDetailsToPascalCaseMock.mockReturnValueOnce(accountMock);

    formatMemberProfileListToPascalCaseMock.mockReturnValueOnce(
      profileListMock
    );

    const dispatch = jest.fn();
    await setMemberProfileDispatch(dispatch, responseData);

    expectToHaveBeenCalledOnceOnlyWith(setMemberProfileActionMock, {
      account: accountMock,
      profileList: profileListMock,
      patientDependents: patientDependentsMock,
      patientList: patientListMock,
    });
  });
});
