// Copyright 2021 Prescryptive Health, Inc.

import { ChangeSlotDataContent } from "./change-slot-data-loading.content";

describe('changeSlotDataContent', () => {
  it('has expected content', () => {
    expect(ChangeSlotDataContent.modalMessageMainHeader()).toEqual(
      `We're securing your appointment time.`
    );
  });
});
