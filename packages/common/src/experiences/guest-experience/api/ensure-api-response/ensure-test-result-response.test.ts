// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureTestResultResponse } from './ensure-test-result-response';

describe('ensureTestResultResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureTestResultResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: {} };
    const result = ensureTestResultResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
