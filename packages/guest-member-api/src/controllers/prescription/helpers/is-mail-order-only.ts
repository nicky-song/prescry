// Copyright 2021 Prescryptive Health, Inc.

const mailOrderPharmacyNPIs = [
  '1053486795',
  '1740639590',
  '1588753263',
  '1538529698',
  '1730515792',
  '1902195415',
  '1194274936',
];

export default (npi?: string): boolean =>
  !!npi && mailOrderPharmacyNPIs.includes(npi);
