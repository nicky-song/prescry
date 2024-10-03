// Copyright 2022 Prescryptive Health, Inc.

export class StringFormatter {
  static format(s, parameterMap) {
    if (!parameterMap) {
      return s;
    }
    let formattedString = s;
    parameterMap.forEach((value, key) => {
      const regex = new RegExp(`\{${key}\}`, 'g');
      formattedString = formattedString.replace(regex, value);
    });
    return formattedString;
  }

  static titleCase(str) {
    return str !== undefined
      ? str
          .trim()
          .toLowerCase()
          .split(' ')
          .map((word) => {
            return word.replace(word[0], word[0].toUpperCase());
          })
          .join(' ')
      : undefined;
  }
}
