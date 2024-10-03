// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../../../errors/error-codes';
import { ErrorConstants } from '../../../../../theming/constants';
import { call } from '../../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../../api-v1-helper';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { getDrugForms } from './api-v1.get-drug-forms';
import {
  getDrugFormsResponse,
  IDrugFormResponse,
  IDrugFormsResponse,
} from './get-drug-forms-response';

jest.mock('../../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('../../api-v1-helper', () => ({
  ...(jest.requireActual('../../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

jest.mock('./get-drug-forms-response');
const getDrugFormsResponseMock = getDrugFormsResponse as jest.Mock;

describe('getDrugForms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getDrugFormsResponseMock.mockResolvedValue({});
  });

  it('makes api request', async () => {
    mockCall.mockResolvedValue({
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.domainDataApi;
    const retryPolicyMock = {} as IRetryPolicy;

    const subscriptionKey = 'mock-key';
    await getDrugForms(apiConfigMock, subscriptionKey, retryPolicyMock);

    const { protocol, host, port, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${version}/dds/1.0/forms`;

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: subscriptionKey,
      },
      retryPolicyMock
    );
  });

  it('throws error if response format invalid', async () => {
    const errorMock = new Error('Boom!');

    getDrugFormsResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    const subscriptionKey = 'mock-key';

    try {
      await getDrugForms(
        GuestExperienceConfig.apis.domainDataApi,
        subscriptionKey
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns result', async () => {
    const drugFormResponse1Mock: IDrugFormResponse = {
      abbreviation: 'abbreviation-1',
      description: 'description-1',
      formCode: 'form-code-1',
    };
    const drugFormResponse2Mock: IDrugFormResponse = {
      abbreviation: ' abbreviation-2 ',
      description: ' description-2 ',
      formCode: 'form-code-2 ',
    };
    const drugFormsResponseMock: IDrugFormsResponse = {
      forms: [drugFormResponse1Mock, drugFormResponse2Mock],
    };
    getDrugFormsResponseMock.mockResolvedValue(drugFormsResponseMock);

    const responseMock: Partial<Response> = {
      ok: true,
    };
    mockCall.mockResolvedValue(responseMock);
    const subscriptionKey = 'mock-key';
    const result = await getDrugForms(
      GuestExperienceConfig.apis.domainDataApi,
      subscriptionKey
    );

    expect(result.length).toEqual(drugFormsResponseMock.forms.length);

    result.forEach((drugForm, index) => {
      const drugFormResponse = drugFormsResponseMock.forms[index];
      expect(drugForm.abbreviation).toEqual(
        drugFormResponse.abbreviation.trimRight()
      );
      expect(drugForm.description).toEqual(
        drugFormResponse.description.trimRight()
      );
      expect(drugForm.formCode).toEqual(drugFormResponse.formCode.trimRight());
    });

    expect(getDrugFormsResponseMock).toHaveBeenCalledWith(responseMock);
  });

  it('throws error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');

    mockCall.mockResolvedValue({
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);
    const subscriptionKey = 'mock-key';

    try {
      await getDrugForms(
        GuestExperienceConfig.apis.domainDataApi,
        subscriptionKey
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorGettingDrugForms,
      APITypes.GET_DRUG_FORMS
    );
  });
});
