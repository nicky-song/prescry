// Copyright 2021 Prescryptive Health, Inc.

import { popupModalContent } from './popup-modal.content';

describe('popupModalContent', () => {
  it('has expected content', () => {
    expect(popupModalContent.defaultCloseText).toEqual('Close');
    expect(popupModalContent.emailError).toEqual(
      'Please enter a valid email address'
    );
  });
});
