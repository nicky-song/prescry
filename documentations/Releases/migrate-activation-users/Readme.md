## Steps to run this script

1. Install: `yarn` to install all dependencies
1. Create a .env file at root level sample format:

   ```
   BATCH_SIZE=10
   BATCH_COUNT=<This is to tell how many batches to process before stopping script. If it is 0 or undefined then script will not consider this variable>
   PBM_TENANT=<PBM tenant for authorization when updating identity records>
   RX_GROUP=<RX group to run the script against. Rx groups may require different PBM tenants>
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

1. Run: `yarn start [--publish]` or
   `node migrate-activation-users.js [--publish]`
   - `--publish` will publish the results found in the identify step

## This Script will perform following tasks

1. Query the Benefits - Person record with the PBM member id and see if PBM
   master id exists.

2. If PBM masterId exists, get the PBM patient record and update patient record
   to add rank:'1' in telecom for that phone number object.

   - If PBM record already has a rank of 1, then no action needed on that
     record.
