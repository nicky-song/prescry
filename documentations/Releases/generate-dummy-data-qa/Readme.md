## Steps to run this script

1. `npm install` to install all dependencies
2. node index.js `node index.js`
3. Create a .env file at root level sample format:

   ```
   DATABASE_CONNECTION_STRING=<DB>
   DATABASE_NAME=<RxAssistant DB name>
   BENEFIT_DATABASE_NAME=<Benefit DB Name>
   BATCH_SIZE=<Number of account record to be created in each batch eg 200>
   TOTAL_RECORDS=<Total Number of Account records to be created eg 200000>
   SLEEP_INTERVAL=<Total wait time in milliseconds between batches e.g. 10000>
   START_PHONE=<Start for the phonenumber, need to be in 10 digit eg 1111111110 Or 2222222220>
   EDGE_CASE_RECORDS_CASH=<Number of record to be created for cancel as well as empty phone number eg 10>
   EDGE_CASE_RECORDS_SIE=<Number of record to be created for sie only recods as well as recrds with different info eg 25>
   ```

   Example with no secret values

   ```
   DATABASE_CONNECTION_STRING=<Replace>
   DATABASE_NAME=RxAssistant_dev
   BENEFIT_DATABASE_NAME=Benefit
   BATCH_SIZE=100
   TOTAL_RECORDS=3000
   ACTIVATION_TOTAL_RECORDS=100
   SLEEP_INTERVAL=20000
   START_PHONE=1111111111
   EDGE_CASE_RECORDS_CASH=10
   EDGE_CASE_RECORDS_SIE=25
   ```

## This Script will perform following tasks

1.  Add TOTAL_RECORDS count account records
2.  Add TOTAL_RECORDS count account records where every alternate cash profile
    will have address
3.  Add address for every alternate record (DONE)Generates FHIR endpoint bearer
    token and Identity service endpoint bearer token globally and uses it while
    creating patient record in PII.
4.  Add 2 dependnets for every 4th cash profile
5.  Add SIE Primary with phone after every 5 and its benefit Person
6.  Add SIE Secondary with phone after every 10 and its benefit Person (Add
    records for its Primary too without phone number)
7.  Add ACTIVATION_TOTAL_RECORDS SIE records with activationPhone number with
    its benefit Person (No Account Records/ Cash profiles)
8.  Add just SIE records with phone number with its benefit Person (No Account
    Records): Edge Case
9.  Add Cancelled Users profile: Edge Case
10. Add Cash Users profiles with empty phone numbers: Edge Case
11. Add records where SIE and Cash profiles have different information: Edge
    Case
12. TODO: Add SIE dependent every 20th record and its benefit Person
13. TODO: Generate SIE without benefit Person record : Edge Case

### Additional Details

1. Run a query in prod to find exception cases a. How many users has only PBM
   profile with phone number (n no CASH profile) b. How many "Registered" users
   has has PBM n cash both profile but CASH n PBM has different DOB c. How many
   "Registered"users has has PBM n cash both profile but CASH n PBM has
   different firstName or lastName d. How many "Registered" users has PBM
   profile but either no record in benefit OR the profile is terminated

### Script to delete records in Studio 3T

```
use RxAssistant_dev

print("Dummy Account count");
db.getCollection("Account").count({isDummy:true})

print("Dummy Person count");
db.getCollection("Person").count({isDummy:true})

use Benefit

print("Dummy Benefit Person count");
db.getCollection("Person").count({isDummy:true})

use RxAssistant_dev

var bulkAccount = db.getCollection("Account").initializeUnorderedBulkOp();
bulkAccount.find({isDummy:true} ).remove();

print("Deleting dummy accounts");
bulkAccount.execute();

var bulkPerson = db.getCollection("Person").initializeUnorderedBulkOp();
bulkPerson.find( {isDummy:true} ).remove();

print("Deleting dummy persons");
bulkPerson.execute();

use Benefit

var bulkBenefitPerson = db.getCollection("Person").initializeUnorderedBulkOp();
bulkBenefitPerson.find({isDummy:true} ).remove();

print("Deleting dummy benefit persons");
bulkBenefitPerson.execute();

```
