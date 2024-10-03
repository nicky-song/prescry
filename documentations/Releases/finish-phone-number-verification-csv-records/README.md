## Steps to run this script

1. `npm install` to install all dependencies
2. node index.js
   `node index.js <serviceBusConnectionString> <isTestMode> <isPublishMessage> <batchSize>`

   ```
   node index.js svc_connection_string true false 10
   ```

## Pre-setup

1.  Uncomment out the code that does the update in script script_final_v1.txt.
    This to avoid accidental changes.
2.  Execute script script_final_v1.txt
3.  Copy the filter data string for "with phone number"
4.  Populate this filter in script
    get_uniqueIds_filter_benefits_db_person_coverage_collection.txt
5.  Execute script
    get_uniqueIds_filter_benefits_db_person_coverage_collection.txt
6.  Copy the filter output from this script
7.  In Studio3t, with copied filter for Person collection, project results with
    identifier and phoneNumber only. Note: attribute "\_id" is included by
    default.
8.  Export the results back into a CSV file by right clicking with your mouse on
    the result set from Studio3t. Name the file
    phone_numbers_to_complete_verfication.csv.
9.  In notepad/notepad++, remove header record. Save. Make sure csv file is in
    same location as index.js.
10. Execute NodeJS script index.js with the command from above.

## This Script will perform following tasks

1.  Process all records in CSV file phone_numbers_to_complete_verfication.csv
2.  Publish message to the service bus for each record with action
    "FinishPhoneNumberVerification"
3.  Wait the specified time in seconds after each batchSize execution

### output of this script (batch size 2)

```
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e4616e825b606f043654ade","phoneNumber":"+11112223344"}}}
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e5616e825b606f043654ade","phoneNumber":"+11112223355"}}}
Beginning the delay of 10000 milliseconds...
Finished the delay of 10000 milliseconds.
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e6616e825b606f043654ade","phoneNumber":"+11112223366"}}}
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e7616e825b606f043654ade","phoneNumber":"+11112223377"}}}
Beginning the delay of 10000 milliseconds...
Finished the delay of 10000 milliseconds.
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e8616e825b606f043654ade","phoneNumber":"+11112223388"}}}
Calling service bus with this message: {"body":{"action":"FinishPhoneNumberVerification","person":{"identifier":"2e8626e825b606f043654ade","phoneNumber":"+11112223399"}}}
Beginning the delay of 10000 milliseconds...
Finished the delay of 10000 milliseconds.
```
