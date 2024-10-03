// Copyright 2021 Prescryptive Health, Inc.

import { servicesContent, IServicesContent } from './services.content';

describe('servicesContent', () => {
  it('has expected content', () => {
    const expectedContent: IServicesContent = {
      loading: 'Loading',
    };

    expect(servicesContent).toEqual(expectedContent);
  });
});
