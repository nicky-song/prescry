// Copyright 2021 Prescryptive Health, Inc.

export interface IAccountLockedContainerContent {
  yourAccountIsLocked: string;
  tryAgainOrReset: string;
  tryAgainOrContactUs: (supportEmail?: string) => string;
}

export const accountLockedContainerContent: IAccountLockedContainerContent = {
  yourAccountIsLocked: `Your account is temporarily locked for 1 hour due to multiple invalid login attempts.`,
  tryAgainOrReset: 'Please try again after 1 hour or [reset your PIN]()',
  tryAgainOrContactUs: (supportEmail = 'support') =>
    `Please try again after 1 hour or [contact us](mailto:${supportEmail})`,
};
