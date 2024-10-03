// Copyright 2022 Prescryptive Health, Inc.

import { formatProviderName } from './format-provider-name';

describe('formatProviderName', () => {
  it('provider name should be wrapped to the next line if > 2 words', () => {
    const providerNameMock = 'PROVIDER A LARGE NAME';
    const expectedProviderName = 'PROVIDER A\n LARGE NAME';

    const result = formatProviderName(providerNameMock);

    expect(result).toEqual(expectedProviderName);
  });

  it('should not format the provider name if <= 2 words', () => {
    const providerNameMock = 'PROVIDER A';
    const expectedProviderName = 'PROVIDER A';

    const result = formatProviderName(providerNameMock);

    expect(result).toEqual(expectedProviderName);
  });
});
