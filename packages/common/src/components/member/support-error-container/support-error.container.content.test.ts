// Copyright 2021 Prescryptive Health, Inc.

import {
  ISupportErrorContainerContent,
  supportErrorContainerContent,
} from './support-error.container.content';

describe('supportErrorContainerContent', () => {
  it('has expected content', () => {
    const expectedContent: ISupportErrorContainerContent = {
      defaultError:
        'Looks like an unexpected error has occurred. Please try again by navigating back to the previous screen or reload the page to start over.',
      title: 'Something went wrong',
      reloadLinkText: 'Reload page',
    };

    expect(supportErrorContainerContent).toEqual(expectedContent);
  });
});
