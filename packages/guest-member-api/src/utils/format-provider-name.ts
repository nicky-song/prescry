// Copyright 2022 Prescryptive Health, Inc.

export const formatProviderName = (providerName: string): string => {
  const space = ' ';
  const charArray = providerName.split(space);

  if (charArray.length > 2) {
    charArray[1] = charArray[1] + '\n';
    return charArray.join(space);
  }
  return providerName;
};
