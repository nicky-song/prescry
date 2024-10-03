// Copyright 2022 Prescryptive Health, Inc.

import { IApiConfig } from '../../../../../utils/api.helper';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getAlternativeDrugPrice } from '../../../api/api-v1.get-alternative-drug-price';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetAlternativeDrugPriceAsyncActionArgs } from '../async-actions/get-alternative-drug-price-response.async-action';
import { getAlternativeDrugPriceResponseDispatch } from './get-alternative-drug-price-response.dispatch';
import { setAlternativeDrugPriceResponseDispatch } from './set-alternative-drug-price-response.dispatch';

jest.mock('./set-alternative-drug-price-response.dispatch');
const setAlternativeDrugPriceResponseDispatchMock =
  setAlternativeDrugPriceResponseDispatch as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-alternative-drug-price');
const getAlternativeDrugPriceMock = getAlternativeDrugPrice as jest.Mock;

const stateMock = {
  config: { apis: { guestExperienceApi: {} as IApiConfig } },
  settings: { token: 'token-mock', deviceToken: 'device-token-mock' },
};

const alternativeDrugPriceArgs: IGetAlternativeDrugPriceAsyncActionArgs = {
  ndc: 'ndc-mock',
  ncpdp: 'ncpdp-mock',
  isUnauthExperience: false,
  navigation: rootStackNavigationMock,
  shoppingDispatch: jest.fn(),
  reduxDispatch: jest.fn(),
  reduxGetState: jest.fn().mockReturnValue(stateMock),
};

const dataMock = {};
const refreshTokenMock = 'refresh-token-mock';

describe('getAlternativeDrugPriceResponseDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getAlternativeDrugPriceMock.mockReturnValue({
      data: dataMock,
      refreshToken: refreshTokenMock,
    });
  });

  it('calls getAlternativeDrugPrice with expected args', async () => {
    await getAlternativeDrugPriceResponseDispatch(alternativeDrugPriceArgs);

    const { config, settings } = stateMock;

    const apiConfig = config.apis.guestExperienceApi;

    expect(getAlternativeDrugPriceMock).toHaveBeenCalledTimes(1);
    expect(getAlternativeDrugPriceMock).toHaveBeenNthCalledWith(
      1,
      apiConfig,
      alternativeDrugPriceArgs.ndc,
      alternativeDrugPriceArgs.ncpdp,
      settings.token,
      settings.deviceToken,
      getEndpointRetryPolicy
    );
  });

  it('calls tokenUpdateDispatch with expected args if !isUnauthExperience', async () => {
    await getAlternativeDrugPriceResponseDispatch(alternativeDrugPriceArgs);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledTimes(1);
    expect(tokenUpdateDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceArgs.reduxDispatch,
      refreshTokenMock
    );
  });

  it('calls setAlternativeDrugPriceResponseDispatch with expected args', async () => {
    await getAlternativeDrugPriceResponseDispatch(alternativeDrugPriceArgs);

    expect(setAlternativeDrugPriceResponseDispatchMock).toHaveBeenCalledTimes(
      1
    );
    expect(setAlternativeDrugPriceResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceArgs.shoppingDispatch,
      dataMock
    );
  });
});
