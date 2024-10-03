// Copyright 2020 Prescryptive Health, Inc.

import { LoginMessages } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { IPerson } from '@phx/common/src/models/person';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import {
  IUpdatePrescriptionParams,
  updatePrescriptionWithMemberId,
} from '../../prescription/helpers/update-prescriptions-with-member-id';
import { ForbiddenRequestError } from '../../../errors/request-errors/forbidden.request-error';
import { findCashProfile } from '../../../utils/person/find-profile.helper';

export const existingAccountHelper = async (
  database: IDatabase,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  recoveryEmail: string,
  configuration: IConfiguration,
  address?: IMemberAddress,
  updatePrescriptionParams?: IUpdatePrescriptionParams,
  familyId?: string,
  masterId?: string,
  accountId?: string
): Promise<string | undefined> => {
  const existingAccount = await searchAccountByPhoneNumber(
    database,
    phoneNumber
  );
  if (existingAccount?.dateOfBirth) {
    throw new ForbiddenRequestError(LoginMessages.PHONE_NUMBER_EXISTS);
  }

  await publishAccountUpdateMessageAndAddToRedis(
    {
      dateOfBirth,
      firstName: firstName.toUpperCase().trim(),
      lastName: lastName.toUpperCase().trim(),
      phoneNumber,
      recoveryEmail,
      ...(masterId && { masterId }),
      ...(accountId && { accountId }),
      recentlyUpdated: true,
    },
    configuration.redisPhoneNumberRegistrationKeyExpiryTime
  );

  const personList: IPerson[] = await getAllRecordsForLoggedInPerson(
    database,
    phoneNumber
  );

  const cashProfile = findCashProfile(personList);

  let primaryMemberFamilyId = cashProfile?.primaryMemberFamilyId ?? familyId;

  if (!cashProfile) {
    const person = await createCashProfileAndAddToRedis(
      database,
      configuration,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      recoveryEmail,
      address,
      masterId,
      accountId,
      familyId
    );

    primaryMemberFamilyId = person.primaryMemberFamilyId;

    if (
      updatePrescriptionParams &&
      !updatePrescriptionParams.clientPatientId.length &&
      person.primaryMemberRxId
    ) {
      updatePrescriptionParams.clientPatientId = person.primaryMemberRxId;
    }
  }

  if (updatePrescriptionParams?.clientPatientId.length) {
    await updatePrescriptionWithMemberId(
      updatePrescriptionParams,
      configuration
    );
  }

  return primaryMemberFamilyId;
};
