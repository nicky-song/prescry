## Steps to run this script

1. `npm install` to install all dependencies
2. node index.js
   `<orderNumberStartingValue> <DatabaseName> <batchSize> <serviceBusConnectionString> <DatabaseConnectionString>`

   ```
   node index.js 10000 RxAssistant_dev 1000 svc_connection db_connection
   ```

## This Script will perform following tasks

1.  Find all account records that has date of birth.
2.  Find if there is a cash record for that account phone number
3.  Publish message to the service bus to create person record
4.  Wait for 5 seconds after each batchSize execution
5.  Commented the code to publish person creation message to avoid any
    accidental creations.
6.  build-person-record.js should be updated to actually publish the records

### output of this script (batch size 2)

```
Connected successfully to DB
Publishing +12345678910 FamilyId CA15SK
Total number of account records processed 2
Publishing +11111111111 FamilyId CA15SM
Publishing +12222222222 FamilyId CA15SN
Total number of account records processed 4
Publishing +13333333333 FamilyId CA15SO
Total number of person records published 4
Done processed total 5 account records

```
