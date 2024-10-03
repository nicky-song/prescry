// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getPastProceduresList } from '../../../api/api-v1.get-past-procedures-list';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { pastProceduresListMock } from '../../../__mocks__/past-procedures.mock';
import { IGetPastProceduresListAsyncActionArgs } from '../async-actions/get-past-procedures.async-action';
import { getPastProceduresListDispatch } from './get-past-procedures-list.dispatch';
import { setPastProceduresDispatch } from './set-past-procedures.dispatch';

jest.mock('../../../api/api-v1.get-past-procedures-list');
const getPastProceduresListMock = getPastProceduresList as jest.Mock;

jest.mock('./set-past-procedures.dispatch');
jest.mock('../../../../../utils/retry-policies/get-endpoint.retry-policy');
const getEndpointRetryPolicyMock =
  getEndpointRetryPolicy as unknown as jest.Mock;

describe('getPastProceduresListDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API request', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock: ISettings = {
      isDeviceRestricted: false,
      token: 'token',
      lastZipCode: '12345',
    };

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    getPastProceduresListMock.mockReturnValueOnce({
      data: { pastProcedures: pastProceduresListMock },
    });
    const argsMock: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      pastProceduresDispatch: jest.fn(),
      navigation: pastProceduresStackNavigationMock,
    };

    await getPastProceduresListDispatch(argsMock);

    expect(getPastProceduresListMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      settingsMock.token,
      getEndpointRetryPolicyMock,
      undefined
    );
  });

  it('dispatches set past procedures', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock: ISettings = {
      isDeviceRestricted: false,
      token: 'token',
      lastZipCode: '12345',
    };

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    getPastProceduresListMock.mockReturnValueOnce({
      data: { pastProcedures: pastProceduresListMock },
    });
    const pastProceduresDispatchMock = jest.fn();
    const argsMock: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      pastProceduresDispatch: pastProceduresDispatchMock,
      navigation: pastProceduresStackNavigationMock,
    };

    await getPastProceduresListDispatch(argsMock);

    expect(setPastProceduresDispatch).toHaveBeenCalledWith(
      pastProceduresDispatchMock,
      pastProceduresListMock
    );
  });
});
