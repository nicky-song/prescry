// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { getDrugPriceResponseDispatch } from '../dispatch/get-drug-price-response.dispatch';

import {
  getDrugPriceAsyncAction,
  IGetDrugPriceAsyncActionArgs,
} from './get-drug-price.async-action';
import { setDrugPriceResponseDispatch } from '../dispatch/set-drug-price-response.dispatch';
import { ErrorConstants } from '../../../api/api-response-messages';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setIsGettingPharmaciesDispatch } from '../dispatch/set-is-getting-pharmacies.dispatch';
import { setNoPharmacyErrorDispatch } from '../dispatch/set-no-pharmacy-error.dispatch';

jest.mock('../dispatch/set-no-pharmacy-error.dispatch');
const setNoPharmacyErrorDispatchMock = setNoPharmacyErrorDispatch as jest.Mock;

jest.mock('../dispatch/get-drug-price-response.dispatch');
const getDrugPriceResponseDispatchMock =
  getDrugPriceResponseDispatch as jest.Mock;

jest.mock('../dispatch/set-drug-price-response.dispatch');
const setDrugPriceResponseDispatchMock =
  setDrugPriceResponseDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action'
);
const handleAuthUserApiErrorsActionMock =
  handleAuthUserApiErrorsAction as jest.Mock;

const locationMock = { zipCode: '98005' } as ILocationCoordinates;
jest.mock('../dispatch/set-is-getting-pharmacies.dispatch');
const setIsGettingPharmaciesDispatchMock =
  setIsGettingPharmaciesDispatch as jest.Mock;

describe('getDrugPriceAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getDrugPriceResponseDispatch with expected args', async () => {
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getDrugPriceAsyncAction(argsMock);

    expect(getDrugPriceResponseDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('calls getDrugPriceResponseDispatch with coordinates if provided', async () => {
    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 1,
      longitude: 0,
    };
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationWithCoordinatesMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getDrugPriceAsyncAction(argsMock);

    expect(setNoPharmacyErrorDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      false
    );
    expect(setDrugPriceResponseDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      []
    );
    expect(setIsGettingPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      true
    );
    expect(getDrugPriceResponseDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles bad requests', async () => {
    const errorMock = new ErrorBadRequest('Error');
    getDrugPriceResponseDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceAsyncAction(argsMock);

    expect(setDrugPriceResponseDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [],
      undefined,
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
    expect(handleAuthUserApiErrorsActionMock).not.toBeCalled();
  });

  it('handles errors', async () => {
    const errorMock = new Error('Error');
    getDrugPriceResponseDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: locationMock,
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getDrugPriceAsyncAction(argsMock);

    expect(setDrugPriceResponseDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [],
      undefined,
      ErrorConstants.PHARMACY_SEARCH_FAILURE
    );
  });

  it('handles empty zipcode and coordinates scenario by calling setDrugPriceResponseDispatchMock with error', async () => {
    const argsMock: IGetDrugPriceAsyncActionArgs = {
      location: {},
      sortBy: 'youpay',
      ndc: '123',
      supply: 5,
      quantity: 5,
      isUnauthExperience: true,
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getDrugPriceAsyncAction(argsMock);

    expect(setDrugPriceResponseDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [],
      undefined,
      ErrorConstants.GEOLOCATION_DETECTION_FAILURE
    );
    expect(handleAuthUserApiErrorsActionMock).not.toBeCalled();
  });
});
