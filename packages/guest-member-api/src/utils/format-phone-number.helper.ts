// Copyright 2022 Prescryptive Health, Inc.

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber.slice(phoneNumber.length - 10)).replace(
    /\D/g,
    ''
  );
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};
