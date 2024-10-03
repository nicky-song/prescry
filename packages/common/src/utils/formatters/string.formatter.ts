// Copyright 2020 Prescryptive Health, Inc.

export class StringFormatter {
  public static format(s: string, parameterMap?: Map<string, string>): string {
    if (!parameterMap) {
      return s;
    }

    let formattedString = s;

    parameterMap.forEach((value: string, key: string) => {
      const regex = new RegExp(`{${key}}`, 'g');
      formattedString = formattedString.replace(regex, value);
    });

    return formattedString;
  }

  public static trimAndConvertToNameCase(str?: string) {
    return str !== undefined
      ? str
          .trim()
          .toLowerCase()
          .split(' ')
          .filter((word) => word !== '')
          .map((word: string) => {
            return word.replace(word[0], word[0].toUpperCase());
          })
          .join(' ')
      : undefined;
  }

  public static shrinkText(s?: string, maxLength?: number) {
    return s && maxLength && s.length > maxLength
      ? `${s.slice(0, maxLength)}...`
      : s;
  }
}
