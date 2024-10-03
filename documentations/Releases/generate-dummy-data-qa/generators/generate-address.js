// Copyright 2022 Prescryptive Health, Inc.

const states = ['WA', 'NY', 'OR', 'FL', 'MT', 'NJ', 'PA', 'CA'];
const zipcodes = [
  '98052',
  '98087',
  '11205',
  '10065',
  '98033',
  '13488',
  '32890',
  '10594',
];
const cities = [
  'REDMOND',
  'NEW YORK',
  'LYNWOOD',
  'KIRKLAND',
  'TALLKHASSEE',
  'BROOKLYN',
  'ASBURY',
  'NEWARK',
];

export const generateAddress = (i, prefix = '') => {
  var address1 = `${prefix}ADDRESS1-${i}`;
  var address2 = `${prefix}ADDRESS2-${i}`;
  var addressIndex = i % 8;
  if (addressIndex >= 8) {
    addressIndex = 0;
  }
  var state = states[addressIndex];
  var zip = zipcodes[addressIndex];
  var city = cities[addressIndex];

  var county = `${prefix}COUNTY-${i}`;

  return {
    address1,
    address2,
    state,
    zip,
    city,
    county,
  };
};
