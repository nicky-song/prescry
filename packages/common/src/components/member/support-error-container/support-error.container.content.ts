// Copyright 2021 Prescryptive Health, Inc.

export interface ISupportErrorContainerContent {
  defaultError: string;
  title: string;
  reloadLinkText: string;
}

export const supportErrorContainerContent: ISupportErrorContainerContent = {
  defaultError:
    'Looks like an unexpected error has occurred. Please try again by navigating back to the previous screen or reload the page to start over.',
  title: 'Something went wrong',
  reloadLinkText: 'Reload page',
};
