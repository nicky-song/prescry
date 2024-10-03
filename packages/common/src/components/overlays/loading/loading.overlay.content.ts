// Copyright 2021 Prescryptive Health, Inc.

export interface ILoadingOverlayContent {
  defaultMessage: string;
  doNotRefreshMessage: string;
}

export const loadingOverlayContent: ILoadingOverlayContent = {
  defaultMessage:
    'We are processing your request \n This may take a few moments. \n \n',
  doNotRefreshMessage: 'Please do not refresh the page',
};
