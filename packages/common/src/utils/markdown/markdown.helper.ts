// Copyright 2021 Prescryptive Health, Inc.

const getLinkText = (markdown: string): string[] => {
  const regEx = /\[(.*?)\]/g;
  const linkText: string[] = [];

  let regExResult;
  do {
    regExResult = regEx.exec(markdown);
    if (regExResult !== null) {
      linkText.push(regExResult[1]);
    }
  } while (regExResult !== null);

  return linkText;
};

export default {
  getLinkText,
};
