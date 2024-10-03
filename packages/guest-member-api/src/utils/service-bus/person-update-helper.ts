// Copyright 2018 Prescryptive Health, Inc.

import {
  ACTION_FINISH_PHONE_NUMBER_VERIFICATION,
  ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
  ACTION_CREATE_PERSON,
  ACTION_UPDATE_PERSON,
} from '../../constants/service-bus-actions';
import { IPerson } from '@phx/common/src/models/person';

import { senderForUpdatePerson } from './service-bus-helper';

export type ACTIONS_PERSON_UPDATE =
  | 'FinishPhoneNumberVerification'
  | 'AcceptTermsAndConditions'
  | 'UpdatePersonContactInformation'
  | 'PersonUpdate'
  | 'UpdateMasterId';

export type UpdatedField = keyof Omit<
  IPersonUpdate,
  'updatedFields' | 'recentlyUpdated' | 'identifier'
>;

export interface IPersonUpdate {
  identifier: string;
  phoneNumber?: string;
  email?: string;
  secondaryAlertCarbonCopyIdentifier?: string;
  secondaryAlertChildCareTakerIdentifier?: string;
  address1?: string;
  address2?: string;
  county?: string;
  city?: string;
  state?: string;
  zip?: string;
  masterId?: string;
  accountId?: string;
  recentlyUpdated?: boolean;
  updatedFields?: UpdatedField[];
}

export const publishPhoneNumberVerificationMessage = async (
  identifier: string,
  phoneNumber: string
) => {
  await publishPersonUpdateMessage(ACTION_FINISH_PHONE_NUMBER_VERIFICATION, {
    identifier,
    phoneNumber,
    recentlyUpdated: true,
    updatedFields: ['phoneNumber'],
  });
};

export const publishPersonUpdateAddressMessage = async (
  identifier: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  zip: string,
  county?: string
) => {
  await publishPersonUpdateMessage(ACTION_UPDATE_PERSON, {
    identifier,
    address1,
    address2,
    city,
    state,
    zip,
    county,
    recentlyUpdated: true,
    updatedFields: ['address1', 'address2', 'city', 'state', 'zip', 'county'],
  });
};

export const publishPersonUpdatePatientDetailsMessage = async (
  identifier: string,
  masterId: string,
  accountId?: string
) => {
  await publishPersonUpdateMessage(ACTION_UPDATE_PERSON, {
    identifier,
    masterId,
    ...(accountId && { accountId }),
  });
};

export const publishUpdatePersonContactInformationMessage = async (
  identifier: string,
  secondaryMemberIdentifier: string,
  editingAdultMemberInformation: boolean,
  phoneNumber: string,
  email: string
) => {
  if (editingAdultMemberInformation) {
    await publishPersonUpdateMessage(ACTION_UPDATE_PERSON_CONTACT_INFORMATION, {
      email,
      identifier,
      phoneNumber,
      secondaryAlertCarbonCopyIdentifier: secondaryMemberIdentifier,
    });
  } else {
    await publishPersonUpdateMessage(ACTION_UPDATE_PERSON_CONTACT_INFORMATION, {
      email,
      identifier,
      phoneNumber,
      secondaryAlertChildCareTakerIdentifier: secondaryMemberIdentifier,
    });
  }
};

export const publishPersonUpdateMessage = async (
  action: ACTIONS_PERSON_UPDATE,
  person: IPersonUpdate
) => {
  await senderForUpdatePerson.send({
    body: {
      action,
      person,
    },
  });
};

export const publishPersonCreateMessage = async (
  person: IPerson
): Promise<void> => {
  await senderForUpdatePerson.send({
    body: {
      action: ACTION_CREATE_PERSON,
      person,
    },
  });
};
