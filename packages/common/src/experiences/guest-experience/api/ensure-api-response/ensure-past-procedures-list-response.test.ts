// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensurePastProceduresListResponse } from './ensure-past-procedures-list-response';

describe('ensurePastProceduresListResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponse = {};
    expect(() => ensurePastProceduresListResponse(mockResponse)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponse = { data: { pastProcedures: [] } };
    const result = ensurePastProceduresListResponse(mockResponse);
    expect(result).toEqual(mockResponse);
  });
});
