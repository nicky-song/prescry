// Copyright 2020 Prescryptive Health, Inc.

export interface IFormatItem {
  isHighlighted: boolean;
  text: string;
}

const highlightStartTag = '<m>';
const highlightEndTag = '</m>';

export class FormatPatternHelper {
  public static parse(pattern: string): IFormatItem[] {
    const segmentDelim = '^';
    const highlightStartRegex = new RegExp(highlightStartTag, 'g');
    const highlightEndRegex = new RegExp(highlightEndTag, 'g');

    const simplifiedPattern = FormatPatternHelper.mergeAdjacentTags(pattern);

    const segmentedPattern = simplifiedPattern
      .replace(highlightStartRegex, segmentDelim + highlightStartTag)
      .replace(highlightEndRegex, highlightEndTag + segmentDelim);
    const patternParts = segmentedPattern.split(segmentDelim);

    const items: IFormatItem[] = [];
    patternParts.forEach((patternPart: string) => {
      if (!patternPart) {
        return;
      }

      const isHighlighted = patternPart.startsWith(highlightStartTag);
      items.push({
        isHighlighted,
        text: patternPart
          .replace(highlightStartTag, '')
          .replace(highlightEndTag, ''),
      });
    });

    return items;
  }

  public static stripTags(pattern: string): string {
    const highlightStartRegex = new RegExp(highlightStartTag, 'g');
    const highlightEndRegex = new RegExp(highlightEndTag, 'g');
    return pattern
      .replace(highlightStartRegex, '')
      .replace(highlightEndRegex, '');
  }

  private static mergeAdjacentTags(pattern: string): string {
    const regex = new RegExp(highlightEndTag + highlightStartTag, 'g');
    return pattern.replace(regex, '');
  }
}
