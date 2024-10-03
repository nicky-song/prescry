// Copyright 2023 Prescryptive Health, Inc.

import { Request } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { publishPersonUpdateAddressMessage } from '../../../utils/service-bus/person-update-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';

export async function updatePersonDetailsIfNecessary(
  request: Request,
  personInfo: IPerson | undefined
): Promise<IPerson | undefined> {
  const { memberAddress } = request.body;
  if (!personInfo) {
    return;
  }
  const personAddress = {
    address1: personInfo.address1,
    address2: personInfo.address2,
    city: personInfo.city,
    state: personInfo.state,
    zip: personInfo.zip,
    county: personInfo.county,
  } as IMemberAddress;
  if (!AddressValidator.isAddressValid(personAddress)) {
    personInfo.address1 = memberAddress.address1.trim().toUpperCase();
    personInfo.address2 = (memberAddress.address2?.trim() ?? '').toUpperCase();
    personInfo.county = memberAddress.county.trim().toUpperCase();
    personInfo.city = memberAddress.city.trim().toUpperCase();
    personInfo.state = memberAddress.state.toUpperCase();
    personInfo.zip = memberAddress.zip;
    await publishPersonUpdateAddressMessage(
      personInfo.identifier,
      personInfo.address1 || '',
      personInfo.address2 || '',
      personInfo.city || '',
      personInfo.state || '',
      personInfo.zip || '',
      personInfo.county || ''
    );
  }
  return personInfo;
}
