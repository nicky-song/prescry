// Copyright 2022 Prescryptive Health, Inc.

import { ObjectId } from 'mongodb';

export const generateCashPrimaryPersonRecord = (
  i,
  phoneNumber,
  firstName,
  lastName,
  dateOfBirth,
  email,
  effectiveDate,
  familyIdPrefix
) => {
  var familyId = `${familyIdPrefix}${i.toString().padStart(6, 0)}`;
  var cashPerson = {
    identifier: new ObjectId().toHexString(),
    phoneNumber,
    firstName,
    lastName,
    dateOfBirth,
    email,
    primaryMemberRxId: `${familyId}01`,
    effectiveDate,
    isPhoneNumberVerified: true,
    isPrimary: true,
    isRxAssistantOnboarded: false,
    isTestMembership: false,
    primaryMemberFamilyId: familyId,
    primaryMemberPersonCode: '01',
    rxSubGroup: 'CASH01',
    rxGroup: '200P32F',
    rxGroupType: 'CASH',
    rxBin: '610749',
    carrierPCN: 'X01',
    isDummy: true,
  };

  return cashPerson;
};
