// Copyright 2021 Prescryptive Health, Inc.
import moment from 'moment';
import { UTCDateString } from './date-time.helper.js';
import fs from 'fs';

export const buildPersonRecord = async (
  senderForUpdatePerson,
  firstName,
  lastName,
  dob,
  phoneNumber,
  email,
  orderNumber,
  logger
) => {
  const primaryMemberFamilyId = `CA${orderNumber.toString(35).toUpperCase()}`;
  const person = {
    firstName,
    lastName,
    dateOfBirth: UTCDateString(dob),
    effectiveDate: moment(new Date().toUTCString()).format('YYYYMMDD'),
    identifier: '',
    rxSubGroup: 'CASH01',
    rxGroup: '200P32F',
    primaryMemberFamilyId,
    primaryMemberRxId: primaryMemberFamilyId + '01',
    rxGroupType: 'CASH',
    rxBin: '610749',
    carrierPCN: 'X01',
    isPhoneNumberVerified: true,
    phoneNumber,
    isPrimary: true,
    email,
    primaryMemberPersonCode: '01',
    isTestMembership: false,
  };
  console.log(
    `Publishing ${phoneNumber} FamilyId ${primaryMemberFamilyId} DOB ${person.dateOfBirth} First ${person.firstName} Last ${person.lastName}`
  );
  
  fs.appendFileSync(logger, JSON.stringify({
    body: {
      action: 'CreatePerson',
      person,
    },
  }));
  fs.appendFileSync(logger, ',');
  /*
  await senderForUpdatePerson.sendMessages({
    body: {
      action: 'CreatePerson',
      person,
    },
  });
  */
};
