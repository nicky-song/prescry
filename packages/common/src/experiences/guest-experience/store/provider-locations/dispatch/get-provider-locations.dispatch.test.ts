// Copyright 2020 Prescryptive Health, Inc.

import { getProviderLocationsResponseAction } from '../actions/get-provider-locations-response.action';
import { getProviderLocationsDispatch } from './get-provider-locations.dispatch';
import { getProviderLocations } from '../../../api/api-v1.get-provider-locations';
import {
  IProviderLocationData,
  IProviderLocationResponse,
} from '../../../../../models/api-response/provider-location-response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { setServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';

jest.mock('../../../api/api-v1.get-provider-locations', () => ({
  getProviderLocations: jest.fn().mockResolvedValue({ data: {} }),
}));
const getProviderLocationsMock = getProviderLocations as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const zipcodeParamMock = { zipcode: '98023', distance: 60 };

const defaultStateMock = {
  config: {
    apis: {},
  },
  features: {
    usepharmacy: false,
  },
  serviceType: { type: 'test-service-type' },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();
const zipcodeParam = { zipcode: '98203', distance: 60 } as IZipcodeParam;

describe('getProviderLocationsDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    tokenUpdateDispatchMock.mockReset();
  });

  it('calls getProviderLocations API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getProviderLocationsDispatch(
      dispatchMock,
      getStateMock,
      zipcodeParam
    );

    expect(getProviderLocationsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      '98203',
      60,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock,
      'test-service-type'
    );
  });

  it('calls getProviderLocations API with expected arguments with zipcode parameter', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getProviderLocationsDispatch(
      dispatchMock,
      getStateMock,
      zipcodeParamMock
    );

    expect(getProviderLocationsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      '98023',
      60,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock,
      'test-service-type'
    );
  });

  it('dispatches getProviderLocationsResponseAction', async () => {
    const providerLocations: IProviderLocationData = {
      locations: [
        {
          id: '1',
          providerName: 'Bartell Drugs',
          locationName: 'Bartell Drugs',
          address1: '7370 170th Ave NE',
          city: 'Redmond',
          state: 'WA',
          zip: '98052',
          phoneNumber: '(425) 977-5489',
        },
      ],
      serviceNameMyRx: 'mock-service-name',
      minimumAge: 3,
    };
    const providerLocationResponseMock: IProviderLocationResponse = {
      data: providerLocations,
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    getProviderLocationsMock.mockResolvedValue(providerLocationResponseMock);

    const dispatchMock = jest.fn();
    await getProviderLocationsDispatch(
      dispatchMock,
      getStateMock,
      zipcodeParam
    );

    const responseAction = getProviderLocationsResponseAction(
      providerLocationResponseMock.data.locations
    );
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      providerLocationResponseMock.refreshToken
    );
  });

  it('dispatches setServiceDetailsAction', async () => {
    const providerLocations: IProviderLocationData = {
      locations: [
        {
          id: '1',
          providerName: 'Bartell Drugs',
          locationName: 'Bartell Drugs',
          address1: '7370 170th Ave NE',
          city: 'Redmond',
          state: 'WA',
          zip: '98052',
          phoneNumber: '(425) 977-5489',
        },
      ],
      serviceNameMyRx: 'mock-service-name',
      minimumAge: 3,
    };
    const providerLocationResponseMock: IProviderLocationResponse = {
      data: providerLocations,
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    getProviderLocationsMock.mockResolvedValue(providerLocationResponseMock);

    const dispatchMock = jest.fn();
    await getProviderLocationsDispatch(
      dispatchMock,
      getStateMock,
      zipcodeParam
    );

    const responseAction = setServiceDetailsAction({
      serviceNameMyRx: providerLocations.serviceNameMyRx,
      minimumAge: providerLocations.minimumAge,
    });
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      providerLocationResponseMock.refreshToken
    );
  });
});
