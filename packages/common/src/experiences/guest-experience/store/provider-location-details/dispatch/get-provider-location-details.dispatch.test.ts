// Copyright 2020 Prescryptive Health, Inc.

import { IServiceInfo } from '../../../../../models/api-response/provider-location-details-response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getProviderLocationDetailsDispatch } from './get-provider-location-details.dispatch';
import {
  ILocation,
  IProviderLocationDetailsResponse,
} from '../../../../../models/api-response/provider-location-details-response';
import { getProviderLocationDetails } from '../../../api/api-v1.get-provider-location-details';
import { getSlotsAndNavigateDispatch } from '../../appointment/dispatch/get-slots-and-navigate.dispatch';
import { setSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { guestExperienceCustomEventLogger } from '../../../guest-experience-logger.middleware';
import { setServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.get-provider-location-details', () => ({
  getProviderLocationDetails: jest.fn().mockResolvedValue({ data: {} }),
}));
jest.mock('../../settings/dispatch/token-update.dispatch');
jest.mock('../../appointment/dispatch/get-slots-and-navigate.dispatch');
jest.mock('../../appointment/actions/set-selected-location.action');
jest.mock('../../../guest-experience-logger.middleware');

jest.mock('../../service-type/actions/set-service-details.action');

const getProviderLocationDetailsMock = getProviderLocationDetails as jest.Mock;
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;
const getSlotsAndNavigateDispatchMock =
  getSlotsAndNavigateDispatch as jest.Mock;
const setSelectedLocationActionMock = setSelectedLocationAction as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const setServiceDetailsActionMock = setServiceDetailsAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const identifierMock = 'id-1';

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

const service: IServiceInfo = {
  serviceName: 'test-service',
  serviceType: 'test-service-type',
  screenDescription: 'Test Desc',
  screenTitle: 'Test Title',
  questions: [],
  minLeadDays: 'P6D',
  maxLeadDays: 'P30D',
};
const servicePcr: IServiceInfo = {
  serviceName: 'test-pcr service',
  serviceType: 'test-covid19-pcr-cquentia',
  screenDescription: 'Test Desc',
  screenTitle: 'Test Title',
  questions: [],
  minLeadDays: 'P6D',
  maxLeadDays: 'P30D',
};

const providerLocation: ILocation = {
  id: '1',
  providerName: 'Bartell Drugs',
  locationName: 'Bartell Drugs',
  address1: '7370 170th Ave NE',
  city: 'Redmond',
  state: 'WA',
  zip: '98052',
  phoneNumber: '(425) 977-5489',
  serviceInfo: [service, servicePcr] as IServiceInfo[],
  timezone: 'America/Los_Angeles',
};
const providerLocationDetailsResponseMock: IProviderLocationDetailsResponse = {
  data: {
    location: providerLocation,
    serviceNameMyRx: 'mock-service-name',
    minimumAge: 3,
    aboutQuestionsDescriptionMyRx: 'mock-about-question-desc',
    aboutDependentDescriptionMyRx: 'mock-about-dep-desc',
    cancellationPolicyMyRx: 'mock-cancellation-policy',
  },
  message: 'all good',
  refreshToken: 'refresh-token',
  status: 'ok',
};
const guestExperienceApiMock = 'guestExperienceApiMock';
const stateMock = {
  ...defaultStateMock,
  config: {
    apis: {
      guestExperienceApi: guestExperienceApiMock,
    },
  },
};

