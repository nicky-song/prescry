## Steps to run this script

1. `yarn` to install all dependencies
2. yarn start `yarn start [--publish]`
   - When the `--publish` flag is included, the script will fix the coverages
     discovered in the identify step
3. Create a .env file at root level sample format:

   ```
   DATABASE_CONNECTION_STRING=<DB>
   SERVICE_BUS_CONNECTION_STRING=<service bus connection string>
   DATABASE_NAME=<DB name>
   RECORD_COUNT=10000
   RECORD_START=0
   OVERRIDE_NUMBERS=<comma separated list of numbers to check directly>
   BATCH_SIZE=50
   RESOURCE_TOKEN_URL='https://login.microsoftonline.com/{tenantId}/oauth2/token'
   OAUTH_API_BODY_RESOURCE='client_id={clientId}&client_secret={clientSecret}&resource={scope}&grant_type=client_credentials'
   GEARS_API_SUBSCRIPTION_KEY=<subscription key>
   COVERAGE_API_RESOURCE='https://gears.test.prescryptive.io/eligibility/coverage'<Change it for prod url>
   IDENTITY_API_RESOURCE='https://gears.test.prescryptive.io'<Change it for prod url>
   AUTH0_API_CLIENT_ID=<client id>
   AUTH0_API_CLIENT_SECRET=<client secret>
   AUTH0_TOKEN_API="https://phxqa2.us.auth0.com/oauth/token"<Change it for prod url>
   AUTH0_AUDIENCE_IDENTITY="https://identity.test.prescryptive.io"<Change it for prod url>
   ```

## initial requirements

1. Perform in batches (e.g. perform the script for the first 50k person
   records + start number to skip)
2. Batch all asyncable calls with a different limit (e.g. 50)
3. Provide output in 3 files:
   - (If any) List of patient ids for accounts with 0 coverages
   - List of patient ids of identified accounts with 1 coverage
   - List of patient ids of identified accounts with 2+ coverages
4. Log what settings were set at beginning and end of script

## This Script will perform following tasks

For major batch, by mini batch

1. Pull in batch of person records, not parallel
2. Run query for each record to find cash coverages by patient/{masterid},
   parallel
3. Handle results and add to each file (accountId masterId and coverageId) (and
   coverageId of the false ones)
4. (Handle removal of cash coverages)
