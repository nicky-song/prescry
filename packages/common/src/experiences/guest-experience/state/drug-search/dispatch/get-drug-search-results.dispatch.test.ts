// Copyright 2021 Prescryptive Health, Inc.

import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { elasticDrugSearch } from '../../../api/api-v1.elastic-drug-search';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { drugSearchStackNavigationMock } from '../../../navigation/stack-navigators/drug-search/__mocks__/drug-search.stack-navigation.mock';
import { drugSearchResultsMock } from '../../../__mocks__/drug-search-response.mock';
import { IDrugSearchAsyncActionArgs } from '../async-actions/drug-search.async-action';
import { getDrugSearchResultsDispatch } from './get-drug-search-results.dispatch';
import { setDrugSearchResultsDispatch } from './set-drug-search-results.dispatch';

jest.mock('../../../api/api-v1.elastic-drug-search');
const elaticDrugSearchMock = elasticDrugSearch as jest.Mock;

jest.mock('./set-drug-search-results.dispatch');
const setDrugSearchResultsDispatchMock =
  setDrugSearchResultsDispatch as jest.Mock;

jest.mock('../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('getDrugSearchResultsDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    elaticDrugSearchMock.mockReturnValue(drugSearchResultsMock);
  });

  const configMock = GuestExperienceConfig;

  it('dispatches set Drug Search with elastic response', async () => {
    const timeStampMock = 1637866165392;

    const reduxGetStateUseSearchMock = jest
      .fn()
      .mockReturnValue({ config: configMock, features: {} });

    getNewDateMock.mockReturnValue({
      getTime: jest.fn().mockReturnValue(timeStampMock),
    });

    const useAllMedicationsSearchMock = false;

    const argsMock: IDrugSearchAsyncActionArgs = {
      filter: 'pre',
      rxSubGroup: 'CASH01',
      maxResults: 5,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateUseSearchMock,
      drugSearchDispatch: jest.fn(),
      navigation: drugSearchStackNavigationMock,
      useAllMedicationsSearch: useAllMedicationsSearchMock,
    };

    await getDrugSearchResultsDispatch(argsMock);

    expect(elaticDrugSearchMock).toHaveBeenCalledWith(
      configMock.apis.domainDataApi,
      configMock.domainDataSearchKeyPublic,
      argsMock.filter,
      argsMock.maxResults,
      argsMock.rxSubGroup,
      getEndpointRetryPolicy,
      useAllMedicationsSearchMock
    );

    expect(setDrugSearchResultsDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      drugSearchResultsMock,
      timeStampMock
    );
  });
});
