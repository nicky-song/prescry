// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../../theming/constants';
import {
  getDrugFormsResponse,
  IDrugFormResponse,
  IDrugFormsResponse,
} from './get-drug-forms-response';

describe('getDrugFormsResponse', () => {
  it('throws error if response data is invalid', async () => {
    const responseMock: Partial<Response> = {
      json: jest.fn(),
    };

    try {
      await getDrugFormsResponse(responseMock as Response);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(
        new ErrorApiResponse(ErrorConstants.errorInternalServer())
      );
    }
  });

  it('returns response data if valid', async () => {
    const drugFormResponse1Mock: IDrugFormResponse = {
      abbreviation: 'abbreviation-1',
      description: 'description-1',
      formCode: 'form-code-1',
    };
    const drugFormResponse2Mock: IDrugFormResponse = {
      abbreviation: 'abbreviation-2',
      description: 'description-2',
      formCode: 'form-code-2 ',
    };
    const drugFormsResponseMock: IDrugFormsResponse = {
      forms: [drugFormResponse1Mock, drugFormResponse2Mock],
    };
    const responseMock: Partial<Response> = {
      json: jest.fn().mockResolvedValue(drugFormsResponseMock),
    };

    const result = await getDrugFormsResponse(responseMock as Response);
    expect(result).toEqual(drugFormsResponseMock);
  });
});
