// Copyright 2022 Prescryptive Health, Inc.

export const convertDateFormat = (value, pattern = '####-##-##') => {
  var i = 0,
    date = value.toString();
  return pattern.replace(/#/g, (_) => date[i++]);
};

// var displayDate = dateFormat('19700101', '####-##-##');

export const convertRxAssistantDobToBenefitDob = (dateOfBirth) => {
  return dateOfBirth.replace(/-/gi, '');
};