describe('getProviderLocationDetailsDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    tokenUpdateDispatchMock.mockReset();
    setSelectedLocationActionMock.mockReset();
    getProviderLocationDetailsMock.mockReset();
    getSlotsAndNavigateDispatchMock.mockReset();
    setServiceDetailsActionMock.mockReset();
  });

  it('calls getProviderLocationDetails API with expected arguments', async () => {
    getStateMock.mockReturnValue(stateMock);

    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );

    const dispatchMock = jest.fn();
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );

    expect(getProviderLocationDetailsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      'test-service-type',
      'id-1',
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock
    );
  });

  it('throws error if servicetype.type is undefined', async () => {
    getStateMock.mockReturnValue({
      ...defaultStateMock,
      serviceType: { type: undefined },
    });

    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );

    const dispatchMock = jest.fn();

    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    )
      .then(() => undefined)
      .catch((err: Error) =>
        expect(err).toEqual(new Error('Service type is undefined'))
      );
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalled();
  });

  it('calls setSelectedLocationAction using location, set minDate, currentMonth for 5days after today -same month', async () => {
    getStateMock.mockReturnValue(stateMock);
    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );
    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1592961686000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(getProviderLocationDetailsMock).toHaveBeenCalledTimes(1);
    expect(setSelectedLocationActionMock).toHaveBeenCalledWith({
      selectedLocation: providerLocation,
      selectedService: service,
      maxDate: '2020-07-23',
      minDate: '2020-06-29',
    });

    expect(getSlotsAndNavigateDispatchMock).toHaveBeenCalledWith(
      '2020-06-29T00:00:00-07:00',
      '2020-06-30T23:59:59-07:00',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      undefined
    );
    dateNowSpyMock.mockRestore();
  });
  it('calls setSelectedLocationAction getSlotsAndNavigateDispatch using location, set minDate, currentMonth for 5days after today -next month', async () => {
    getStateMock.mockReturnValue(stateMock);
    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );
    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1593154799000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(setSelectedLocationActionMock).toHaveBeenCalledWith({
      selectedLocation: providerLocation,
      selectedService: service,
      maxDate: '2020-07-25',
      minDate: '2020-07-01',
    });
    expect(getSlotsAndNavigateDispatchMock).toHaveBeenCalledWith(
      '2020-07-01T00:00:00-07:00',
      '2020-07-31T23:59:59-07:00',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      undefined
    );
    dateNowSpyMock.mockRestore();
  });
  it('calls setSelectedLocationAction and getSlotsAndNavigateDispatch using location, set "current time" as minDate without any delays', async () => {
    getStateMock.mockReturnValue(stateMock);
    const serviceAntigen: IServiceInfo = {
      ...service,
      minLeadDays: 'P0D',
    };
    const pcrService: IServiceInfo = {
      ...servicePcr,
      minLeadDays: 'P0D',
    };
    const providerLocationDetails: ILocation = {
      ...providerLocation,
      serviceInfo: [serviceAntigen, pcrService],
    };
    getProviderLocationDetailsMock.mockResolvedValue({
      ...providerLocationDetailsResponseMock,
      data: {
        ...providerLocationDetailsResponseMock.data,
        location: providerLocationDetails,
      },
    });

    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1605714335000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock,
      true
    );
    expect(setSelectedLocationActionMock).toHaveBeenCalledWith({
      selectedLocation: providerLocationDetails,
      selectedService: serviceAntigen,
      maxDate: '2020-12-18',
      minDate: '2020-11-18',
    });
    expect(getSlotsAndNavigateDispatchMock).toHaveBeenCalledWith(
      '2020-11-18T00:00:00-08:00',
      '2020-11-30T23:59:59-08:00',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );
    dateNowSpyMock.mockRestore();
  });
  it('dispatches setSelectedLocationAction action', async () => {
    getStateMock.mockReturnValue({
      ...stateMock,
      serviceType: { type: 'test-covid19-pcr-cquentia' },
    });
    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );
    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1593154799000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(setSelectedLocationActionMock).toHaveBeenCalledWith({
      selectedLocation: providerLocation,
      selectedService: servicePcr,
      maxDate: '2020-07-25',
      minDate: '2020-07-01',
    });
    dateNowSpyMock.mockRestore();
  });
  it('uses serviceType in state if its in state', async () => {
    getStateMock.mockReturnValue({
      ...stateMock,
      serviceType: {
        type: 'test-covid19-pcr-cquentia',
      },
    });
    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );
    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1593154799000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(setSelectedLocationActionMock).toHaveBeenCalledWith({
      selectedLocation: providerLocation,
      selectedService: servicePcr,
      maxDate: '2020-07-25',
      minDate: '2020-07-01',
    });
    dateNowSpyMock.mockRestore();
  });

  it('dispatches setServiceDetailsAction action', async () => {
    getStateMock.mockReturnValue({
      ...stateMock,
      serviceType: {
        type: 'test-covid19-pcr-cquentia',
      },
    });
    getProviderLocationDetailsMock.mockResolvedValue(
      providerLocationDetailsResponseMock
    );
    const dispatchMock = jest.fn();
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1593154799000);
    await getProviderLocationDetailsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(setServiceDetailsActionMock).toHaveBeenCalledWith({
      serviceNameMyRx: providerLocationDetailsResponseMock.data.serviceNameMyRx,
      minimumAge: providerLocationDetailsResponseMock.data.minimumAge,
      cancellationPolicyMyRx:
        providerLocationDetailsResponseMock.data.cancellationPolicyMyRx,
      aboutQuestionsDescriptionMyRx:
        providerLocationDetailsResponseMock.data.aboutQuestionsDescriptionMyRx,
      aboutDependentDescriptionMyRx:
        providerLocationDetailsResponseMock.data.aboutDependentDescriptionMyRx,
    });
    dateNowSpyMock.mockRestore();
  });
});
