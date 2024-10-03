// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../experiences/guest-experience/guest-experience-logger.middleware';
import { BaseText } from '../../text/base-text/base-text';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { accountLockedContainerContent } from './account-locked-container.content';
import { accountLockedContainerStyles } from './account-locked-container.styles';

export interface IAccountLockedContainerDataProps {
  supportEmail?: string;
  recoveryEmailExists?: boolean;
  onResetPinPress?: () => void;
  accountLockedResponse?: boolean;
}

export const AccountLockedContainer = ({
  recoveryEmailExists,
  supportEmail,
  accountLockedResponse,
  onResetPinPress,
}: IAccountLockedContainerDataProps) => {
  const styles = accountLockedContainerStyles;

  const onResetPinLinkPress = (): boolean => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_PIN_RESET_BUTTON,
      {}
    );

    if (onResetPinPress) {
      onResetPinPress();
    }

    return false;
  };

  const instructionsContent =
    recoveryEmailExists && !accountLockedResponse ? (
      <MarkdownText
        onLinkPress={onResetPinLinkPress}
        textStyle={styles.instructionsTextStyle}
      >
        {accountLockedContainerContent.tryAgainOrReset}
      </MarkdownText>
    ) : (
      <MarkdownText textStyle={styles.instructionsTextStyle}>
        {accountLockedContainerContent.tryAgainOrContactUs(supportEmail)}
      </MarkdownText>
    );

  return (
    <>
      <BaseText>{accountLockedContainerContent.yourAccountIsLocked}</BaseText>
      {instructionsContent}
    </>
  );
};
