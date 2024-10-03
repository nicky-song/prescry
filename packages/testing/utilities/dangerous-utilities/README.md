# Running the reset account

Create a file called index.ts with content like this:

```typescript
// Copyright 2022 Prescryptive Health, Inc.

import resetAccount from './reset-account';

resetAccount('Replace with phone number')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Done');
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error(`Failed ${error}`);
  });
```

In terminal run:

```bash
export DATABASE_CONNECTION_STRING = 'Replace with Connection String';
export DATABASE_NAME = 'Replace with Database Name';
export REDIS_PORT='6380'
export REDIS_HOST='Replace with Redis host name'
export REDIS_AUTH_PASS='Replace with Redis password'
cd packages/testing
npx ts-node utilities/dangerous-utilities/index.ts
```
