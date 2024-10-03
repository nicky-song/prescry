// Copyright 2022 Prescryptive Health, Inc.

import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';
import { updateURLWithFeatureFlagsAndLanguage } from './update-url-with-feature-flags-and-language';

jest.mock('../../../../utils/translation/get-query-language.helper');
const getQueryLanguageMock = getQueryLanguage as jest.Mock;

let replaceStateSpy: jest.SpyInstance;

describe('updateURLWithFeatureFlagsAndLanguage', () => {
  beforeEach(() => {
    replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => ({}));

    getQueryLanguageMock.mockReturnValue(undefined);
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
  });

  it('if no pathname and no location.search, called with empty string', () => {
    updateURLWithFeatureFlagsAndLanguage();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}`
    );
  });

  it('if no pathname and f exists in location.search, called with ?f=fMock', () => {
    const fMock = 'f=fMock';

    const expectedFParam = `?${fMock}`;

    queryParamMock(expectedFParam);

    updateURLWithFeatureFlagsAndLanguage();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${expectedFParam}`
    );
  });

  it('if no pathname and lang exists in location.search, called with ?lang=langMock', () => {
    const langMock = 'lang=langMock';

    const expectedLangParam = `?${langMock}`;

    queryParamMock(expectedLangParam);

    updateURLWithFeatureFlagsAndLanguage();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${expectedLangParam}`
    );
  });

  it('if no pathname and f and lang exist in location.search, called with ?f=fMock&lang=langMock', () => {
    const fMock = 'f=fMock';
    const langMock = 'lang=langMock';

    const expectedParams = `?${fMock}&${langMock}`;

    queryParamMock(expectedParams);

    updateURLWithFeatureFlagsAndLanguage();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${expectedParams}`
    );
  });

  it('if pathname exists and f exists in location.search, called with /pathname?f=fMock', () => {
    const fMock = 'f=fMock';
    const pathMock = '/pathMock';

    const expectedParams = `?${fMock}`;

    queryParamMock(expectedParams);

    updateURLWithFeatureFlagsAndLanguage(pathMock);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}${expectedParams}`
    );
  });

  it('if pathname exists and lang exists in location.search, called with /pathname?lang=langMock', () => {
    const langMock = 'lang=langMock';
    const pathMock = '/pathMock';

    const expectedParams = `?${langMock}`;

    queryParamMock(expectedParams);

    updateURLWithFeatureFlagsAndLanguage(pathMock);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}${expectedParams}`
    );
  });

  it('if pathname exists and f and lang exist in location.search, called with /pathname?f=fMock&lang=langMock', () => {
    const fMock = 'f=fMock';
    const langMock = 'lang=langMock';
    const pathMock = '/pathMock';

    const expectedParams = `?${fMock}&${langMock}`;

    queryParamMock(expectedParams);

    updateURLWithFeatureFlagsAndLanguage(pathMock);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}${expectedParams}`
    );
  });

  it('changes query param language when f and lang parameters are passed', () => {
    const spanishLangMock = 'es';
    const englishParamsMock = 'lang=en';
    const spanishParamsMock = `lang=${spanishLangMock}`;

    const fMock = 'f=fMock';
    const paramsMock = `?${fMock}&${englishParamsMock}`;
    const expectedParams = `?${fMock}&${spanishParamsMock}`;

    const pathMock = '/pathMock';

    queryParamMock(paramsMock);

    updateURLWithFeatureFlagsAndLanguage(pathMock, spanishLangMock, true);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}${expectedParams}`
    );
  });

  it('changes query param language when lang parameter is passed', () => {
    const spanishLangMock = 'es';
    const englishParamsMock = 'lang=en';
    const spanishParamsMock = `lang=${spanishLangMock}`;
    const pathMock = '/pathMock';

    const paramsMock = `?${englishParamsMock}`;

    const expectedParams = `?${spanishParamsMock}`;

    queryParamMock(paramsMock);

    updateURLWithFeatureFlagsAndLanguage(pathMock, spanishLangMock);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}${expectedParams}`
    );
  });

  it('do not set language query param if the language is default language', () => {
    const englishParamsMock = 'lang=en';
    const pathMock = '/pathMock';

    const paramsMock = `?${englishParamsMock}`;

    getQueryLanguageMock.mockReturnValue('English');

    queryParamMock(paramsMock);

    updateURLWithFeatureFlagsAndLanguage(pathMock, 'en');

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${pathMock}`
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
