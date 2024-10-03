## Steps to run this script

1. `yarn` to install all dependencies
2. yarn start `yarn start [--publish]`
   - When the `--publish` flag is included, the script will publish the accounts
     discovered in the identify step
3. Create a .env file at root level sample format:

   ```
   DATABASE_CONNECTION_STRING=<DB>
   SERVICE_BUS_CONNECTION_STRING=<service bus connection string>
   DATABASE_NAME=<DB name>
   BATCH_SIZE=10000
   LOG_BATCH_LIMIT=<Stop logging individual records after this amount e.g 100?
   SLEEP_INTERVAL=1000
   IS_PUBLISH_MESSAGE=false
   INCLUDE_PBM=false<set to true to run the pbm user portion of the script>
   CONFIRM_CONTINUE=false<if true, pauses will wait for 'Enter' input from user before continuing>
   CREATE_TEST_DATA=false<if true, test data will be created before each run>
   LOGGER_PREFIX=<optional path to store log files>
   BATCH_COUNT=<This is to tell how many batches to process before stopping script. If it is 0 or undefined then script will not consider this variable>
   RESOURCE_TOKEN_URL='https://login.microsoftonline.com/{tenantId}/oauth2/token'
   OAUTH_API_BODY_RESOURCE='client_id={clientId}&client_secret={clientSecret}&resource={scope}&grant_type=client_credentials'
   PLATFORM_API_CLIENT_ID=<client id>
   PLATFORM_API_CLIENT_SECRET=<client secret>
   PLATFORM_API_TENANT_ID=<tenant id>
   PLATFORM_API_RESOURCE=<resource url>
   TOPIC_PERSON_UPDATE='topic-person-update-dev'<Change it for prod topic>
   TOPIC_ACCOUNT_UPDATE='topic-account-update-dev'<Change it for prod topic>
   GEARS_API_SUBSCRIPTION_KEY=<subscription key>
   ELIGIBILITY_API_RESOURCE='https://gears.test.prescryptive.io/eligibility/coverage'<Change it for prod url>
   IDENTITY_API_RESOURCE='https://gears.test.prescryptive.io'<Change it for prod url>
   ```

## This Script will perform following tasks

1.  Get all deleted or empty cash users or unused PBM users and all related
    dependents
2.  Publish "deleted : true" message to the service bus for each unused record
    with action "PersonUpdate"
3.  Generates Identity service endpoint bearer token globally and uses it while
    creating patient record in PII.
4.  Gets all valid CASH users and process each cash user to bring all
    profiles(cash, account, pbm, benefit person details) and process each record
    to store it in PII as well as updating masterID in person and account
    collections for each phone number.Creates new record in PatientAccount
    collection once masterID is returned from PII store
5.  Gets all pbmActivationUsers and process each record to store it in PII as
    well as updating masterID in person and account collections for each phone
    number.Creates new record in PatientAccount collection once masterID is
    returned from PII store

### Additional Details

1.  Waits for the specified time in seconds after each batchSize execution
2.  Creates log files for published records and unpublished records
3.  Creates separate log files for account, benefit, fhir exceptions.
4.  Script will continue for any exception. Only when it it not able to write
    record to PII store after 3 retries, it will stop. If writing to
    PatientAccount service fails it will continue, it will just log the failed
    record to "unpublished" log file.

### Note on the PBM script:

We are not checking for coverages anywhere in this PBM linking script because
its just for one time purpose and we clearly know benefit team will migrate only
active users.

If we wanted to run this script for multiple times, we need to add code to look
for coverages as well
