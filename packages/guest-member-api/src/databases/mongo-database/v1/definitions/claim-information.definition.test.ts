// Copyright 2020 Prescryptive Health, Inc.

import { ClaimInformationDefinition } from './claim-information.definition';

describe('ClaimInformationDefintion', () => {
  it('creates instance of SchemaDefinition<ICliamInformation>', () => {
    const result = ClaimInformationDefinition();
    expect(result).toMatchObject({
      prescriberNationalProviderId: { type: String, required: true },
      productOrServiceId: { type: String, required: true },
      providerLegalName: { type: String, required: true },
    });
  });
});
