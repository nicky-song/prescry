// Copyright 2020 Prescryptive Health, Inc.

import { SurveyTextInputContent } from './survey-text-input.content';

describe('SurveyTextInputContent', () => {
  it('has expected content', () => {
    expect(SurveyTextInputContent.defaultValidation).toEqual('^.{2,}$');
    expect(SurveyTextInputContent.defaultErrorMessage()).toEqual(
      `Answer must be at least 2 characters`
    );
    expect(SurveyTextInputContent.defaultMinimumCharacterLength).toEqual(2);
  });
});
