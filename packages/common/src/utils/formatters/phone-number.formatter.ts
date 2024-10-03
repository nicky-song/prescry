// Copyright 2019 Prescryptive Health, Inc.

export function formatPhoneNumber(phoneNumber: string): string {
  phoneNumber = phoneNumber.replace(/\D/g, '');
  if (phoneNumber.length === 10) {
    const formattedNum =
      '(' +
      phoneNumber[0] +
      phoneNumber[1] +
      phoneNumber[2] +
      ') ' +
      phoneNumber[3] +
      phoneNumber[4] +
      phoneNumber[5] +
      '-' +
      phoneNumber[6] +
      phoneNumber[7] +
      phoneNumber[8] +
      phoneNumber[9];
    return formattedNum;
  } else if (phoneNumber.length === 11) {
    const formattedNum =
      '(' +
      phoneNumber[1] +
      phoneNumber[2] +
      phoneNumber[3] +
      ') ' +
      phoneNumber[4] +
      phoneNumber[5] +
      phoneNumber[6] +
      '-' +
      phoneNumber[7] +
      phoneNumber[8] +
      phoneNumber[9] +
      phoneNumber[10];
    return formattedNum;
  }

  return phoneNumber;
}

export const formatPhoneNumberForApi = (
  phoneNumber: string,
  countryCode = '1'
): string => {
  const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
  const cleanedCountryCode = cleanPhoneNumber(countryCode);

  if (cleanedPhoneNumber.length === 10 + cleanedCountryCode.length) {
    // assuming that if the length > 10, it already has country code
    return `+${cleanedPhoneNumber}`;
  }

  return cleanedPhoneNumber
    ? `+${cleanedCountryCode}${cleanedPhoneNumber}`
    : '';
};

export const cleanPhoneNumber = (phoneNumber = ''): string => {
  return phoneNumber.replace(/[^0-9]+/g, '');
};
