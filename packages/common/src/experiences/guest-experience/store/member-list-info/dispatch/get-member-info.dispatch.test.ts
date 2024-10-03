// Copyright 2018 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getMemberInfoDispatch } from './get-member-info.dispatch';
import { storeMemberDetailsApiResponseDispatch } from './store-member-details-api-response.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getMemberProfileInfo } from '../../../api/api-v1.get-member-profile';
import { IMemberInfoResponse } from '../../../../../models/api-response/member-info-response';
import {
  ILimitedAccount,
  IProfile,
  IPrimaryProfile,
  IDependentProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { storeMemberProfileApiResponseDispatch } from '../../member-profile/dispatch/store-member-profile-api-response.dispatch';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./store-member-details-api-response.dispatch');
const storeMemberDetailsApiResponseDispatchMock =
  storeMemberDetailsApiResponseDispatch as jest.Mock;

jest.mock(
  '../../member-profile/dispatch/store-member-profile-api-response.dispatch'
);
const storeMemberProfileApiResponseDispatchMock =
  storeMemberProfileApiResponseDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-member-profile');
const getMemberProfileInfoMock = getMemberProfileInfo as jest.Mock;

describe('getMemberInfoDispatch', () => {
  const stateMock = {
    config: {
      apis: {
        guestExperienceApi: 'xxx',
      },
    },
    settings: {
      deviceToken: 'device-token-x',
      token: 'token-x',
    },
  };

  const dispatchMock = jest.fn();
  const getStateMock = jest.fn().mockReturnValue({ ...stateMock });

  const accountMock: ILimitedAccount = {
    firstName: 'fake-first',
    lastName: 'fake-last',
    dateOfBirth: '01-01-2000',
    phoneNumber: 'fake-phone',
    recoveryEmail: 'test@test.com',
    favoritedPharmacies: [],
  };

  const profileListMock: IProfile[] = [
    {
      rxGroupType: 'CASH',
      primary: {
        email: '',
        firstName: 'ME',
        identifier: '6000b2fa965fa7b37c00a7b2',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 4,
      } as IPrimaryProfile,
      childMembers: [
        {
          email: '',
          firstName: 'TEST',
          identifier: '6000b2fa965fa7b37c00a7b3',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: 'TEST',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60013af2965fa7b37c00a7b4',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '05',
          primaryMemberRxId: 'CA7F7K05',
          rxSubGroup: 'CASH01',
          age: 20,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60130fb83068eb8cecfb055d',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>13<18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 13,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'CHILD',
          identifier: '60131183057357ba4a28b4dd',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>3',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
      ],
    },
    {
      rxGroupType: 'SIE',
      primary: {
        email: '',
        firstName: 'ME',
        identifier: '6000b2fa965fa7b37c00a7b2',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 4,
        dateOfBirth: '01/01/2000',
      } as IPrimaryProfile,
      adultMembers: [
        {
          email: '',
          firstName: 'TEST',
          identifier: '6000b2fa965fa7b37c00a7b3',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: 'TEST',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60013af2965fa7b37c00a7b4',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '05',
          primaryMemberRxId: 'CA7F7K05',
          rxSubGroup: 'CASH01',
          age: 20,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'ADULT',
          identifier: '60130fb83068eb8cecfb055d',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>13<18',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 13,
        } as IDependentProfile,
        {
          email: '',
          firstName: 'CHILD',
          identifier: '60131183057357ba4a28b4dd',
          isLimited: false,
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: '>3',
          phoneNumber: '',
          primaryMemberFamilyId: 'CA7F7K',
          primaryMemberPersonCode: '03',
          primaryMemberRxId: 'CA7F7K03',
          rxSubGroup: 'CASH01',
          age: 4,
        } as IDependentProfile,
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    storeMemberDetailsApiResponseDispatchMock.mockReset();
    storeMemberProfileApiResponseDispatchMock.mockReset();
    tokenUpdateDispatchMock.mockReset();
    getMemberProfileInfoMock.mockReset();
  });

  it('gets member profile info with a redirect responseCode', async () => {
    const responseMock: IMemberInfoResponse = {
      data: {
        account: accountMock,
        profileList: profileListMock,
      },
      message: '',
      status: 'success',
      refreshToken: 'refresh-token',
    };

    getMemberProfileInfoMock.mockResolvedValue(responseMock);
    tokenUpdateDispatchMock.mockResolvedValue(true);

    const result = await getMemberInfoDispatch(dispatchMock, getStateMock);

    expect(result).toEqual(responseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getMemberProfileInfoMock,
      stateMock.config.apis.guestExperienceApi,
      stateMock.settings.token,
      getEndpointRetryPolicy,
      stateMock.settings.deviceToken
    );

    expectToHaveBeenCalledOnceOnlyWith(
      tokenUpdateDispatchMock,
      dispatchMock,
      responseMock.refreshToken
    );

    expectToHaveBeenCalledOnceOnlyWith(
      storeMemberProfileApiResponseDispatchMock,
      dispatchMock,
      result
    );
  });

  it('calls response logger', async () => {
    const responseMock: IMemberInfoResponse = {
      data: {
        account: accountMock,
        profileList: profileListMock,
      },
      message: '',
      status: 'success',
      refreshToken: 'refresh-token',
    };

    getMemberProfileInfoMock.mockResolvedValue(responseMock);
    tokenUpdateDispatchMock.mockResolvedValue(true);

    const responseLoggerMock = jest.fn();

    await getMemberInfoDispatch(
      dispatchMock,
      getStateMock,
      undefined,
      responseLoggerMock
    );

    expectToHaveBeenCalledOnceOnlyWith(responseLoggerMock, responseMock.data);
  });
});
