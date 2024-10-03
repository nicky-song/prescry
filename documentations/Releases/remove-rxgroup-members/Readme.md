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
   BATCH_COUNT=<This is to tell how many batches to process before stopping script. If it is 0 or undefined then script will not consider this variable>
   RX_GROUP=<rx group to search by>
   RX_SUB_GROUP=<rx subgroup to search by>
   TOPIC_PERSON_UPDATE='topic-person-update-dev'<Change it for prod topic>
   ```

## This Script will perform following tasks

1.  Get all SIE members of the given rxGroup and/or rxSubGroup
2.  Publish
    `phoneNumber:"X+1##########", isPhoneNumberVerified:false`
    message to the service bus for each unused record with action "PersonUpdate"

## Example scenario

1. On January 1/1/2023, all the HMA Plan members (rxGroup="100L7PR") will be
   terminated, as HMA will no longer have coverage through Prescryptive. There
   are approx 146 members who need to have their PBM/SIE profile terminated, so
   that they can only see Cash pricing and not see PBM pricing post Jan 1.
   - Running this script in prod on 12/30 with RX_GROUP set to "100L7PR" will
     publish
     `phoneNumber:"X+1##########", isPhoneNumberVerified:false`
     for each of those records.
