// Copyright 2021 Prescryptive Health, Inc.

import markdownHelper from './markdown.helper';

describe('markdownHelper', () => {
  it.each([
    ['', []],
    ['I accept [Terms and Conditions](#terms)', ['Terms and Conditions']],
    [
      'I accept [Terms and Conditions](#terms) and [Privacy Policy](#privacy)',
      ['Terms and Conditions', 'Privacy Policy'],
    ],
  ])(
    "gets link text from markdown text '%p'",
    (markdownText: string, expectedLinkText: string[]) => {
      expect(markdownHelper.getLinkText(markdownText)).toEqual(
        expectedLinkText
      );
    }
  );
});
