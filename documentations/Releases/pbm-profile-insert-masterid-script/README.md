## Steps to run this script

1. `npm install` to install all dependencies
1. node index.js
1. Create a .env file at root level sample format:

   ```
   DATABASE_CONNECTION_STRING=<DB>
   SERVICE_BUS_CONNECTION_STRING=<service bus connection string>
   DATABASE_NAME=<DB name>
   LIMIT=5
   SLEEP_INTERVAL=1000
   IS_PUBLISH_MESSAGE=false
   IDENTITY_OAUTH_API_BODY='client_id={clientId}&client_secret={clientSecret}&audience={audience}&grant_type=client_credentials'
   IDENTITY_TOKEN_URL=<identity token url>
   IDENTITY_API_CLIENT_ID=<client id>
   IDENTITY_API_CLIENT_SECRET=<client secret>
   IDENTITY_API_RESOURCE='https://gears.test.prescryptive.io/identity/patient'<Change it for prod url>
   IDENTITY_API_AUDIENCE=<url>
   IDENTITY_OCP_APIM_SUBSCRIPTION_KEY=<subscription key>
   TOPIC_PERSON_UPDATE='topic-person-update-dev'<Change it for prod topic>
   ```

## This Script will perform following tasks

1.  CSV file should have the following fields in this order
    `phoneNumber,memberId,masterId`
1.  Read/parse the CSV file`redirect_user_data.csv` and store them as
    `resultArray`
1.  Add a new field `isValid : false` to the resultArray
1.  Remove duplicates from CSV based on the phone number and save it as
    `uniqueRecords`
1.  Validate users
    1. Get the person records using activation phone number given in the CSV
       (uniqueRecords).
    1. Get the patient record using masterId given in the CSV (uniqueRecords).
    1. Validate if first name, last name and date of birth matches in both
       patient and person records.
    1. If they match, update `isValid` to `true` and add the following fields
       ` identifier, firstName, lastName` to the uniqueRecords for publishing
       and logging
1.  publish the valid records to the service bus to insert masterId in person
    record only if `IS_PUBLISH_MESSAGE` is set to `true` in env file
1.  Two loggers `ExceptionLogger` and `RedirectUsers_ProgressLogger` will be
    created. Any Ecxceptions will be stored in exceptionLogger. ProgressLogger
    will store valid user information

### output of this script (batch size 2)

```
Connected successfully to DB
Beginning the delay of 1000 milliseconds...
Finished the delay of 1000 milliseconds.
finished pulling activation Phone number records from database
Total unpublished users found: 2

```

### ExceptionLogger

```
Unable to include this record for publishing: phoneNumber -> +14255169005 , patientRecord -> {"DOB":"2000-05-05"}, filteredDBRecord -> {"firstName":"SHUBHA","lastName":"GUPTA","DOB":"2000-05-05"}
```

### RedirectUsers_ProgressLogger

```
Total records in CSV: 2
Total records to process after removing duplicates: 2
Total records to publish after validating users: 2
{"body":{"action":"PersonUpdate","person":{"identifier":"63037e0d4dfef29ae6ae4b71","masterId":"PINNK0A0","phoneNumber":"+12068497167","primaryMemberRxId":"T123456789901","firstName":"KRISHNA MANJU","lastName":"DUDDELA"}}},
```
