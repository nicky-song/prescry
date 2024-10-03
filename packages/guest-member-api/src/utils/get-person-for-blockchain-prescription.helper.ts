// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';

export const getPersonForBlockchainPrescription = (
  personList: IPerson[],
  masterId: string
): IPerson | undefined => {
  const cashMember = personList?.find(
    (x) => x.rxGroupType === 'CASH' && x.masterId === masterId
  );

  const sieMember = personList?.find(
    (x) => x.rxGroupType === 'SIE' && x.masterId === masterId
  );

  const highPriorityProfile = sieMember ?? cashMember;

  return highPriorityProfile;
};
