// Copyright 2020 Prescryptive Health, Inc.

import { phoneMaskInputContent } from './phone.mask.input.content';

describe('phoneMaskInputContent', () => {
  it('has expected content (default)', () => {
    const content = phoneMaskInputContent;
    expect(content.placeholder).toEqual('(000) 000-0000');
  });
});
