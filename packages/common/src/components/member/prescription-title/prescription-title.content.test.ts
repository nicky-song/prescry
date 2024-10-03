// Copyright 2021 Prescryptive Health, Inc.

import {
  prescriptionTitleContent as content,
  IPrescriptionTitleContent,
} from './prescription-title.content';

describe('prescriptionTitleContent', () => {
  it('has expected content (default)', () => {
    const expectedContent: IPrescriptionTitleContent = {
      editButtonLabel: 'Edit',
    };

    expect(content).toEqual(expectedContent);
  });
});
