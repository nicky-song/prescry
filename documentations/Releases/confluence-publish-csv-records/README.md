## Intro:

This script takes a csv file(confluence_user_data.csv) and process records to
remove duplicates if any and then publish the record to service bus in the
intervals of batchsize.

template should be in below format :- Identifier PhoneNumber PBMMemberID
Age_18_or_Older? LastName FirstName MemberDOB

## Steps to run this script

1. `npm install` to install all dependencies

2. node index.js
   `<serviceBusConnectionString> <isTestMode> <isPublishMessage> <batchSize>`

   eg: node index.js <connection string> true false 1000

## Loggers:

ConfluenceUsers*<currenttimestamp>.log will log all published records
UnpublishedRecords*<currentTimestamp>.json file will have processed but
unpublished records. This file willbe updated when ispublishedmessage is set to
false.
