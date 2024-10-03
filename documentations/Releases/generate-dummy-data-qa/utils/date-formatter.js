// Copyright 2022 Prescryptive Health, Inc.

import moment from 'moment';

export const getEffectiveDate = () => {
  var dateNow = new Date();
  return moment(dateNow.toUTCString()).format('YYYYMMDD');
};

export const convertRxAssistantDobToBenefitDob = (dateOfBirth) => {
  return dateOfBirth.replace(/-/gi, '');
};
