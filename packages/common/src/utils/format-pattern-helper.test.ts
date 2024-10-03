// Copyright 2020 Prescryptive Health, Inc.

import { FormatPatternHelper, IFormatItem } from './format-pattern-helper';

describe('FormatPatternHelper', () => {
  it('parses pattern', () => {
    parsesPattern('', []);
    parsesPattern('Trulicity', [{ isHighlighted: false, text: 'Trulicity' }]);
    parsesPattern('Trul<m>i</m>c<m>i</m>ty', [
      { isHighlighted: false, text: 'Trul' },
      { isHighlighted: true, text: 'i' },
      { isHighlighted: false, text: 'c' },
      { isHighlighted: true, text: 'i' },
      { isHighlighted: false, text: 'ty' },
    ]);
    parsesPattern('<m>Trulicity</m>', [
      { isHighlighted: true, text: 'Trulicity' },
    ]);
    parsesPattern('<m>Truli</m>city', [
      { isHighlighted: true, text: 'Truli' },
      { isHighlighted: false, text: 'city' },
    ]);
    parsesPattern('Truli<m>city</m>', [
      { isHighlighted: false, text: 'Truli' },
      { isHighlighted: true, text: 'city' },
    ]);
  });

  it('merges adjacent tags when parsing pattern', () => {
    parsesPattern('<m>T</m><m>r</m><m>u</m>li<m>c</m><m>ity</m>', [
      { isHighlighted: true, text: 'Tru' },
      { isHighlighted: false, text: 'li' },
      { isHighlighted: true, text: 'city' },
    ]);
  });

  function parsesPattern(pattern: string, expectedItems: IFormatItem[]) {
    const items = FormatPatternHelper.parse(pattern);

    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: IFormatItem, index: number) => {
      const expectedItem = expectedItems[index];
      expect(item).toEqual(expectedItem);
    });
  }

  it('strips tags', () => {
    expect(FormatPatternHelper.stripTags('')).toEqual('');
    expect(FormatPatternHelper.stripTags('Trulicity')).toEqual('Trulicity');
    expect(FormatPatternHelper.stripTags('Trul<m>i</m>c<m>i</m>ty')).toEqual(
      'Trulicity'
    );
    expect(
      FormatPatternHelper.stripTags(
        '<m>T</m><m>r</m><m>u</m><m>l</m><m>i</m><m>c</m><m>i</m>ty (Dulaglut<m>i</m>de)'
      )
    ).toEqual('Trulicity (Dulaglutide)');
  });
});
