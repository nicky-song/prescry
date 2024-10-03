// Copyright 2020 Prescryptive Health, Inc.

import { MoreAboutDiabetesContent } from './more-about-diabetes.content';

describe('MoreAboutDiabetesContent', () => {
  it('has expected content', () => {
    expect(MoreAboutDiabetesContent.headerText()).toEqual(
      'More about Diabetes'
    );
    expect(MoreAboutDiabetesContent.chevronUp).toEqual('chevron-up');
    expect(MoreAboutDiabetesContent.chevronDown).toEqual('chevron-down');
  });
});
