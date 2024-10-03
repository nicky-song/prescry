// Copyright 2021 Prescryptive Health, Inc.

import {
  dialogModalContent,
  IDialogModalContent,
} from './dialog-modal.content';

describe('dialogModalContent', () => {
  it('has expected content', () => {
    const content = dialogModalContent;
    const expectedContent: IDialogModalContent = {
      closeButtonLabel: 'Close dialog',
    };

    expect(content).toEqual(expectedContent);
  });
});
