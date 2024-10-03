// Copyright 2020 Prescryptive Health, Inc.

import { Request } from 'express';
import { fetchRequestHeader } from '../request-helper';
import { getSessionIdFromRequest } from './get-sessionid-from-request';

jest.mock('../request-helper');
const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;

beforeEach(() => {
  fetchRequestHeaderMock.mockReset();
});
describe('getSessionIdFromRequest', () => {
  const requestMock = {} as Request;
  it.each([
    ['04f8c964af27464b9dc94f2412362c29', '04f8c964af27464b9dc94f2412362c29'],
    ['|04f8c964af27464b9dc94f2412362c29', '04f8c964af27464b9dc94f2412362c29'],
    [
      '04f8c964af27464b9dc94f2412362c29.005f1481c3944521',
      '04f8c964af27464b9dc94f2412362c29',
    ],
    [
      '|!04f8c964af27464b9dc94f2412362c29.005f1481c3944521',
      '!04f8c964af27464b9dc94f2412362c29',
    ],
    [
      '|||04f8c964af27464b9dc94f2412362c29.005f1481c3944521',
      '04f8c964af27464b9dc94f2412362c29',
    ],
    [
      '|||04f8c964af|27464b9dc|94f2412362c29',
      '04f8c964af|27464b9dc|94f2412362c29',
    ],
    [undefined, ''],
  ])(
    'should return expected session id based on request-id header (requestId: %p)',
    (requestId, expectedOutput) => {
      fetchRequestHeaderMock.mockReturnValueOnce(requestId);
      expect(getSessionIdFromRequest(requestMock)).toBe(expectedOutput);
    }
  );
});
