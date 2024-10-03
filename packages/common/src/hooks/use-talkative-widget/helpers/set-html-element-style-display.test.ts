// Copyright 2022 Prescryptive Health, Inc.

import { setHtmlElementStyleDisplay } from './set-html-element-style-display';

describe('setHtmlElementStyleDisplay', () => {
  it.each([['block'], ['none']])(
    `Function should set the styling display value correctly (value: %p)`,
    (expectedStyleDisplayValue: string) => {
      const divElementMock = document.createElement('div');
      setHtmlElementStyleDisplay(divElementMock, expectedStyleDisplayValue);
      expect(divElementMock.style.display).toEqual(expectedStyleDisplayValue);
    }
  );
});
