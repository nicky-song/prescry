// Copyright 2021 Prescryptive Health, Inc.

import {
  IAccountLockedScreenContent,
  accountLockedScreenContent,
} from './account-locked.screen.content';

describe('accountLockedScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IAccountLockedScreenContent = {
      title: 'Account locked',
    };

    expect(accountLockedScreenContent).toEqual(expectedContent);
  });
});
