// Copyright 2022 Prescryptive Health, Inc.

import { setAppElementStyling } from './set-app-element-styling';

describe('setAppElementStyling', () => {
  it.each([
    [true, '80px'],
    [false, '0px'],
  ])(
    `Function setAppElementStyling should set the styling margin top value correctly (showHeader: %p; expectedMarginTopValue: %p)`,
    (showHeader: boolean, expectedMarginTopValue: string) => {
      const divElementMock = document.createElement('div');
      setAppElementStyling(divElementMock, showHeader);
      expect(divElementMock.style.marginTop).toEqual(expectedMarginTopValue);
    }
  );
});
