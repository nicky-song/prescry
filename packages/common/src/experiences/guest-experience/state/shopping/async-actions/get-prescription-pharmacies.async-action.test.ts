// Copyright 2021 Prescryptive Health, Inc.

import {
  getPrescriptionPharmaciesAsyncAction,
  IGetPrescriptionPharmaciesAsyncActionArgs,
} from './get-prescription-pharmacies.async-action';
import { getPrescriptionPharmaciesDispatch } from '../dispatch/get-prescription-pharmacies.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { setPrescriptionPharmaciesDispatch } from '../dispatch/set-prescription-pharmacies.dispatch';
import { ErrorConstants } from '../../../api/api-response-messages';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setIsGettingPharmaciesDispatch } from '../dispatch/set-is-getting-pharmacies.dispatch';

jest.mock('../dispatch/set-is-getting-pharmacies.dispatch');
const setIsGettingPharmaciesDispatchMock =
  setIsGettingPharmaciesDispatch as jest.Mock;

jest.mock('../dispatch/get-prescription-pharmacies.dispatch');
const getPrescriptionPharmaciesDispatchMock =
  getPrescriptionPharmaciesDispatch as jest.Mock;

jest.mock('../dispatch/set-prescription-pharmacies.dispatch');
const setPrescriptionPharmaciesDispatchMock =
  setPrescriptionPharmaciesDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action'
);
const handleAuthUserApiErrorsActionMock =
  handleAuthUserApiErrorsAction as jest.Mock;

const locationMock = { zipCode: 'zip-code' };

describe('getPrescriptionPharmaciesAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches get prescription pharmacies', async () => {
    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: 'prescription-id',
      sortBy: 'youpay',
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
      blockchain: false,
    };
    await getPrescriptionPharmaciesAsyncAction(argsMock);

    expect(getPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock
    );
  });

  it('dispatches get prescription pharmacies with coordinates', async () => {
    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 1,
      longitude: 0,
    };
    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationWithCoordinatesMock,
      prescriptionId: 'prescription-id',
      sortBy: 'youpay',
      distance: 25,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionPharmaciesAsyncAction(argsMock);

    expect(getPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock
    );
    expect(setIsGettingPharmaciesDispatchMock).toHaveBeenCalledWith(
      expect.any(Function),
      false
    );
  });

  it('handles bad request errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new ErrorBadRequest('Boom!');
    getPrescriptionPharmaciesDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: 'prescription-id',
      sortBy: 'youpay',
      distance: 25,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionPharmaciesAsyncAction(argsMock);

    expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock.shoppingDispatch,
      { pharmacyPrices: [] },
      'prescription-id',
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );

    expect(handleAuthUserApiErrorsActionMock).not.toBeCalled();
    expect(setIsGettingPharmaciesDispatchMock).toHaveBeenCalledWith(
      expect.any(Function),
      false
    );
  });
  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Boom!');
    getPrescriptionPharmaciesDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: 'prescription-id',
      sortBy: 'youpay',
      distance: 25,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionPharmaciesAsyncAction(argsMock);

    expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock.shoppingDispatch,
      { pharmacyPrices: [] },
      'prescription-id',
      ErrorConstants.PHARMACY_SEARCH_FAILURE
    );
    expect(handleAuthUserApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
    expect(setIsGettingPharmaciesDispatchMock).toHaveBeenCalledWith(
      expect.any(Function),
      false
    );
  });

  it('handles empty zipcode and coordinates scenario by calling setPrescriptionPharmaciesDispatch with error', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: {},
      prescriptionId: 'prescription-id',
      sortBy: 'youpay',
      distance: 25,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionPharmaciesAsyncAction(argsMock);

    expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      argsMock.shoppingDispatch,
      { pharmacyPrices: [] },
      'prescription-id',
      ErrorConstants.GEOLOCATION_DETECTION_FAILURE
    );

    expect(handleAuthUserApiErrorsActionMock).not.toBeCalled();
    expect(setIsGettingPharmaciesDispatchMock).toHaveBeenCalledWith(
      expect.any(Function),
      false
    );
  });
});
