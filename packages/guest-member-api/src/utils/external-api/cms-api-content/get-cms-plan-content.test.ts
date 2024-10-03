// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ICmsFileContent } from '../../../models/cms/cms-file-content';
import { getDataFromUrl } from '../../get-data-from-url';
import {
  getCmsPlanContent,
  IGetCmsPlanContentResponse,
  IPlanDataResponse,
} from './get-cms-plan-content';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getCmsPlanContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws endpoint error if api returns error', async () => {
    const mockError = 'error';
    const statusMock = 400;
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: statusMock,
    });

    try {
      await getCmsPlanContent('rx-sub-group', configurationMock, true);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });

  it('makes expected api request and returns response if success', async () => {
    const planDataResponseMock: IPlanDataResponse = {
      FamilyDeductible: 1000,
      FamilyMax: 2000,
      IndividualDeductible: 3000,
      IndividualMax: 4000,
      PlanDetailsDocument: {
        url: 'plan-details-document-url',
      } as ICmsFileContent,
    };

    getDataFromUrlMock.mockResolvedValue({
      json: () => [planDataResponseMock],
      ok: true,
    });

    const rxSubGroupMock = 'rx-sub-group';

    const actual = await getCmsPlanContent(
      rxSubGroupMock,
      configurationMock,
      true
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `${configurationMock.contentApiUrl}/group-plans?GroupPlanCode=${rxSubGroupMock}`,
      undefined,
      'GET',
      undefined,
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    const expected: IGetCmsPlanContentResponse = {
      planData: planDataResponseMock,
    };
    expect(actual).toEqual(expected);
  });
});
