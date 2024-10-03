This utility is used to create a claim alert.

You can create an index.ts file like this:

```typescript
// Copyright 2023 Prescryptive Health, Inc.

import generateAndSendClaimAlerts from './generate-and-send-claim-alerts';

const persona = {
  phoneNumber: '4252875340',
  pin: '1234',
  firstName: 'F',
  lastName: 'L',
  dateOfBirth: '2000-05-01',
  email: 'test@prescriptive.com',
  groupNumber: '100L7PR',
  cardHolderID: 'T4252875340',
  personCode: '01',
};
const drugs = ['greatPrice'];
generateAndSendClaimAlerts(persona, drugs)
  .then((claimAlerts) => {
    // eslint-disable-next-line no-console
    console.log(claimAlerts);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
```

Then run this:

```bash
cd packages/testing
npx ts-node utilities/claim-alerts/index.ts
```
