// Copyright 2021 Prescryptive Health, Inc.

import {
  loadingOverlayContent,
  ILoadingOverlayContent,
} from './loading.overlay.content';

describe('loadingOverlayContent', () => {
  it('has expected content', () => {
    const content = loadingOverlayContent;
    const expectedContent: ILoadingOverlayContent = {
      defaultMessage:
        'We are processing your request \n This may take a few moments. \n \n',
      doNotRefreshMessage: 'Please do not refresh the page',
    };

    expect(content).toEqual(expectedContent);
  });
});
