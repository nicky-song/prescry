# Telemetry

---

## Categorized request into 2 parts:

1. Member-info-requests - login, verify code, re-send code, get members, update
   members

2. prescription-info-requests - get prescription, feedback

## Request Flow

### 1. Login

requestid - `abc.1_` **( no change)**

### 2. Verify one time password

API:

- `abc.1_2_` **( no change, just return id )**

UI :

- store this in redux as :

```
{
  "memberInfoRequestId":"abc.1_2_ ",
"prescriptionInfoRequestId":undefined
}
```

### 3. Get members

UI :

- set parentId as "memberInfoRequestId" and generate new operationId
  `abc.1_2_1_`. and send request

API :

capture new request id : `abc.1_2_1_3_`
**(x-prescryptive-member-info-request-id)**

- set as parent operation id

- generate a new operation id for it - `abc.1_2_1_3_member_` and return in
  response **(x-prescryptive-member-info-request-id)**

UI :

update redux store

```
{
"memberInfoRequestId":"abc.1_2_1_3_member_",
"prescriptionInfoRequestId":undefined
}
```

### 4. Get Prescription :

- UI :

- set parentId as "memberInfoRequestId" generate new operationId
  `"abc.1_2_1_3_member_1_"` and send request

API :

capture new request id and return in response : `abc.1_2_1_3_member_1_2_`
**(x-prescryptive-member-info-request-id)**

generate new operation id from the and send in response :
`presciption_parent_id_new_id` **(x-prescryptive-prescripton-info-request-id)**

UI : get id's and update redux :

```
{
"memberInfoRequestId":"abc.1_2_1_3_member_1_2_",
"prescriptionInfoRequestId":"presciption_parent_id_new_id"
}

```

### 5. feedback:

#### **case 1 - when prescriptionInfoRequestId is present .**

UI : if prescriptionInfoRequestId is present than set it as parentId and
generate new operationId

```
parent id : "presciption_parent_id_new_id"

operationId : "presciption_parent_id_new_id_1_"
```

API :

capture new requestid `presciption_parent_id_new_id_1_1_`

and

generate operationId and send in response :
`presciption_parent_id_new_id_1_1_feedback_`
**(x-prescryptive-prescripton-info-request-id)**

UI : Update prescriptionInfoRequestId in store :

```
{
"memberInfoRequestId":"abc.1_2_1_3_member_1_2_",
"prescriptionInfoRequestId":"presciption_parent_id_new_id_1_1_feedback_"
}

```

#### case 2 - when prescriptionInfoRequestId is not present . User send feedback from the member info screen.

UI : set memberInfoRequestId as parentId and generate new operationId
`(abc.1_2_1_3_member_1_2_3_)`

API :

capture new requestid `abc.1_2_1_3_member_1_2_3_4_`

and

generate operationId and send in response :
`abc.1_2_1_3_member_1_2_3_4_feedback_`
**(x-prescryptive-prescripton-info-request-id)**

UI : check if prescriptionInfoRequestId is undefined tha set it as
memberInfoRequestId

```
{
"memberInfoRequestId":"abc.1_2_1_3_member_1_2_3_4_feedback_",
"prescriptionInfoRequestId": undefined
}

```
