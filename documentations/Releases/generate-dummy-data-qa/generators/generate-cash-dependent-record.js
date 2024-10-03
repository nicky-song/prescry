// Copyright 2022 Prescryptive Health, Inc.


import { ObjectId } from 'mongodb';

export const generateCashDependentPersonRecord = (familyId, personCode,  firstName, lastName,  day, month, year, address1, city, state, zip, county, effectiveDate) => {
    
    var dependentYear = personCode === '03' ? year + 1 : year + 2;
    var dependentDay = personCode === '03' ? day + 1 : day - 1;
    if (dependentDay < 1 || dependentDay > 28)
    {
        dependentDay = 1;
    }

    var dependentMonth = personCode === '03' ? month + 1 : month - 2;
    if (dependentMonth < 1 || dependentMonth > 12)
    {
        dependentMonth = 1;
    }

    const dependentDateOfBirth = `${dependentYear.toString()}-${dependentMonth.toString().padStart(2,'0')}-${dependentDay.toString().padStart(2,'0')}`
    return {
        identifier : new ObjectId().toHexString(), 
        firstName: `DEP-${personCode}-${firstName}`,
        lastName: `DEP-${personCode}-${lastName}`,
        dateOfBirth: dependentDateOfBirth,
        email:'',
        phoneNumber:'',
        primaryMemberRxId : `${familyId}${personCode}`, 
        effectiveDate, 
        isPhoneNumberVerified : false, 
        isPrimary : false, 
        isRxAssistantOnboarded : false, 
        isTestMembership : false, 
        primaryMemberFamilyId : familyId, 
        primaryMemberPersonCode : personCode, 
        rxSubGroup : "CASH01", 
        rxGroup : "200P32F", 
        rxGroupType : "CASH", 
        rxBin : "610749", 
        carrierPCN : "X01", 
        address1,
        city, 
        state,
        zip,
        county,
        isDummy: true
     };
 }

