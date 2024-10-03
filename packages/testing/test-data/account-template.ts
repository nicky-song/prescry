// Copyright 2023 Prescryptive Health, Inc.

export const accountTemplate = {
  //_id: '', //ObjectId("5e7dca40434cbe02a4106f07"),
  phoneNumber: '', //'+14252875340',
  accountKey: '$2a$10$N3.3w/bPulT.UjLYcCxrO.',
  pinHash: '$2a$10$VrNQz5S2KhXW9ouVNFsDQelIOS5a46cxqXZcqVlV7zCbTOMcRgDnO',
  firstName: '', //'TEST',
  lastName: '', //'TEST',
  dateOfBirth: {
    $date: 631152000000,
  },
  termsAndConditionsAcceptances: {
    hasAccepted: true,
    allowSmsMessages: true,
    allowEmailMessages: true,
    fromIP: '::ffff:147.243.162.13',
    acceptedDateTime: {
      $date: 1674684276846,
    },
    browser:
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.30 Mobile Safari/537.36',
    authToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2UiOiJLekUwTWpVeU9EYzFNelF3IiwiZGV2aWNlSWRlbnRpZmllciI6IjYzZDFhNzc0MjY3Mzc3ZjViY2YwNWQwMSIsImRldmljZUtleSI6IiQyYSQxMCROMy4zdy9iUHVsVC5VakxZY0N4ck8uIiwiZGV2aWNlVHlwZSI6InBob25lIiwiaWF0IjoxNjc0Njg0Mjc2LCJleHAiOjE3MDYyMjAyNzZ9.t2vGOXJpWqWgayQUd5xJAXaC3LNQ9WBNS6-oloJeF8I',
  },
  events: [],
  recoveryEmail: '', //'testing@prescryptive.com',
  masterId: '', //'PIUFPF78',
  favoritedPharmacies: [],
  isFavoritedPharmaciesFeatureKnown: true,
  accountId: '', // 'PIUFPF78',
};
