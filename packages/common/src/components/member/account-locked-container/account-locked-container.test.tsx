// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../experiences/guest-experience/guest-experience-logger.middleware';
import { BaseText } from '../../text/base-text/base-text';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { AccountLockedContainer } from './account-locked-container';
import { accountLockedContainerContent } from './account-locked-container.content';
import { accountLockedContainerStyles } from './account-locked-container.styles';

jest.mock('../../text/markdown-text/markdown-text', () => {
  return {
    MarkdownText: () => <div />,
  };
});

jest.mock(
  '../../../experiences/guest-experience/guest-experience-logger.middleware'
);

const guestExperienceCustomEventLoggerMock = guestExperienceCustomEventLogger as jest.Mock;

describe('AccountLockedContainer', () => {
  it('renders in fragment container', () => {
    const testRenderer = renderer.create(<AccountLockedContainer />);

    const fragment = testRenderer.root.children;

    expect(fragment.length).toEqual(2);
  });

  it('renders account locked text', () => {
    const testRenderer = renderer.create(<AccountLockedContainer />);

    const accountLockedText = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(accountLockedText.type).toEqual(BaseText);
    expect(accountLockedText.props.children).toEqual(
      accountLockedContainerContent.yourAccountIsLocked
    );
  });

  it.each([
    [
      undefined,
      undefined,
      undefined,
      accountLockedContainerContent.tryAgainOrContactUs(),
    ],
    [
      false,
      false,
      'support-email',
      accountLockedContainerContent.tryAgainOrContactUs('support-email'),
    ],
    [true, false, undefined, accountLockedContainerContent.tryAgainOrReset],
    [
      true,
      true,
      'support-email',
      accountLockedContainerContent.tryAgainOrContactUs('support-email'),
    ],
    [
      false,
      true,
      'support-email',
      accountLockedContainerContent.tryAgainOrContactUs('support-email'),
    ],
  ])(
    'renders instructions (recoveryEmailExists: %p; accountLockedResponse: %p; supportEmail: %p)',
    (
      recoveryEmailExistsMock: undefined | boolean,
      accountLockedResponseMock: undefined | boolean,
      supportEmailMock: undefined | string,
      expectedInstructions: string
    ) => {
      const testRenderer = renderer.create(
        <AccountLockedContainer
          supportEmail={supportEmailMock}
          recoveryEmailExists={recoveryEmailExistsMock}
          accountLockedResponse={accountLockedResponseMock}
        />
      );

      const instructionsMarkdown = testRenderer.root
        .children[1] as ReactTestInstance;

      expect(instructionsMarkdown.type).toEqual(MarkdownText);
      expect(instructionsMarkdown.props.textStyle).toEqual(
        accountLockedContainerStyles.instructionsTextStyle
      );
      expect(instructionsMarkdown.props.children).toEqual(expectedInstructions);
    }
  );

  it('handles reset PIN', () => {
    const onResetPinPressMock = jest.fn();

    const testRenderer = renderer.create(
      <AccountLockedContainer
        recoveryEmailExists={true}
        accountLockedResponse={undefined}
        onResetPinPress={onResetPinPressMock}
      />
    );

    const instructionsMarkdown = testRenderer.root.findByType(MarkdownText);
    instructionsMarkdown.props.onLinkPress();

    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.CLICKED_PIN_RESET_BUTTON,
      {}
    );
    expect(onResetPinPressMock).toHaveBeenCalled();
  });
});
