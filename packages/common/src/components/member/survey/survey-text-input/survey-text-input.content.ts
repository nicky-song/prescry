// Copyright 2020 Prescryptive Health, Inc.

export const SurveyTextInputContent = {
  defaultValidation: '^.{2,}$',
  defaultMinimumCharacterLength: 2,
  defaultErrorMessage: () =>
    `Answer must be at least` +
    ` ${SurveyTextInputContent.defaultMinimumCharacterLength} ` +
    `characters`,
};
