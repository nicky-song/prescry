## Steps to run this script

1. Install: `yarn` to install all dependencies
1. Create a .env file at root level sample format:

   ```
   BATCH_SIZE=10
   BATCH_COUNT=<This is to tell how many batches to process before stopping script. If it is 0 or undefined then script will not consider this variable>
   SLEEP_INTERVAL=1000
   LOGGER_PREFIX=<optional path to store log files default: 'logs'>
   DATABASE_CONNECTION_STRING=<DB>
   SERVICE_BUS_CONNECTION_STRING=<service bus connection string>
   DATABASE_NAME=<DB name>
   RESOURCE_TOKEN_URL='https://login.microsoftonline.com/{tenantId}/oauth2/token'
   OAUTH_API_BODY_RESOURCE='client_id={clientId}&client_secret={clientSecret}&resource={scope}&grant_type=client_credentials'
   PLATFORM_API_CLIENT_ID=<client id>
   PLATFORM_API_CLIENT_SECRET=<client secret>
   PLATFORM_API_TENANT_ID=<tenant id>
   PLATFORM_API_RESOURCE=<resource url>
   TOPIC_PERSON_UPDATE='topic-person-update-dev'<Change it for prod topic>
   GEARS_API_SUBSCRIPTION_KEY=<subscription key>
   ELIGIBILITY_API_RESOURCE='https://gears.test.prescryptive.io/eligibility/coverage'<Change it for prod url>
   IDENTITY_API_RESOURCE='https://gears.test.prescryptive.io'<Change it for prod url>
   AUTH0_API_CLIENT_ID=<client id>
   AUTH0_API_CLIENT_SECRET=<client secret>
   AUTH0_TOKEN_API="https://phxqa2.us.auth0.com/oauth/token"<Change it for prod url>
   AUTH0_AUDIENCE_IDENTITY="https://identity.test.prescryptive.io"<Change it for prod url>
   ```

1. Run: `yarn start [--publish]`
   - `--publish` will publish the results found in the identify step

## This Script will perform following tasks

Here is my understanding for how each step of the requirements will be handled:

Step 1: Load New users These are the ways a new user will be added

1. New CASH users

   - Handled by running process-added-users.js (Or by running the migration
     script again)

2. New PBM users loaded by eligibility file (hopefully pbm PII record exists)

   - We'll do nothing until the user is activated, then it will be handled by
     running process-added-users.js (Or by running the migration script again)

3. Existing PBM profiles were activated by the users (and that created a new
   CASH profile for them) For each new record added, check if the phone number
   exists and have another record with same phoneNumber (a PBM user finished
   phoneNumber verification, so got a new CASH profile) -> then instead of
   creating new masterId, update existing masterId with Step 3 rules and then
   update CASH profile in RxAssistant-Person with the same masterId
   - Handled by running process-added-users.js (Or by running the migration
     script again)

Step 2: Update existing users These are the ways a user will be updated

1. CASH user creates an appointment and adds address (There would be an event in
   events array in Person collection)

   - Handled in this PR using updatedFields

2. CASH users updated their email (This would be an event in account collection)

   - Handled in this PR using updatedFields

3. Support team updates name/dob for the CASH users (There would be an event in
   events array in Person collection)

   - Handled in this PR using updatedFields

4. Brand new PBM user activates their profile (Would already be covered in step
   1c)

   - Handled by running process-added-users.js (Or by running the migration
     script again)

5. Existing CASH users link their PBM profile

   - Handled in this PR using recentlyUpdated on a pbmProfile

6. Updated the communication language based on userPreferences.

## Update communication language of all users.

1. Run: `yarn add-language-preference-to-patient [--publish]`
   - `--publish` will publish the results found in the identify step

## This Script will perform following tasks

1. Load all patient accounts.
2. Filter patients that has `patientProfile`.
3. Update communication language based on `UserPreferences` of patient account.
