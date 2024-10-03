// Copyright 2021 Prescryptive Health, Inc.

import {
  applicationHeaderContent,
  IApplicationHeaderContent,
} from './application-header.content';

describe('applicationHeaderContent', () => {
  it('has expected content', () => {
    const content = applicationHeaderContent;
    const expectedContent: IApplicationHeaderContent = {
      goBackButtonLabel: 'Go back to previous screen',
    };

    expect(content).toEqual(expectedContent);
  });
});
