// Copyright 2021 Prescryptive Health, Inc.

import {
  accountLockedContainerContent,
  IAccountLockedContainerContent,
} from './account-locked-container.content';

describe('accountLockedContainerContent', () => {
  it('has expected content', () => {
    const expectedContent: IAccountLockedContainerContent = {
      yourAccountIsLocked: `Your account is temporarily locked for 1 hour due to multiple invalid login attempts.`,
      tryAgainOrReset: 'Please try again after 1 hour or [reset your PIN]()',
      tryAgainOrContactUs: expect.any(Function),
    };

    expect(accountLockedContainerContent).toEqual(expectedContent);

    expect(accountLockedContainerContent.tryAgainOrContactUs()).toEqual(
      `Please try again after 1 hour or [contact us](mailto:support)`
    );

    const supportEmailMock = 'support-email-mock';
    expect(
      accountLockedContainerContent.tryAgainOrContactUs(supportEmailMock)
    ).toEqual(
      `Please try again after 1 hour or [contact us](mailto:${supportEmailMock})`
    );
  });
});
