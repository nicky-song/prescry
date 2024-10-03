// Copyright 2022 Prescryptive Health, Inc.

import { useUrl } from './use-url';

const useIsFocusedMock = jest.fn(() => true);

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => useIsFocusedMock()
}));

const updateURLWithFeatureFlagsAndLanguageMock = jest.fn();

jest.mock('../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language', () => ({
  updateURLWithFeatureFlagsAndLanguage: (args: string) => updateURLWithFeatureFlagsAndLanguageMock(args)
}));


describe('useUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('if isFocusd is true, should update url with argument url', () => {
    useIsFocusedMock.mockReturnValue(true);
    const mockUrl = '/mockUrl';
    useUrl(mockUrl);
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledTimes(1);
    expect(updateURLWithFeatureFlagsAndLanguageMock).toBeCalledWith(mockUrl);
  });
  
  it('if isFocusd is false, updateUrl function should not be called', () => {
    const mockUrl = '/mockUrl';
    useIsFocusedMock.mockReturnValue(false);
    useUrl(mockUrl);
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledTimes(0);
  });
  
  it('if url is undefined, updateUrl function should not be called', () => {
    const mockUrl = undefined;
    useIsFocusedMock.mockReturnValue(true);
    useUrl(mockUrl);
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledTimes(0);
  });
});