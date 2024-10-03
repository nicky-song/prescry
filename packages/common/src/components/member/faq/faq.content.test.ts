// Copyright 2021 Prescryptive Health, Inc.

import { faqContent, IFAQContent } from './faq.content';

describe('faqContent', () => {
  it('should have expected content', () => {
    const expectedContent: IFAQContent = {
      title: 'FAQ',
    };
    expect(faqContent).toEqual(expectedContent);
  });
});
