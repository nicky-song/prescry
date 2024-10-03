// Copyright 2020 Prescryptive Health, Inc.

import {
  IPersonalInfoExpanderContent,
  personalInfoExpanderContent,
} from './personal-info-expander.content';

describe('personalInfoExpanderContent', () => {
  it('has expected content', () => {
    const expectedContent: IPersonalInfoExpanderContent = {
      headerText: 'Personal Information',
      name: 'Name:',
      dateOfBirth: 'DOB:',
    };

    expect(personalInfoExpanderContent).toEqual(expectedContent);
  });
});
