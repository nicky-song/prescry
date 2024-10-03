// Copyright 2020 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { locationDeepNavigateDispatch } from './location-deep-navigate-dispatch';
import { setServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { getProviderLocationDetailsDispatch } from '../../provider-location-details/dispatch/get-provider-location-details.dispatch';
import { navigateHomeScreenNoApiRefreshDispatch } from './navigate-home-screen-no-api-refresh.dispatch';
import { ErrorProviderLocationDetails } from '../../../../../errors/error-provider-location-details';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('./navigate-home-screen-no-api-refresh.dispatch');
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../service-type/actions/set-service-type.action');
const mockSetServiceTypeAction = setServiceTypeAction as jest.Mock;

jest.mock(
  '../../provider-location-details/dispatch/get-provider-location-details.dispatch'
);
const mockGetProviderLocationDetailsDispatch =
  getProviderLocationDetailsDispatch as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('locationDeepNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345',
      '123456'
    );

    expect(loadMemberDataDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('does not dispatch set service type and fetches provider location and navigate if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345',
      '123456'
    );

    expect(mockGetProviderLocationDetailsDispatch).not.toHaveBeenCalled();
    expect(mockSetServiceTypeAction).not.toHaveBeenCalled();
  });

  it('dispatches set service type and fetches provider location and navigate if not redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const mockLocationId = 'location_1@location.provider.myrx.io';
    const mockServiceType = 'mock-service_type';
    const mockBase64AndUriEncodedLocationId = encodeURIComponent(
      Buffer.from(mockLocationId).toString('base64')
    );
    const mockBase64AndUriEncodedServiceType = encodeURIComponent(
      Buffer.from(mockServiceType).toString('base64')
    );

    expect(mockBase64AndUriEncodedLocationId).toEqual(
      'bG9jYXRpb25fMUBsb2NhdGlvbi5wcm92aWRlci5teXJ4Lmlv'
    );
    expect(mockBase64AndUriEncodedServiceType).toEqual(
      'bW9jay1zZXJ2aWNlX3R5cGU%3D'
    );

    const mockAction = {};
    mockSetServiceTypeAction.mockReturnValue(mockAction);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      mockBase64AndUriEncodedLocationId,
      mockBase64AndUriEncodedServiceType
    );

    expect(dispatchMock).toHaveBeenCalledWith(mockAction);
    expect(mockSetServiceTypeAction).toHaveBeenCalledWith({
      type: mockServiceType,
    });
    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(mockGetProviderLocationDetailsDispatch).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      mockLocationId,
      true
    );
  });

  it('dispatches set service type and fetches provider location and navigate if not redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const mockLocationId = 'location_1@location.provider.myrx.io';
    const mockServiceType = 'mock-service_type';
    const mockBase64AndUriEncodedLocationId = encodeURIComponent(
      Buffer.from(mockLocationId).toString('base64')
    );
    const mockBase64AndUriEncodedServiceType = encodeURIComponent(
      Buffer.from(mockServiceType).toString('base64')
    );

    expect(mockBase64AndUriEncodedLocationId).toEqual(
      'bG9jYXRpb25fMUBsb2NhdGlvbi5wcm92aWRlci5teXJ4Lmlv'
    );
    expect(mockBase64AndUriEncodedServiceType).toEqual(
      'bW9jay1zZXJ2aWNlX3R5cGU%3D'
    );

    const mockAction = {};
    mockSetServiceTypeAction.mockReturnValue(mockAction);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      mockBase64AndUriEncodedLocationId,
      mockBase64AndUriEncodedServiceType
    );

    expect(dispatchMock).toHaveBeenCalledWith(mockAction);
    expect(mockSetServiceTypeAction).toHaveBeenCalledWith({
      type: mockServiceType,
    });
    expect(mockGetProviderLocationDetailsDispatch).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      mockLocationId,
      true
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345',
      '12345'
    );
    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      error
    );
    expect(navigateHomeScreenNoApiRefreshDispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches navigate to home screen with modal when provider location details throws error', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const error = new ErrorProviderLocationDetails(
      'boom!',
      'test-api-type',
      54321
    );

    loadMemberDataDispatchMock.mockResolvedValue(false);
    mockGetProviderLocationDetailsDispatch.mockImplementation(() => {
      throw error;
    });

    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345',
      '12345'
    );

    expect(navigateHomeScreenNoApiRefreshDispatch).toHaveBeenCalledWith(
      getStateMock,
      rootStackNavigationMock,
      {
        modalContent: {
          showModal: true,
          modalTopContent: error.message,
        },
      }
    );
  });

  it('dispatches navigate to home screen with modal on error', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const error = new Error('boom!');

    loadMemberDataDispatchMock.mockResolvedValue(false);
    mockGetProviderLocationDetailsDispatch.mockImplementation(() => {
      throw error;
    });

    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    await locationDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345',
      '12345'
    );

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      getStateMock,
      rootStackNavigationMock,
      {
        modalContent: {
          showModal: true,
          modalTopContent: error.message,
        },
      }
    );
  });
});
