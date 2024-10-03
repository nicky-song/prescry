// Copyright 2022 Prescryptive Health, Inc.

import { removeSearchParamsFromUrl } from './remove-search-params-from-url.helper';

let replaceStateSpy: jest.SpyInstance;

describe('removeSearchParamsFromUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => ({}));
  });
  afterEach(() => {
    replaceStateSpy.mockRestore();
  });
  it.each([
    ['?rxgroup=test-group', ['rxgroup'], 'www.test.com'],
    [
      '?rxgroup=test-group&test-1=test-group-1&test-2=test-group-2',
      ['rxgroup', 'test-1'],
      'www.test.com?test-2=test-group-2',
    ],
    [
      '?rxgroup=test-group&test-1=test-group-1&test-2=test-group-2',
      ['rxgroup', 'test-1', 'test-2'],
      'www.test.com',
    ],
  ])(
    'should remove search param from URL when specified (initialURL: %p, param: %p, finalURL: %p)',
    (searchMock: string, paramsToRemove: string[], finalURL: string) => {
      const pathnameMock = 'www.test.com';
      // @ts-ignore
      delete window.location;
      window.location = {
        search: searchMock,
        pathname: pathnameMock,
      } as unknown as Location;

      removeSearchParamsFromUrl(paramsToRemove);

      expect(replaceStateSpy).toHaveBeenCalledWith(
        {},
        document.title,
        finalURL
      );
    }
  );
});
