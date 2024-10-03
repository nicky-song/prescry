// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../api/api-response-messages';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { getAlternativeDrugPriceResponseDispatch } from '../dispatch/get-alternative-drug-price-response.dispatch';
import { setAlternativeDrugPriceResponseDispatch } from '../dispatch/set-alternative-drug-price-response.dispatch';
import {
  getAlternativeDrugPriceAsyncAction,
  IGetAlternativeDrugPriceAsyncActionArgs,
} from './get-alternative-drug-price-response.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../dispatch/get-alternative-drug-price-response.dispatch');
const getAlternativeDrugPriceResponseDispatchMock =
  getAlternativeDrugPriceResponseDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action'
);
const handleAuthUserApiErrorsActionMock =
  handleAuthUserApiErrorsAction as jest.Mock;

jest.mock('../dispatch/set-alternative-drug-price-response.dispatch');
const setAlternativeDrugPriceResponseDispatchMock =
  setAlternativeDrugPriceResponseDispatch as jest.Mock;

const alternativeDrugPriceAsyncActionArgs: IGetAlternativeDrugPriceAsyncActionArgs =
  {
    ndc: 'ndc-mock',
    ncpdp: 'ncpdp-mock',
    isUnauthExperience: false,
    navigation: rootStackNavigationMock,
    shoppingDispatch: jest.fn(),
    reduxDispatch: jest.fn(),
    reduxGetState: jest.fn(),
  };

describe('getAlternativeDrugPriceAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getAlternativeDrugPriceResponseDispatchMock.mockImplementation(() => true);
  });

  it('tries to call getAlternativeDrugPriceResponseDispatch with expected args', async () => {
    await getAlternativeDrugPriceAsyncAction(
      alternativeDrugPriceAsyncActionArgs
    );

    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenCalledTimes(
      1
    );
    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceAsyncActionArgs
    );

    expect(handleAuthUserApiErrorsActionMock).toHaveBeenCalledTimes(0);
  });

  it('tries to call handleAuthUserApiErrorsActionMock with expected args on error', async () => {
    const errorMock = new Error('error-mock');

    getAlternativeDrugPriceResponseDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    await getAlternativeDrugPriceAsyncAction(
      alternativeDrugPriceAsyncActionArgs
    );

    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenCalledTimes(
      1
    );
    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceAsyncActionArgs
    );

    expect(handleAuthUserApiErrorsActionMock).toHaveBeenCalledTimes(1);
    expect(handleAuthUserApiErrorsActionMock).toHaveBeenNthCalledWith(
      1,
      errorMock,
      alternativeDrugPriceAsyncActionArgs.reduxDispatch,
      alternativeDrugPriceAsyncActionArgs.navigation
    );
  });

  it('catches error from handleAuthUserApiErrorsActionMock and calls setAlternativeDrugPriceResponseDispatchMock', async () => {
    const errorMock = new Error('error-mock');

    getAlternativeDrugPriceResponseDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    await getAlternativeDrugPriceAsyncAction(
      alternativeDrugPriceAsyncActionArgs
    );

    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenCalledTimes(
      1
    );
    expect(getAlternativeDrugPriceResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceAsyncActionArgs
    );

    expect(handleAuthUserApiErrorsActionMock).toHaveBeenCalledTimes(1);
    expect(handleAuthUserApiErrorsActionMock).toHaveBeenNthCalledWith(
      1,
      errorMock,
      alternativeDrugPriceAsyncActionArgs.reduxDispatch,
      alternativeDrugPriceAsyncActionArgs.navigation
    );

    expect(setAlternativeDrugPriceResponseDispatchMock).toHaveBeenCalledTimes(
      1
    );
    expect(setAlternativeDrugPriceResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceAsyncActionArgs.shoppingDispatch,
      undefined,
      ErrorConstants.ALTERNATIVE_DRUG_SEARCH_FAILURE
    );
  });
});
