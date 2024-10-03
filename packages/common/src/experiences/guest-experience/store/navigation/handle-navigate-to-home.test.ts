// Copyright 2022 Prescryptive Health, Inc.

import { getLanguageQueryParam } from '../../../../utils/translation/get-language-query-param.helper';
import { handleNavigateToHome } from './handle-navigate-to-home';

jest.mock('../../../../utils/translation/get-language-query-param.helper');
const getLanguageQueryParamMock = getLanguageQueryParam as jest.Mock;

let replaceStateSpy: jest.SpyInstance;

describe('handleNavigateToHome', () => {
  beforeEach(() => {
    replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => ({}));
    getLanguageQueryParamMock.mockReturnValue(undefined);
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
  });

  it('appends featureUrl to origin url', () => {
    const featureUrlMock = 'feature-url-mock';
    handleNavigateToHome(featureUrlMock);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${featureUrlMock}`
    );
  });

  it('appends language params to origin url', () => {
    const languageUrlMock = 'lang=es';

    const expectedLanguageParam = `?${languageUrlMock}`;

    getLanguageQueryParamMock.mockReturnValue(languageUrlMock);

    queryParamMock(expectedLanguageParam);

    handleNavigateToHome();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${expectedLanguageParam}`
    );
  });

  it('resets to origin url', () => {
    handleNavigateToHome();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      window.location.origin
    );
  });
});

const queryParamMock = (params?: string) => {
  const location = {
    ...window.location,
    search: params,
  };
  Object.defineProperty(window, 'location', {
    writable: true,
    value: location,
  });
};
