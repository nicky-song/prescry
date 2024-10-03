// Copyright 2022 Prescryptive Health, Inc.

export const generateAccountRecord = (
  i,
  phoneNumber,
  firstName,
  lastName,
  dateOfBirth,
  email,
  acceptedDateTime
) => {
  return {
    phoneNumber,
    accountKey: `accountKey-${i}`,
    pinHash: `pinHash-${i}`,
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    recoveryEmail: email,
    termsAndConditionsAcceptances: {
      hasAccepted: true,
      allowSmsMessages: true,
      allowEmailMessages: true,
      fromIP: '::ffff:147.243.154.40',
      acceptedDateTime,
      browser:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      authToken: `some token ${i}`,
    },
    isDummy: true,
  };
};
